import type { AppModule } from "@/shared/lib/app-module"

import { ManagePage } from "./ui/ManagePage"

export const manageModule: AppModule = {
  featureId: "manage",
  title: "Manage",
  routes: [{ index: true, element: <ManagePage /> }],
}
