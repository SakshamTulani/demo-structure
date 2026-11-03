import { Link } from "react-router-dom"

import type { Product } from "@/data"
import { formatMoney } from "@/shared/lib/format"

type Props = { product: Product; premium: boolean; layout: "grid" | "list" }

export function ProductCard({ product, premium, layout }: Props) {
  return (
    <article
      className={
        layout === "grid"
          ? "flex flex-col gap-2 rounded-md border p-3"
          : "flex items-center gap-4 rounded-md border p-2"
      }
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className={
            layout === "grid"
              ? "aspect-square w-full rounded object-cover"
              : "size-14 rounded object-cover"
          }
        />
      ) : (
        <div
          className={
            layout === "grid" ? "aspect-square w-full rounded bg-muted" : "size-14 rounded bg-muted"
          }
        />
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <Link to={`/catalog/products/${product.id}`} className="font-medium hover:underline">
          {product.title}
        </Link>
        <span className="text-muted-foreground text-sm">{product.categoryName}</span>
        <span className="flex items-center gap-2">
          {formatMoney(product.price)}
          {premium && (
            <span className="rounded bg-primary px-1.5 text-primary-foreground text-xs">
              Premium
            </span>
          )}
        </span>
      </div>
    </article>
  )
}
