import { Button } from "@/shared/ui/button"

import { useCategoriesQuery } from "../hooks/useCategoriesQuery"
import { useSelectedCategory } from "../hooks/useSelectedCategory"

/** Sets the global selection, so every screen follows it. */
export function CategoryList() {
  const categories = useCategoriesQuery()
  const [selectedId, select] = useSelectedCategory()

  if (categories.isPending) return <p className="text-muted-foreground">Loading categories…</p>
  if (categories.error) {
    return (
      <p role="alert">
        Couldn't load categories.{" "}
        <Button variant="link" onClick={() => categories.refetch()}>
          Try again
        </Button>
      </p>
    )
  }

  return (
    <nav aria-label="Categories">
      <ul className="flex flex-col gap-1">
        {categories.data?.map((category) => (
          <li key={category.id}>
            <Button
              variant={category.id === selectedId ? "secondary" : "ghost"}
              aria-pressed={category.id === selectedId}
              className="w-full justify-start"
              title={category.name}
              onClick={() => select(category.id)}
            >
              <span className="min-w-0 truncate">{category.name}</span>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
