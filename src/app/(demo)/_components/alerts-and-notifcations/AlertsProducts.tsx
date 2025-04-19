"use client";

import { useState, useMemo } from "react";
import ProductTile from "../inventory/ProductTile";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import AutomatedSuggestions from "./AutomatedSuggestions";

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
  reorderData: any[];
}

export default function AlertsProducts({
  productsNearExpiration = [],
  lowStockProducts = [],
}: ProductsProps) {
  const [sortAscending, setSortAscending] = useState(true);

  // States for expanded/collapsed sections
  const [sectionStates, setSectionStates] = useState({
    lowStock: { expanded: true, showAll: false },
    expiry: { expanded: true, showAll: false },
    reorder: { expanded: true, showAll: false },
  });

  // Number of products to show initially
  const INITIAL_DISPLAY_COUNT = 2;

  const sortedProductsNearExpiration = useMemo(() => {
    return [...productsNearExpiration].sort((a, b) => {
      const aDate = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
      const bDate = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
      return sortAscending ? aDate - bDate : bDate - aDate;
    });
  }, [productsNearExpiration, sortAscending]);

  const toggleSort = () => {
    setSortAscending((prev) => !prev);
  };

  const toggleSection = (section: "lowStock" | "expiry" | "reorder") => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: { ...prev[section], expanded: !prev[section].expanded },
    }));
  };

  const toggleShowAll = (section: "lowStock" | "expiry" | "reorder") => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: { ...prev[section], showAll: !prev[section].showAll },
    }));
  };

  // Calculate display products based on state
  const displayLowStockProducts = sectionStates.lowStock.showAll
    ? lowStockProducts
    : lowStockProducts.slice(0, INITIAL_DISPLAY_COUNT);

  const displayExpiryProducts = sectionStates.expiry.showAll
    ? sortedProductsNearExpiration
    : sortedProductsNearExpiration.slice(0, INITIAL_DISPLAY_COUNT);

  const displayReorderProducts = sectionStates.reorder.showAll
    ? lowStockProducts
    : lowStockProducts.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full flex-col gap-8">
      {/* Reorder Suggestions Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            Automated Reordering Suggestions
            <button
              onClick={() => toggleSection("reorder")}
              className="text-gray-500 hover:text-gray-700"
            >
              {sectionStates.reorder.expanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </h1>
        </div>

        {sectionStates.lowStock.expanded && (
          <>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
              {lowStockProducts.length > 0 ? (
                displayReorderProducts.map((product) => (
                  <AutomatedSuggestions
                    key={product.id}
                    product={product}
                    status="pending"
                  />
                ))
              ) : (
                <p className="text-gray-500">No low stock items.</p>
              )}

              {!sectionStates.reorder.showAll &&
                lowStockProducts.length > INITIAL_DISPLAY_COUNT && (
                  <div
                    onClick={() => toggleShowAll("reorder")}
                    className="flex w-full cursor-pointer overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-md dark:hover:shadow-lg"
                  >
                    <div className="flex flex-1 items-center justify-center p-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        See {lowStockProducts.length - INITIAL_DISPLAY_COUNT}{" "}
                        more items
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {sectionStates.reorder.showAll &&
              lowStockProducts.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => toggleShowAll("reorder")}
                  className="self-start pl-3 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-900"
                >
                  Show less
                </button>
              )}
          </>
        )}
      </div>

      {/* Low Stock Items Section */}
      <div className="flex flex-col gap-4 transition-all duration-200 ease-in-out">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            Low Stock Items
            <button
              onClick={() => toggleSection("lowStock")}
              className="text-gray-500 hover:text-gray-700"
            >
              {sectionStates.lowStock.expanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </h1>
          {/* {lowStockProducts.length > INITIAL_DISPLAY_COUNT && (
            <Link
              href="/inventory"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              View All <ExternalLink size={16} />
            </Link>
          )} */}
        </div>

        {sectionStates.lowStock.expanded && (
          <>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
              {lowStockProducts.length > 0 ? (
                displayLowStockProducts.map((product) => (
                  <ProductTile
                    key={product.id}
                    id={product.id}
                    barcode={product.barcode || ""}
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

              {!sectionStates.lowStock.showAll &&
                lowStockProducts.length > INITIAL_DISPLAY_COUNT && (
                  <div
                    onClick={() => toggleShowAll("lowStock")}
                    className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border bg-slate-300 p-4 hover:bg-gray-400 hover:text-gray-50 dark:bg-gray-400 dark:hover:bg-gray-300 sm:w-64"
                  >
                    <p className="font-medium">
                      See {lowStockProducts.length - INITIAL_DISPLAY_COUNT} more
                      items
                    </p>
                  </div>
                )}
            </div>

            {sectionStates.lowStock.showAll &&
              lowStockProducts.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => toggleShowAll("lowStock")}
                  className="self-start pl-3 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-900"
                >
                  Show less
                </button>
              )}
          </>
        )}
      </div>

      {/* Items Approaching Expiry Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            Items Approaching Expiry
            <ArrowUpDown
              className="cursor-pointer hover:text-gray-500"
              onClick={toggleSort}
            />
            <button
              onClick={() => toggleSection("expiry")}
              className="text-gray-500 hover:text-gray-700"
            >
              {sectionStates.expiry.expanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </h1>
          {/* {sortedProductsNearExpiration.length > INITIAL_DISPLAY_COUNT && (
            <Link
              href="/inventory?filter=expiring"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              View All <ExternalLink size={16} />
            </Link>
          )} */}
        </div>

        {sectionStates.expiry.expanded && (
          <>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
              {sortedProductsNearExpiration.length > 0 ? (
                displayExpiryProducts.map((product) => (
                  <ProductTile
                    key={product.id}
                    id={product.id}
                    barcode={product.barcode || ""}
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
                <p className="text-gray-500">No items approaching expiry.</p>
              )}

              {!sectionStates.expiry.showAll &&
                sortedProductsNearExpiration.length > INITIAL_DISPLAY_COUNT && (
                  <div
                    onClick={() => toggleShowAll("expiry")}
                    className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border bg-slate-300 p-4 hover:bg-gray-400 hover:text-gray-50 dark:bg-gray-400 dark:hover:bg-gray-300 sm:w-64"
                  >
                    <p className="font-medium">
                      See{" "}
                      {sortedProductsNearExpiration.length -
                        INITIAL_DISPLAY_COUNT}{" "}
                      more items
                    </p>
                  </div>
                )}
            </div>

            {sectionStates.expiry.showAll &&
              sortedProductsNearExpiration.length > INITIAL_DISPLAY_COUNT && (
                <button
                  onClick={() => toggleShowAll("expiry")}
                  className="self-start pl-3 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-900"
                >
                  Show less
                </button>
              )}
          </>
        )}
      </div>
    </div>
  );
}
