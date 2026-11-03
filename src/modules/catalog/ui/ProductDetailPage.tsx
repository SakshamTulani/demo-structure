import { Link, useParams } from "react-router-dom"

import { formatDate, formatMoney } from "@/shared/lib/format"
import { Button } from "@/shared/ui/button"

import { useProductQuery } from "../hooks/useProductQuery"
import { isPremium } from "../model"

export function ProductDetailPage() {
  const productId = Number(useParams().productId)
  const product = useProductQuery(productId)

  if (product.isPending) return <p className="text-muted-foreground">Loading product…</p>
  if (product.error || !product.data) {
    return (
      <p role="alert">
        Couldn't load this product.{" "}
        <Button variant="link" onClick={() => product.refetch()}>
          Try again
        </Button>
      </p>
    )
  }

  const p = product.data
  return (
    <article className="flex max-w-3xl flex-col gap-4">
      <Link to="/catalog" className="text-muted-foreground text-sm hover:underline">
        ← Back to the catalog
      </Link>
      {p.imageUrl && (
        <img src={p.imageUrl} alt="" className="max-h-80 w-full rounded-md object-cover" />
      )}
      <h1 className="font-semibold text-2xl">{p.title}</h1>
      <p className="flex items-center gap-2">
        {formatMoney(p.price)}
        {isPremium(p) && (
          <span className="rounded bg-primary px-1.5 text-primary-foreground text-xs">Premium</span>
        )}
      </p>
      <p className="text-muted-foreground">
        {p.categoryName} · added {formatDate(p.createdAt)}
      </p>
      <p>{p.description}</p>
    </article>
  )
}
