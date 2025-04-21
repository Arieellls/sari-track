"use client";

import { useState } from "react";
import ProductTile from "./ProductTile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProduct } from "../../_actions/getProducts";
import { AddDialog } from "../AddDialog";
import { ProductDialog } from "./ProductDialog";
import { UpdateDialog } from "./UpdateDialog";

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
  initialProducts: Product[];
  productsNearExpiration: Product[];
  outOfStockProducts: Product[];
  inStockProducts: Product[];
}

export default function Products({
  initialProducts = [],
  productsNearExpiration = [],
  outOfStockProducts = [],
  inStockProducts = [],
}: ProductsProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [noSearchResults, setNoSearchResults] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDisplayedProducts = () => {
    if (searchResult && searchResult.length > 0) {
      return searchResult;
    }

    switch (selectedFilter) {
      case "in-stock":
        return inStockProducts;
      case "low-stock":
        return initialProducts.filter(
          (product) =>
            (product.quantity ?? 0) <= 5 && (product.quantity ?? 0) > 0,
        );
      case "out-of-stock":
        return outOfStockProducts;
      default:
        return initialProducts;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      setSearchPerformed(false);
      setNoSearchResults(false);
      return;
    }

    setIsSearching(true);
    setSearchPerformed(true);
    setNoSearchResults(false);

    try {
      const results = await searchProduct(searchQuery);
      if (results && results.length > 0) {
        setSearchResult(results);
        setNoSearchResults(false);
      } else {
        setSearchResult(null);
        setNoSearchResults(true);
      }
    } catch (error) {
      console.error("Error searching for product:", error);
      setNoSearchResults(true);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResult(null);
    setSearchPerformed(false);
    setNoSearchResults(false);
  };

  const displayedProducts = getDisplayedProducts();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-[100%] flex-col gap-8">
      <div className="flex w-full flex-col justify-between gap-3 sm:flex-row">
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row">
          {!searchResult && (
            <Filter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}
          <div className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Search for a product..."
              className="w-full sm:w-[350px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              variant="default"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {(searchResult || noSearchResults) && (
              <Button onClick={handleClearSearch} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </div>
        <AddDialog />
        <UpdateDialog />
      </div>

      <div className="flex flex-col gap-2">
        <h1
          className={`text-left text-2xl font-bold ${
            !searchResult && noSearchResults ? "text-center" : "sm:text-left"
          }`}
        >
          {searchResult
            ? "Search Result"
            : searchPerformed && noSearchResults
              ? "Search Results"
              : selectedFilter === "all"
                ? "Inventory List"
                : selectedFilter === "in-stock"
                  ? "In Stock Products"
                  : selectedFilter === "low-stock"
                    ? "Low Stock Products"
                    : "Out of Stock Products"}
        </h1>
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
          {noSearchResults ? (
            <div className="flex w-full flex-col items-center py-8">
              <p className="mb-2 text-gray-500">
                No products found matching &quot;{searchQuery}&quot;.
              </p>
              <p className="text-sm text-gray-400">
                Try searching with a different product name or barcode
              </p>
            </div>
          ) : displayedProducts && displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductTile
                key={product.id}
                id={product.id}
                barcode={product.barcode || "No Barcode"}
                name={product.name || "Unknown Product"}
                quantity={product.quantity || 0}
                expires={
                  product.expiresAt
                    ? product.expiresAt.toISOString()
                    : "No Expiry Date"
                }
                destructive={
                  selectedFilter === "out-of-stock" ||
                  selectedFilter === "low-stock"
                }
                onClick={() => handleProductClick(product)}
              />
            ))
          ) : (
            <p className="text-gray-500">
              {searchPerformed
                ? "No product found matching your search."
                : "No products match the selected filter."}
            </p>
          )}
          <ProductDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            product={selectedProduct || undefined}
          />
        </div>
      </div>

      {/* {!searchResult && !noSearchResults && selectedFilter === "all" && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Products Nearing Expiration</h1>
          <div className="w-full flex flex-col gap-4 sm:flex-wrap sm:flex-row">
            {productsNearExpiration && productsNearExpiration.length > 0 ? (
              productsNearExpiration.map((product) => (
                <ProductTile
                  key={product.id}
                  name={product.name || "Unknown Product"}
                  quantity={product.quantity || 0}
                  expires={
                    product.expiresAt
                      ? product.expiresAt.toISOString()
                      : "No Expiry Date"
                  }
                  destructive={true}
                />
              ))
            ) : (
              <p className="text-gray-500">
                No products are nearing expiration.
              </p>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}

function Filter({
  selectedFilter,
  setSelectedFilter,
}: {
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}) {
  return (
    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
      <SelectTrigger className="w-full sm:w-[250px]">
        <SelectValue placeholder="All Statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="all">All Products</SelectItem>
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="low-stock">Low Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
