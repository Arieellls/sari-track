"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { getStock, getOutOfStockProducts } from "../../_actions/getProducts";

export function ProductQuantityChart() {
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const inStock = await getStock();
        const outOfStock = await getOutOfStockProducts();
        setInStockCount(inStock.length);
        setOutOfStockCount(outOfStock.length);
      } catch (err) {
        console.error("Error fetching product counts", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const total = inStockCount + outOfStockCount;

  // Colors based on your theme tokens
  const COLORS = ["#51a8ff", "#28272a"];

  const data = [
    { name: "In Stock", value: inStockCount },
    { name: "Out of Stock", value: outOfStockCount }
  ];

  const inStockPercentage =
    total > 0 ? Math.round((inStockCount / total) * 100) : 0;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] sm:w-[600px] rounded-lg shadow-sm">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading inventory data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[400px] sm:w-[600px] rounded-lg shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Total Products: {total}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-4xl font-bold">{inStockCount}</p>
            <p className="text-sm text-muted-foreground">
              In Stock <br />
              Products
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm pt-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <span className="text-muted-foreground">In Stock Products</span>
          </div>
          <span className="font-semibold">
            {inStockCount} ({inStockPercentage}%)
          </span>
        </div>
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--muted))]"></div>
            <span className="text-muted-foreground">Out of Stock</span>
          </div>
          <span className="font-semibold">
            {outOfStockCount} ({100 - inStockPercentage}%)
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
