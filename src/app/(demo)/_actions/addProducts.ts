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
  like,
} from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { produce } from "immer";

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);

export const addProduct = async (productData: {
  productName: string;
  barcode: string;
  quantity: number;
  expirationDate: string;
}) => {
  try {
    // Check if a product with the same barcode already exists
    const existingProduct = await db
      .select()
      .from(Products)
      .where(eq(Products.barcode, productData.barcode))
      .limit(1);

    if (existingProduct.length > 0) {
      // Create a custom error object with a specific type
      return {
        error: "DUPLICATE_BARCODE",
        message: "A product with this barcode already exists",
      };
    }

    // Insert the new product into the database
    const result = await db
      .insert(Products)
      .values({
        id: crypto.randomUUID(),
        name: productData.productName,
        barcode: productData.barcode,
        quantity: productData.quantity,
        quantityNotif: true,
        expiresAt: new Date(productData.expirationDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/inventory");

    return { data: result[0] };
  } catch (error) {
    console.error("Error adding product:", error);
    return { error: "SERVER_ERROR", message: "Failed to add product" };
  }
};

export const updateProduct = async (
  productId: string,
  barcode: string,
  updatedData: {
    productName?: string;
    quantity?: number;
    expirationDate?: string;
    newBarcode?: string;
  },
) => {
  try {
    // Check if the product exists
    const existingProduct = await db
      .select()
      .from(Products)
      .where(eq(Products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return {
        error: "NOT_FOUND",
        message: "No product found",
      };
    }

    // Determine the updated quantity (use existing if not provided)
    const updatedQuantity =
      updatedData.quantity ?? existingProduct[0].quantity ?? 0;

    // Set quantityNotif based on the updated quantity
    const quantityNotif = updatedQuantity < 10;

    // Update the product details
    const result = await db
      .update(Products)
      .set({
        name: updatedData.productName || existingProduct[0].name,
        quantity: updatedQuantity,
        expiresAt: updatedData.expirationDate
          ? new Date(updatedData.expirationDate)
          : existingProduct[0].expiresAt,
        barcode: updatedData.newBarcode || barcode,
        updatedAt: new Date(),
        quantityNotif,
      })
      .where(eq(Products.barcode, barcode))
      .returning();

    revalidatePath("/inventory");

    return { data: result[0] };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "SERVER_ERROR", message: "Failed to update product" };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    // Check if the product exists
    const existingProduct = await db
      .select()
      .from(Products)
      .where(eq(Products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return {
        error: "NOT_FOUND",
        message: "No product found",
      };
    }

    // Delete the product
    await db.delete(Products).where(eq(Products.id, productId));

    revalidatePath("/inventory");

    return { message: "Product successfully deleted" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "SERVER_ERROR", message: "Failed to delete product" };
  }
};
