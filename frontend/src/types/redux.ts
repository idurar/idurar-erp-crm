import type { CrudState, AuthState, AppSettings } from "./index"

export interface RootState {
  auth: AuthState
  crud: CrudState
  erp: CrudState
  adavancedCrud: CrudState
  settings: {
    result: AppSettings
    isLoading: boolean
    isSuccess: boolean
  }
}

export type AppDispatch = any // Will be properly typed when fully migrated
