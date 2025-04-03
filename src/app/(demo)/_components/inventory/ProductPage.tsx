import Products from "./Products";
import {
  getAllProducts,
  getNearExpiration,
  getOutOfStockProducts,
  getStock
} from "./../../_actions/getProducts";

export default async function ProductPage() {
  // Fetch all data in parallel
  const [allProducts, nearExpirationProducts, outOfStockProducts, inStock] =
    await Promise.all([
      getAllProducts(),
      getNearExpiration(),
      getOutOfStockProducts(),
      getStock()
    ]);

  return (
    <Products
      initialProducts={inStock.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined
      }))}
      productsNearExpiration={nearExpirationProducts.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined
      }))}
      outOfStockProducts={outOfStockProducts.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined
      }))}
      inStockProducts={inStock.map((product) => ({
        id: product.id,
        name: product.name ?? "Unknown",
        quantity: product.quantity ?? 0,
        expiresAt: product.expiresAt ?? undefined
      }))}
    />
  );
}
