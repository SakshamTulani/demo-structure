import { useCategoryPreviewQuery } from "../hooks/useCategoryPreviewQuery"

/** A few of the category's products with the category name each one carries, so a rename shows here. */
export function CategoryPreview({ categoryId }: { categoryId: number }) {
  const preview = useCategoryPreviewQuery(categoryId)

  if (preview.isPending) return <p className="text-muted-foreground">Loading products…</p>
  const items = preview.data?.items.slice(0, 3) ?? []
  if (items.length === 0) return <p className="text-muted-foreground">No products yet.</p>

  return (
    <ul aria-label="Products in this category" className="flex flex-col gap-1">
      {items.map((p) => (
        <li key={p.id}>
          {p.title} <span className="text-muted-foreground">· {p.categoryName}</span>
        </li>
      ))}
    </ul>
  )
}
