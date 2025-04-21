import {
  getLowStockProducts,
  getNearExpiration,
  getReorderData,
} from "../../_actions/getProducts";
import { getReorderHistory } from "../../_actions/reorder";
import AlertsProducts from "./AlertsProducts";

export default async function AlertPage() {
  const [
    productsNearExpiration,
    lowStockProducts,
    reorderData,
    reorderDataHistory,
  ] = await Promise.all([
    getNearExpiration(),
    getLowStockProducts(),
    getReorderData(),
    getReorderHistory(),
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
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined,
        barcode: product.barcode ?? undefined,
      }))}
      reorderDataHistory={reorderDataHistory.map((product) => ({
        reorderId: product.reorderId,
        productName: product.productName,
        status: product.status,
        remarks: product.remarks,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        lastReorder: product.lastReorder,
        productId: product.productId,
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
