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
import axios from "axios";

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

export const deleteUser = async (
  userId: string,
): Promise<{ success: boolean; error?: string }> => {
  if (!userId) {
    return { success: false, error: "User ID is required for deletion." };
  }

  try {
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser.length) {
      return { success: false, error: `User with ID ${userId} not found.` };
    }

    const userToDelete = foundUser[0];

    if (userToDelete.role === "admin" || userToDelete.role === "owner") {
      return {
        success: false,
        error: "Cannot delete a user with the role 'admin' or 'owner'.",
      };
    }

    await db.delete(user).where(eq(user.id, userId));
    revalidatePath("/users");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: `An error occurred while deleting user: ${error.message}`,
    };
  }
};

export const changeUserRole = async (
  userId: string,
  newRole: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch the current role of the user
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser.length) {
      return { success: false, message: "User not found." };
    }

    if (existingUser[0].role === "admin" || existingUser[0].role === "owner") {
      return {
        success: false,
        message:
          "You are not allowed to change the role of an admin or owner user.",
      };
    }

    await db.update(user).set({ role: newRole }).where(eq(user.id, userId));

    const message = `User ${userId} role changed to ${newRole} successfully.`;
    console.log(message);
    revalidatePath("/users");

    return { success: true, message };
  } catch (error) {
    const message = `Error changing role for user ${userId}: ${error}`;
    console.error(message);
    return { success: false, message };
  }
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fgynascv");
  formData.append("folder", "sari-track");

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
  );

  return response.data.secure_url;
};

export const updateUserInfo = async (
  userId: string,
  newEmail: string,
  newName: string,
  newImage?: string | null,
) => {
  try {
    const updateData: { email: string; name: string; image?: string } = {
      email: newEmail,
      name: newName,
    };

    if (newImage !== undefined) {
      if (newImage !== null) {
        updateData.image = newImage;
      }
    }

    await db.update(user).set(updateData).where(eq(user.id, userId));

    console.log(
      `User ${userId} updated successfully: email=${newEmail}, name=${newName}, image=${newImage ? "updated" : "unchanged"}`,
    );
    revalidatePath("/users");
    return true;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    return false;
  }
};
