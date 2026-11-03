import type { AppModule } from "@/shared/lib/app-module"

import { CatalogPage } from "./ui/CatalogPage"
import { ProductDetailPage } from "./ui/ProductDetailPage"

export const catalogModule: AppModule = {
  featureId: "catalog",
  title: "Catalog",
  routes: [
    { index: true, element: <CatalogPage /> },
    { path: "products/:productId", element: <ProductDetailPage /> },
  ],
}
