import { describe, expect, it } from "@rstest/core"
import { waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"

import { httpClient } from "@/shared/api"
import { createFakeRealtimeConnection } from "@/shared/realtime/testing"
import { apiUrl, server } from "@/test/server"

import { createStores } from "../stores"
import { buildApiCategory } from "./testing"

const stores = () => createStores({ http: httpClient, realtime: createFakeRealtimeConnection() })

describe("CategoryStore", () => {
  it("catalog/REQ-6: renames a category and refreshes the category list", async () => {
    let name = "Clothes"
    server.use(
      http.get(apiUrl("/categories"), () => HttpResponse.json([buildApiCategory({ name })])),
      http.put(apiUrl("/categories/1"), async ({ request }) => {
        name = ((await request.json()) as { name: string }).name
        return HttpResponse.json(buildApiCategory({ name }))
      })
    )
    const { categories } = stores()
    const list = categories.getCategories()
    list.mount()
    await waitFor(() => expect(list.getSnapshot().data?.[0]?.name).toBe("Clothes"))

    await categories.renameCategory({ categoryId: 1, name: "  Apparel " })

    await waitFor(() => expect(list.getSnapshot().data?.[0]?.name).toBe("Apparel"))
  })

  it("catalog/REQ-6: rejects a one-letter name before calling the server", async () => {
    const { categories } = stores()

    await expect(categories.renameCategory({ categoryId: 1, name: "A" })).rejects.toThrow(
      "Use at least 2 characters."
    )
  })
})
