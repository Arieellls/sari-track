"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  bestSellingProduct,
  getReorderHistory,
  slowMovingProduct,
} from "../../_actions/reorder";
import {
  getAllProducts,
  getLowStockProducts,
  getNearExpiration,
  getOutOfStockProducts,
} from "../../_actions/getProducts";
import { formatDate } from "@/lib/formatDate";

type ReorderDetails = {
  reorderId: number | string; // adjust depending on actual ID type
  productId: number | string;
  status: string;
  remarks: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastReorder: string | Date | null;
  productName: string;
  reorderCount: number;
};

export default function SalesPage() {
  interface Product {
    id: string;
    name: string | null;
    barcode: string | null;
    quantity: number | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    quantityNotif: boolean;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<
    ReorderDetails[]
  >([]);
  const [slowMovingProducts, setSlowMovingProducts] = useState<
    ReorderDetails[]
  >([]);

  interface ReorderHistoryItem {
    reorderId: string;
    productId: string | null;
    status: string | null;
    remarks: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    lastReorder: Date | null;
    productName: string | null;
  }

  const [reorderHistory, setReorderHistory] = useState<ReorderHistoryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [
          allProductsData,
          lowStockData,
          outOfStockData,
          expiringData,
          reorderData,
          bestSellingProductData,
          slowMovingProductData,
        ] = await Promise.all([
          getAllProducts(),
          getLowStockProducts(),
          getOutOfStockProducts(),
          getNearExpiration(),
          getReorderHistory(),
          bestSellingProduct(),
          slowMovingProduct(),
        ]);

        setProducts(allProductsData);
        setLowStockProducts(lowStockData);
        setOutOfStockProducts(outOfStockData);
        setExpiringProducts(expiringData);
        setReorderHistory(reorderData);
        setBestSellingProducts(
          bestSellingProductData.filter(
            (product) => product.productId !== null,
          ) as ReorderDetails[],
        );
        setSlowMovingProducts(
          slowMovingProductData.filter(
            (product) => product.productId !== null,
          ) as ReorderDetails[],
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the stock status pie chart
  const stockStatusData = [
    {
      name: "In Stock",
      value:
        products.length - lowStockProducts.length - outOfStockProducts.length,
    },
    {
      name: "Low Stock",
      value: lowStockProducts.length - outOfStockProducts.length,
    },
    { name: "Out of Stock", value: outOfStockProducts.length },
  ];

  // Top 5 products with lowest stock
  const topLowStockProducts = lowStockProducts
    .filter((product) => product.quantity !== null && product.quantity > 0)
    .sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0))
    .slice(0, 5);

  // Reorder status distribution
  const reorderStatusCounts: Record<string, number> = reorderHistory.reduce(
    (acc: Record<string, number>, item) => {
      if (item.status) {
        acc[item.status] = (acc[item.status] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const reorderStatusData = Object.keys(reorderStatusCounts).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: reorderStatusCounts[status],
  }));

  // Calculate expiry distribution (days until expiry)
  const expiryDistribution: Record<string, number> = expiringProducts.reduce(
    (acc: Record<string, number>, product) => {
      if (!product.expiresAt) return acc;

      const daysToExpiry = Math.ceil(
        (new Date(product.expiresAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysToExpiry <= 7) {
        acc["1 week"] = (acc["1 week"] || 0) + 1;
      } else if (daysToExpiry <= 14) {
        acc["2 weeks"] = (acc["2 weeks"] || 0) + 1;
      } else if (daysToExpiry <= 21) {
        acc["3 weeks"] = (acc["3 weeks"] || 0) + 1;
      } else {
        acc["4 weeks"] = (acc["4 weeks"] || 0) + 1;
      }

      return acc;
    },
    {},
  );

  const expiryData = Object.keys(expiryDistribution).map((key) => ({
    name: key,
    count: expiryDistribution[key],
  }));

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full items-center justify-center">
        <div className="text-lg font-medium">
          Loading sale analytics data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Sari-Track Analytics</h1>
        <p className="text-gray-500">
          Comprehensive overview of product inventory status
        </p>
      </div>

      {/* =================================================================== */}
      {/* Best Selling Table */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-medium">Best Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reorder Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Reordered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
              {bestSellingProducts.slice(0, 5).map((product) => (
                <tr key={product.reorderId}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.productName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.reorderCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.lastReorder
                      ? formatDate(String(product.lastReorder))
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slow Moving Table */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-medium">Slow Moving Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reorder Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Reordered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
              {slowMovingProducts.slice(0, 5).map((product) => (
                <tr key={product.reorderId}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.productName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.reorderCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.lastReorder
                      ? formatDate(String(product.lastReorder))
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Total Products
          </h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Low Stock Items
          </h3>
          <p className="text-3xl font-bold text-amber-500">
            {lowStockProducts.length}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Out of Stock
          </h3>
          <p className="text-3xl font-bold text-red-500">
            {outOfStockProducts.length}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Expiring Soon
          </h3>
          <p className="text-3xl font-bold text-orange-500">
            {expiringProducts.length}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Stock Status Pie Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-medium">
            Stock Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} products`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Low Stock Products */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-medium">
            Products with Lowest Stock
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topLowStockProducts}
                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} units`, "Quantity"]}
                />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Reorder Status Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-medium">Reorder Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reorderStatusData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} orders`, "Count"]} />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiry Distribution */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-medium">
            Expiring Products Timeline
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expiryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} products`, "Count"]}
                />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-medium">Low Stock Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Expires
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
              {lowStockProducts.slice(0, 5).map((product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.barcode}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        product.quantity === 0
                          ? "bg-red-100 text-red-800"
                          : (product.quantity ?? 0) <= 5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.quantity === 0
                        ? "Out of stock"
                        : (product.quantity ?? 0) <= 5
                          ? "Critical"
                          : "Low stock"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.expiresAt
                      ? new Date(product.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reorder History */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-medium">Recent Reorder Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Reordered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
              {reorderHistory.slice(0, 5).map((item) => (
                <tr key={item.reorderId}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.productName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status
                        ? item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        : "Unknown"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.remarks || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.lastReorder
                      ? new Date(item.lastReorder).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
