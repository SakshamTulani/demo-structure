import { useCatalogSearch } from "../hooks/useCatalogSearch"
import { useSelectedCategory } from "../hooks/useSelectedCategory"
import { CategoryList } from "./CategoryList"
import { ProductGrid } from "./ProductGrid"
import { SearchBar } from "./SearchBar"
import { ViewToggle } from "./ViewToggle"

/** Reads the global selection and the module's search once, and passes them down. */
export function CatalogPage() {
  const [categoryId] = useSelectedCategory()
  const [search] = useCatalogSearch()

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <CategoryList />
      <section aria-label="Catalog" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchBar />
          <ViewToggle />
        </div>
        {categoryId ? (
          <ProductGrid key={`${categoryId}:${search}`} categoryId={categoryId} search={search} />
        ) : (
          <p className="text-muted-foreground">Choose a category to see its products.</p>
        )}
      </section>
    </div>
  )
}
