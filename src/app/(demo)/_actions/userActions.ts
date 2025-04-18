"use server";

import { XataHttpClient } from "drizzle-orm/xata-http";
import { drizzle } from "drizzle-orm/xata-http";
import { getXataClient } from "../../../db/xata-client";
import { Products, user } from "@/db/schema";
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

const xata: XataHttpClient = getXataClient() as unknown as XataHttpClient;
const db = drizzle(xata);

export const getAllUsers = async () => {
  try {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.isApproved, true))
      .orderBy(asc(user.name));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getAllUsersNeedsApproval = async () => {
  try {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.isApproved, false))
      .orderBy(desc(user.createdAt));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const approveUser = async (userId: string) => {
  if (!userId) {
    console.error("User ID is required for approval.");
    return false;
  }

  try {
    await db.update(user).set({ isApproved: true }).where(eq(user.id, userId));

    console.log(`User ${userId} approved successfully.`);
    revalidatePath("/users");
    return true;
  } catch (error) {
    console.error(`Error approving user ${userId}:`, error);
    return false;
  }
};

export const declineUser = async (userId: string) => {
  try {
    await db.delete(user).where(eq(user.id, userId));

    console.log(`User ${userId} declined successfully.`);
    revalidatePath("/users");
    return true;
  } catch (error) {
    console.error(`Error declining user ${userId}:`, error);
    return false;
  }
};

export const changeUserRole = async (userId: string, newRole: string) => {
  try {
    await db.update(user).set({ role: newRole }).where(eq(user.id, userId));

    console.log(`User ${userId} role changed to ${newRole} successfully.`);
    revalidatePath("/users");
    return true;
  } catch (error) {
    console.error(`Error changing role for user ${userId}:`, error);
    return false;
  }
};
