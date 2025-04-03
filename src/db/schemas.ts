import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  boolean,
  integer,
  timestamp
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const Products = pgTable("product", {
  id: text("xata_id").primaryKey(),
  name: varchar("name", { length: 50 }),
  barcode: varchar("barcode", { length: 50 }),
  quantity: integer("quantity"),
  expiresAt: timestamp("expiresat"),
  createdAt: timestamp("xata_createdat").defaultNow(),
  updatedAt: timestamp("xata_updatedat").defaultNow()
});
