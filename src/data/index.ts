// The data layer's public API. Everything outside src/data/ imports from "@/data".
export * from "./categories"
export * from "./core"
export type { DataEvent } from "./events"
export * from "./products"
export { clearStores, createStores, type DataDeps, type Stores } from "./stores"
