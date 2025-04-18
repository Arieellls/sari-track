"use server";

import { XataHttpClient } from "drizzle-orm/xata-http";
import { drizzle } from "drizzle-orm/xata-http";
import { getXataClient } from "../../../db/xata-client";
import { Products } from "@/db/schema";
import {
  desc,
  and,
  asc,
  isNotNull,
  lte,
  gt,
  eq,
  like
} from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);

export const getAllProducts = async () => {
  try {
    const requests = await db
      .select()
      .from(Products)
      .orderBy(desc(Products.createdAt));

    return requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

export const getStock = async () => {
  try {
    const outOfStockProducts = await db
      .select()
      .from(Products)
      .where(gt(Products.quantity, 0))
      .orderBy(desc(Products.createdAt));

    return outOfStockProducts;
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    return [];
  }
};

export const getNearExpiration = async () => {
  try {
    const currentDate = new Date();

    const products = await db
      .select()
      .from(Products)
      .where(
        and(
          isNotNull(Products.expiresAt),
          lte(
            Products.expiresAt,
            new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
          ),
          gt(Products.expiresAt, currentDate),
          gt(Products.quantity, 0) // Ensure quantity is greater than 0
        )
      )
      .orderBy(asc(Products.expiresAt));

    return products;
  } catch (error) {
    console.error("Error fetching near-expiration products:", error);
    return [];
  }
};

export const getOutOfStockProducts = async () => {
  try {
    const outOfStockProducts = await db
      .select()
      .from(Products)
      .where(eq(Products.quantity, 0))
      .orderBy(desc(Products.createdAt));

    return outOfStockProducts;
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    return [];
  }
};

export const searchProduct = async (searchTerm: string) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return null;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const products = await db
      .select()
      .from(Products)
      .where(like(sql`LOWER(${Products.name})`, `%${lowerCaseSearchTerm}%`));

    return products.length > 0 ? products : null;
  } catch (error) {
    console.error("Error searching for product:", error);
    return null;
  }
};

export const getLowStockProducts = async () => {
  try {
    const lowStockProducts = await db
      .select()
      .from(Products)
      .where(lte(Products.quantity, 10))
      .orderBy(asc(Products.quantity)); // sort by lowest quantity first

    return lowStockProducts;
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return [];
  }
};

interface UpdateProductQuantityResponse {
  success: boolean;
  error?: unknown;
}

export const updateProductQuantity = async (
  productId: string,
  newQuantity: number
): Promise<UpdateProductQuantityResponse> => {
  try {
    await db
      .update(Products)
      .set({ quantity: newQuantity })
      .where(eq(Products.id, productId));

    console.log(`Updated product ${productId} quantity to ${newQuantity}`);
    revalidatePath("/alerts-and-notifications"); // Revalidate the inventory page to reflect changes
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error(`Error updating product ${productId} quantity:`, error);
    return { success: false, error };
  }
};

export const updateProductExpiry = async (id: string, expiryDate: string) => {
  try {
    const updatedProduct = await db
      .update(Products)
      .set({ expiresAt: new Date(expiryDate) })
      .where(eq(Products.id, id));

    if (updatedProduct) {
      revalidatePath("/alerts-and-notifications"); // Revalidate the inventory page to reflect changes
      return { success: true };
    } else {
      throw new Error("Product not found or failed to update expiry date.");
    }
  } catch (error) {
    console.error("Error updating product expiry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred."
    };
  }
};
