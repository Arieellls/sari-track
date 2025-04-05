"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart as RechartsPieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

import {
  getLowStockProducts,
  getNearExpiration,
  getOutOfStockProducts,
  getStock
} from "../../_actions/getProducts";

// Define types
interface ProductData {
  quantity: number | null;
}

interface InventoryChartData {
  category: string;
  count: number;
  value: number;
  color: string;
}

// Custom colors for each inventory category (distinct colors for each)
const customColors = {
  inStock: "#4caf50", // Green
  lowStock: "#ff9800", // Orange
  expiringSoon: "#f44336" // Red
};

export function PieChart() {
  const [inventoryData, setInventoryData] = React.useState<
    InventoryChartData[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const inStockProducts = await getStock();
        const outOfStockProducts = await getOutOfStockProducts();
        const expiringProducts = await getNearExpiration();
        const lowStockProducts = await getLowStockProducts();

        const processedData = [
          {
            category: "In Stock",
            count: inStockProducts.length,
            value: inStockProducts.reduce(
              (sum: number, product: ProductData) =>
                sum + (product.quantity !== null ? product.quantity : 0),
              0
            ),
            color: customColors.inStock
          },
          {
            category: "Low Stock",
            count: lowStockProducts.length,
            value: lowStockProducts.reduce(
              (sum: number, product: ProductData) =>
                sum + (product.quantity !== null ? product.quantity : 0),
              0
            ),
            color: customColors.lowStock
          },
          {
            category: "Expiring Soon",
            count: expiringProducts.length,
            value: expiringProducts.reduce(
              (sum: number, product: ProductData) =>
                sum + (product.quantity !== null ? product.quantity : 0),
              0
            ),
            color: customColors.expiringSoon
          }
        ];

        setInventoryData(processedData);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalQuantity = React.useMemo(() => {
    return inventoryData.reduce((acc, curr) => acc + curr.value, 0);
  }, [inventoryData]);

  const chartConfig: ChartConfig = inventoryData.reduce((acc, item) => {
    acc[item.category] = { label: item.category, color: item.color };
    return acc;
  }, {} as ChartConfig);

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
    <Card className="h-[400px] sm:w-[600px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out overflow-hidden">
      <CardHeader className={`items-center pb-0 ${isLoading && "hidden"}`}>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Stock Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <p className="text-center mt-16">Loading chart...</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={inventoryData}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                // Fill each section with the custom color based on its category
                fill="transparent" // Remove default fill
              >
                {inventoryData.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalQuantity}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Items
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </RechartsPieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className={`flex-col gap-2 text-sm ${isLoading && "hidden"}`}>
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Stock: {totalQuantity} items
        </div>
        <div className="leading-none text-muted-foreground">
          Summary of inventory status: In Stock, Low Stock, and Expiring Soon
        </div>
      </CardFooter>
    </Card>
  );
}
