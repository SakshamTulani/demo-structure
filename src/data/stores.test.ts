import { describe, expect, it } from "@rstest/core"
import { waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"

import { httpClient } from "@/shared/api"
import { createFakeRealtimeConnection } from "@/shared/realtime/testing"
import { apiUrl, server } from "@/test/server"

import { buildApiCategory } from "./categories/testing"
import { buildApiProduct } from "./products/testing"
import { createStores } from "./stores"

describe("stores talking through events", () => {
  it("catalog/REQ-6: a rename in CategoryStore refreshes ProductStore's products through category/renamed", async () => {
    let name = "Clothes"
    server.use(
      http.get(apiUrl("/products"), () =>
        HttpResponse.json([buildApiProduct({ category: { id: 1, name } })])
      ),
      http.get(apiUrl("/products/1"), () =>
        HttpResponse.json(buildApiProduct({ category: { id: 1, name } }))
      ),
      http.put(apiUrl("/categories/1"), async ({ request }) => {
        name = ((await request.json()) as { name: string }).name
        return HttpResponse.json(buildApiCategory({ name }))
      })
    )
    const stores = createStores({ http: httpClient, realtime: createFakeRealtimeConnection() })
    const list = stores.products.getProducts({ categoryId: 1, search: "", page: 1 })
    const detail = stores.products.getProduct(1)
    list.mount()
    detail.mount()
    await waitFor(() => expect(list.getSnapshot().data?.items[0]?.categoryName).toBe("Clothes"))
    await waitFor(() => expect(detail.getSnapshot().data?.categoryName).toBe("Clothes"))

    await stores.categories.renameCategory({ categoryId: 1, name: "Apparel" })

    await waitFor(() => expect(list.getSnapshot().data?.items[0]?.categoryName).toBe("Apparel"))
    await waitFor(() => expect(detail.getSnapshot().data?.categoryName).toBe("Apparel"))
  })

  it("leaves another category's products alone", async () => {
    let loads = 0
    server.use(
      http.get(apiUrl("/products"), () => {
        loads++
        return HttpResponse.json([buildApiProduct({ category: { id: 2, name: "Shoes" } })])
      }),
      http.put(apiUrl("/categories/1"), () => HttpResponse.json(buildApiCategory()))
    )
    const stores = createStores({ http: httpClient, realtime: createFakeRealtimeConnection() })
    stores.products.getProducts({ categoryId: 2, search: "", page: 1 }).mount()
    await waitFor(() => expect(loads).toBe(1))

    await stores.categories.renameCategory({ categoryId: 1, name: "Apparel" })

    expect(loads).toBe(1)
  })
})
