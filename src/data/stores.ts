import type { HttpClient } from "@/shared/api"
import type { RealtimeConnection } from "@/shared/realtime"

import { CategoryStore } from "./categories"
import { DataEvents } from "./events"
import { ProductStore } from "./products"

export type DataDeps = {
  http: HttpClient
  /** Unused by this app's stores (no live data); kept so a streaming store can be added. */
  realtime: RealtimeConnection
}

/**
 * Builds every store once, around one event bus. src/app/App.tsx calls it with
 * the real http client; src/test/render.tsx with MSW and the fake socket.
 */
export function createStores(deps: DataDeps) {
  const events = new DataEvents()
  return {
    categories: new CategoryStore({ http: deps.http, events }),
    products: new ProductStore({ http: deps.http, events }),
  }
}

export type Stores = ReturnType<typeof createStores>

/** On sign-out: drop every cached query. */
export function clearStores(stores: Stores) {
  for (const store of Object.values(stores)) store.clearCache()
}
