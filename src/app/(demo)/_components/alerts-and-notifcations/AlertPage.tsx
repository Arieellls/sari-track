import {
  getLowStockProducts,
  getNearExpiration,
  getReorderData,
} from "../../_actions/getProducts";
import AlertsProducts from "./AlertsProducts";

export default async function AlertPage() {
  const [productsNearExpiration, lowStockProducts, reorderData] =
    await Promise.all([
      getNearExpiration(),
      getLowStockProducts(),
      getReorderData(),
    ]);

  return (
    <AlertsProducts
      productsNearExpiration={productsNearExpiration.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined,
        barcode: product.barcode ?? undefined,
      }))}
      lowStockProducts={lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined,
        barcode: product.barcode ?? undefined,
      }))}
      reorderData={reorderData.map((product) => ({
        id: product.reorderId,
        name: product.productName ?? "Unknown",
        quantity: product.quantity ?? 0,
        barcode: product.barcode ?? undefined,
        status: product.status ?? "pending",
        remarks: product.remarks ?? undefined,
        lastReorder: product.lastReorder ?? undefined,
      }))}
      // inStockProducts={inStock.map((product) => ({
      //   id: product.id,
      //   name: product.name ?? "Unknown",
      //   quantity: product.quantity ?? 0,
      //   expiresAt: product.expiresAt ?? undefined,
      //   barcode: product.barcode ?? undefined
      // }))}
    />
  );
}
