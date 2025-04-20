import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { produce } from "immer";
import { z } from "zod";

export const Products = pgTable("product", {
  id: text("xata_id").primaryKey(),
  name: varchar("name", { length: 50 }),
  barcode: varchar("barcode", { length: 50 }),
  quantity: integer("quantity"),
  expiresAt: timestamp("expiresat"),
  createdAt: timestamp("xata_createdat").defaultNow(),
  updatedAt: timestamp("xata_updatedat").defaultNow(),
  quantityNotif: boolean("quantity_notif").notNull(),
});

export const reorder = pgTable("reorder", {
  id: text("xata_id").primaryKey(),
  productId: text("product_id").references(() => Products.id),
  status: varchar("status", { length: 20 }).default("pending"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastReorder: timestamp("last_reorder"),
  reorder_count: integer("reorder_count"),
});

// export const User = pgTable("user", {
//   id: text("xata_id").primaryKey(),
//   firstName: varchar("first_name", { length: 50 }),
//   lastName: varchar("last_name", { length: 50 }),
//   middleName: varchar("middle_name", { length: 50 }),
//   birthday: timestamp("expiresat"),
//   email: varchar("email", { length: 100 }).notNull().unique(),
//   password: varchar("password", { length: 255 }).notNull(),
//   createdAt: timestamp("xata_createdat").defaultNow(),
//   updatedAt: timestamp("xata_updatedat").defaultNow()
// });

export const user = pgTable("user", {
  id: text("xata_id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdat").notNull(),
  updatedAt: timestamp("updatedat").notNull(),
  role: text("role").notNull().default("staff"),
  isApproved: boolean("isApproved").notNull().default(false),
});

export const session = pgTable("session", {
  id: text("xata_id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const account = pgTable("account", {
  id: text("xata_id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdat").defaultNow(),
  updatedAt: timestamp("updatedat").defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("xata_id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("createdat").defaultNow(),
  updatedAt: timestamp("updatedat").defaultNow(),
});

export const schema = { Products, user, session, account, verification };
