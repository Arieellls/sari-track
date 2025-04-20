"use server";

import { XataHttpClient } from "drizzle-orm/xata-http";
import { drizzle } from "drizzle-orm/xata-http";
import { getXataClient } from "../../../db/xata-client";
import { Products, reorder } from "@/db/schema";
import {
  desc,
  and,
  asc,
  isNotNull,
  lte,
  gt,
  eq,
  lt,
  like,
  gte,
} from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);

export const addReorder = async (reorderData: {
  product_id: string;
  remarks?: string;
  status: string;
}) => {
  try {
    const existingReorder = await db
      .select()
      .from(reorder)
      .where(eq(reorder.productId, reorderData.product_id));

    // Update quantity_notif in Products table regardless of the scenario
    await db
      .update(Products)
      .set({ quantityNotif: false })
      .where(eq(Products.id, reorderData.product_id));

    if (existingReorder.length > 0) {
      // Product already exists in reorder table
      if (reorderData.status === "accepted") {
        await db
          .update(reorder)
          .set({
            reorder_count: sql`reorder_count + 1`,
            remarks: reorderData.remarks,
            lastReorder: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(reorder.productId, reorderData.product_id));

        revalidatePath("/alerts-and-notifications");
        return { data: "REORDER_COUNT_UPDATED" };
      }

      // If not accepted, don't update reorder_count, but product notif already updated
      revalidatePath("/alerts-and-notifications");
      return { data: "ALREADY_EXISTS_NO_UPDATE" };
    }

    // Insert new reorder row
    const result = await db
      .insert(reorder)
      .values({
        id: crypto.randomUUID(),
        productId: reorderData.product_id,
        status: reorderData.status,
        remarks: reorderData.remarks,
        createdAt: new Date(),
        updatedAt: new Date(),
        reorder_count: reorderData.status === "accepted" ? 1 : 0,
        lastReorder: reorderData.status === "accepted" ? new Date() : null,
      })
      .returning();

    revalidatePath("/alerts-and-notifications");

    return { data: result[0] };
  } catch (error) {
    console.error("Error adding reorder record:", error);
    return { error: "SERVER_ERROR", message: "Failed to add reorder record" };
  }
};

export const getReorderHistory = async () => {
  try {
    const requests = await db
      .select({
        reorderId: reorder.id,
        productId: reorder.productId,
        status: reorder.status,
        remarks: reorder.remarks,
        createdAt: reorder.createdAt,
        updatedAt: reorder.updatedAt,
        lastReorder: reorder.lastReorder,
        productName: Products.name,
      })
      .from(reorder)
      .leftJoin(Products, eq(reorder.productId, Products.id))
      .orderBy(desc(reorder.createdAt));

    return requests;
  } catch (error) {
    console.error("Error fetching reorder history:", error);
    return [];
  }
};

export const bestSellingProduct = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const bestSellers = await db
      .select({
        reorderId: reorder.id,
        productId: reorder.productId,
        status: reorder.status,
        remarks: reorder.remarks,
        createdAt: reorder.createdAt,
        updatedAt: reorder.updatedAt,
        lastReorder: reorder.lastReorder,
        productName: Products.name,
        reorderCount: reorder.reorder_count,
      })
      .from(reorder)
      .leftJoin(Products, eq(reorder.productId, Products.id))
      .where(
        and(
          gte(reorder.reorder_count, 3),
          gte(reorder.lastReorder, oneMonthAgo),
        ),
      )
      .orderBy(desc(reorder.createdAt));

    return bestSellers;
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return [];
  }
};

export const slowMovingProduct = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const slowMovers = await db
      .select({
        reorderId: reorder.id,
        productId: reorder.productId,
        status: reorder.status,
        remarks: reorder.remarks,
        createdAt: reorder.createdAt,
        updatedAt: reorder.updatedAt,
        lastReorder: reorder.lastReorder,
        productName: Products.name,
        reorderCount: reorder.reorder_count,
      })
      .from(reorder)
      .leftJoin(Products, eq(reorder.productId, Products.id))
      .where(
        and(lt(reorder.reorder_count, 3), lt(reorder.lastReorder, oneMonthAgo)),
      )
      .orderBy(desc(reorder.createdAt));

    return slowMovers;
  } catch (error) {
    console.error("Error fetching slow moving products:", error);
    return [];
  }
};
