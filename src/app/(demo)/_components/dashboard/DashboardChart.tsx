"use client";

import { Layers, AlertTriangle, ShoppingCart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip
} from "recharts";

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
  getStock,
  getOutOfStockProducts,
  getNearExpiration,
  getLowStockProducts
} from "../../_actions/getProducts";
import { useEffect, useState } from "react";

// Define type for our product data
type ProductData = {
  id: string;
  name: string | null;
  quantity: number | null;
  expiresAt?: Date | null;
  // Other fields as needed
};

// Custom colors for the chart
const customColors = {
  productCount: "#4f46e5", // Indigo
  quantity: "#06b6d4", // Cyan
  inStock: "#10b981", // Emerald
  lowStock: "#f59e0b", // Amber
  outOfStock: "#ef4444", // Red
  expiringSoon: "#8b5cf6" // Purple
};

export function DashboardChart() {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch data from server actions
        const inStockProducts = await getStock();
        const outOfStockProducts = await getOutOfStockProducts();
        const expiringProducts = await getNearExpiration();
        const lowStockProducts = await getLowStockProducts();

        // Process data for chart
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

  const chartConfig = {
    count: {
      label: "Product Count",
      color: customColors.productCount
    },
    value: {
      label: "Item Quantity",
      color: customColors.quantity
    }
  } satisfies ChartConfig;

  // Custom bar colors based on category
  const getBarFill = (entry: any, dataKey: string) => {
    if (dataKey === "count") {
      return customColors.productCount;
    }
    return customColors.quantity;
  };

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
    <Card className="h-[400px] sm:w-[600px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out overflow-hidden">
      <CardHeader>
        <CardTitle>Inventory Status Overview</CardTitle>
        <CardDescription>
          Showing product counts and quantities across inventory categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={inventoryData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <Legend />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              name="Product Count"
              fill={customColors.productCount}
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="value"
              name="Item Quantity"
              fill={customColors.quantity}
              yAxisId="right"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-wrap items-center gap-4 text-sm">
          <div
            className="flex items-center gap-2 font-medium leading-none"
            style={{ color: customColors.inStock }}
          >
            <ShoppingCart className="h-4 w-4" /> In Stock
          </div>
          <div
            className="flex items-center gap-2 font-medium leading-none"
            style={{ color: customColors.lowStock }}
          >
            <Layers className="h-4 w-4" /> Low Stock
          </div>
          {/* <div
            className="flex items-center gap-2 font-medium leading-none"
            style={{ color: customColors.outOfStock }}
          >
            <AlertTriangle className="h-4 w-4" /> Out of Stock
          </div> */}
          <div
            className="flex items-center gap-2 font-medium leading-none"
            style={{ color: customColors.expiringSoon }}
          >
            <AlertTriangle className="h-4 w-4" /> Expiring Soon
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
