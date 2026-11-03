import { useMemo } from "react"

import type { ProductQuery } from "@/data"

import { isPremium } from "../model"
import { useProductsQuery } from "./useProductsQuery"

/** Business hook: a page of products, each marked Premium or not by the rule in model.ts. */
export function useProductCards(q: ProductQuery) {
  const { data, isPending, error, refetch } = useProductsQuery(q)
  const cards = useMemo(
    () => (data?.items ?? []).map((product) => ({ product, premium: isPremium(product) })),
    [data]
  )
  return { cards, hasNext: data?.hasNext ?? false, isPending, error, refetch }
}
