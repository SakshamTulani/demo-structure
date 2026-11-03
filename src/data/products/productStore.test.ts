import { describe, expect, it } from "@rstest/core"
import { waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"

import { httpClient } from "@/shared/api"
import { createFakeRealtimeConnection } from "@/shared/realtime/testing"
import { apiUrl, server } from "@/test/server"

import { createStores } from "../stores"
import { PAGE_SIZE } from "./productStore"
import { buildApiProduct, buildApiProducts } from "./testing"

const stores = () => createStores({ http: httpClient, realtime: createFakeRealtimeConnection() })

describe("ProductStore", () => {
  it("catalog/REQ-3: asks for one page plus one row, and says whether a next page exists", async () => {
    let asked = ""
    server.use(
      http.get(apiUrl("/products"), ({ request }) => {
        asked = new URL(request.url).search
        return HttpResponse.json(buildApiProducts(PAGE_SIZE + 1))
      })
    )
    const { products } = stores()

    const page = await products.getProducts({ categoryId: 2, search: "mug", page: 3 }).fetch()

    expect(new URLSearchParams(asked).get("offset")).toBe(String(2 * PAGE_SIZE))
    expect(new URLSearchParams(asked).get("limit")).toBe(String(PAGE_SIZE + 1))
    expect(new URLSearchParams(asked).get("title")).toBe("mug")
    expect(page.items).toHaveLength(PAGE_SIZE)
    expect(page.hasNext).toBe(true)
  })

  it("catalog/REQ-7: refreshes the category's watched list after creating a product", async () => {
    let created = false
    server.use(
      http.get(apiUrl("/products"), () =>
        HttpResponse.json(created ? [buildApiProduct({ id: 99, title: "Mug" })] : [])
      ),
      http.post(apiUrl("/products"), () => {
        created = true
        return HttpResponse.json(buildApiProduct({ id: 99, title: "Mug" }))
      })
    )
    const { products } = stores()
    const list = products.getProducts({ categoryId: 1, search: "", page: 1 })
    list.mount()
    await waitFor(() => expect(list.getSnapshot().data?.items).toEqual([]))

    await products.createProduct({
      title: "Mug",
      price: 12,
      description: "A ceramic mug for coffee.",
      categoryId: 1,
      imageUrl: "https://placehold.co/600x400",
    })

    await waitFor(() => expect(list.getSnapshot().data?.items[0]?.title).toBe("Mug"))
  })

  it("catalog/REQ-7: rejects an http image URL before calling the server", async () => {
    const { products } = stores()

    await expect(
      products.createProduct({
        title: "Mug",
        price: 12,
        description: "A ceramic mug for coffee.",
        categoryId: 1,
        imageUrl: "http://placehold.co/600x400",
      })
    ).rejects.toThrow("Use an https:// image URL.")
  })
})
