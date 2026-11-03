import { type FormEvent, useState } from "react"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

import { useCatalogSearch } from "../hooks/useCatalogSearch"

export function SearchBar() {
  const [search, setSearch] = useCatalogSearch() // module state: kept across screens
  const [draft, setDraft] = useState(search) // view state: what's typed but not searched yet

  function submit(event: FormEvent) {
    event.preventDefault()
    setSearch(draft.trim())
  }

  return (
    <form aria-label="Search products" onSubmit={submit} className="flex gap-2">
      <label htmlFor="catalog-search" className="sr-only">
        Search products
      </label>
      <Input
        id="catalog-search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search by title"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
