import { CategoryList, useCategoriesQuery, useSelectedCategory } from "@/modules/catalog"

import { CategoryPreview } from "./CategoryPreview"
import { NewProductForm } from "./NewProductForm"
import { RenameCategoryForm } from "./RenameCategoryForm"

/** Uses the same global selection as the catalog: pick a category on either screen. */
export function ManagePage() {
  const [categoryId] = useSelectedCategory()
  const categories = useCategoriesQuery()
  const current = categories.data?.find((c) => c.id === categoryId)

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <CategoryList />
      {categoryId && current ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-label="Category" className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">Rename {current.name}</h2>
            {/* key: a different category starts the form again with its own name. */}
            <RenameCategoryForm
              key={categoryId}
              categoryId={categoryId}
              currentName={current.name}
            />
            <h3 className="font-medium">Products in this category</h3>
            <CategoryPreview categoryId={categoryId} />
          </section>
          <section aria-label="Add a product" className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">Add a product to {current.name}</h2>
            <NewProductForm key={categoryId} categoryId={categoryId} />
          </section>
        </div>
      ) : (
        <p className="text-muted-foreground">Choose a category to manage it.</p>
      )}
    </div>
  )
}
