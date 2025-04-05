"use client";

import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../_actions/getProducts";
import ProductTile from "../inventory/ProductTile";

interface Product {
  id: string;
  name: string | null;
  barcode?: string | null;
  quantity: number | null;
  expiresAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface ProductsProps {
  productsNearExpiration: Product[];
  lowStockProducts: Product[];
}

export default function AlertsProducts({
  productsNearExpiration = [],
  lowStockProducts = []
}: ProductsProps) {
  return (
    <div className="flex flex-col gap-8 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-[100%]">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Low Stock Items</h1>
        <div className="w-full flex flex-col gap-4 sm:flex-wrap sm:flex-row">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <ProductTile
                key={product.id}
                id={product.id}
                name={product.name || "Unknown Product"}
                quantity={product.quantity || 0}
                expires={
                  product.expiresAt
                    ? product.expiresAt.toISOString()
                    : "No Expiry Date"
                }
                destructive={true}
                section="low-stock"
              />
            ))
          ) : (
            <p className="text-gray-500">No low stock items.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Items Approaching Expiry</h1>
        <div className="w-full flex flex-col gap-4 sm:flex-wrap sm:flex-row">
          {productsNearExpiration.length > 0 ? (
            productsNearExpiration.map((product) => (
              <ProductTile
                key={product.id}
                id={product.id}
                name={product.name || "Unknown Product"}
                quantity={product.quantity || 0}
                expires={
                  product.expiresAt
                    ? product.expiresAt.toISOString()
                    : "No Expiry Date"
                }
                destructive={true}
                section="expiry"
              />
            ))
          ) : (
            <p className="text-gray-500">No low stock items.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Automated Reordering Suggestions</h1>
        <div className="w-full flex flex-col gap-4 sm:flex-wrap sm:flex-row">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <ProductTile
                key={product.id}
                id={product.id}
                name={product.name || "Unknown Product"}
                quantity={product.quantity || 0}
                expires={
                  product.expiresAt
                    ? product.expiresAt.toISOString()
                    : "No Expiry Date"
                }
                destructive={true}
                section="reorder"
              />
            ))
          ) : (
            <p className="text-gray-500">No low stock items.</p>
          )}
        </div>
      </div>
    </div>
  );
}
