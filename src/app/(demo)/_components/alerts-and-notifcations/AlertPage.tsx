import {
  getLowStockProducts,
  getNearExpiration
} from "../../_actions/getProducts";
import AlertsProducts from "./AlertsProducts";

export default async function AlertPage() {
  const [productsNearExpiration, lowStockProducts] = await Promise.all([
    getNearExpiration(),
    getLowStockProducts()
  ]);

  return (
    <AlertsProducts
      productsNearExpiration={productsNearExpiration.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined,
        barcode: product.barcode ?? undefined
      }))}
      lowStockProducts={lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined,
        barcode: product.barcode ?? undefined
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
