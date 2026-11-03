import { useState } from "react"

import { Button } from "@/shared/ui/button"

import { useCatalogView } from "../hooks/useCatalogView"
import { useProductCards } from "../hooks/useProductCards"
import { ProductCard } from "./ProductCard"

type Props = { categoryId: number; search: string }

/**
 * The page number is view state: only this grid needs it. CatalogPage gives the
 * grid a key of category + search, so a new category or search starts at page 1.
 */
export function ProductGrid({ categoryId, search }: Props) {
  const [page, setPage] = useState(1)
  const [view] = useCatalogView()
  const products = useProductCards({ categoryId, search, page })

  if (products.isPending) return <p className="text-muted-foreground">Loading products…</p>
  if (products.error) {
    return (
      <p role="alert">
        Couldn't load products.{" "}
        <Button variant="link" onClick={() => products.refetch()}>
          Try again
        </Button>
      </p>
    )
  }
  if (products.cards.length === 0) {
    return (
      <p className="text-muted-foreground">
        {search ? `No products match "${search}".` : "This category has no products."}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul
        aria-label="Products"
        className={
          view === "grid"
            ? "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-2"
        }
      >
        {products.cards.map(({ product, premium }) => (
          <li key={product.id}>
            <ProductCard product={product} premium={premium} layout={view} />
          </li>
        ))}
      </ul>
      <nav aria-label="Pages" className="flex items-center gap-3">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button variant="outline" disabled={!products.hasNext} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </nav>
    </div>
  )
}
