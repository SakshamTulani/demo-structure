import type { Product } from "@/data"

/** Products at or above this price (US dollars) are Premium. */
export const PREMIUM_FROM = 100

/** Business rule: whether a product shows the Premium badge. */
export const isPremium = (product: Product) => product.price >= PREMIUM_FROM
