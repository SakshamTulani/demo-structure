import { Button } from "@/shared/ui/button"

import { useCatalogView } from "../hooks/useCatalogView"

export function ViewToggle() {
  const [view, setView] = useCatalogView()

  return (
    <fieldset className="flex gap-1">
      <legend className="sr-only">Layout</legend>
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        aria-pressed={view === "grid"}
        onClick={() => setView("grid")}
      >
        Grid
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        aria-pressed={view === "list"}
        onClick={() => setView("list")}
      >
        List
      </Button>
    </fieldset>
  )
}
