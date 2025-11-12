// Auth types
export interface User {
  _id: string
  email: string
  name: string
  surname: string
  role: string
  enabled: boolean
  photo?: string
}

export interface AuthState {
  current: User | Record<string, never>
  isLoggedIn: boolean
  isLoading: boolean
  isSuccess: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  surname: string
}

// Redux types
export interface ReduxAction<T = any> {
  type: string
  payload?: T
}

export interface CrudState<T = any> {
  list: {
    result: T[]
    isLoading: boolean
    isSuccess: boolean
    pagination: {
      current: number
      pageSize: number
      total: number
    }
  }
  create: {
    isLoading: boolean
    isSuccess: boolean
  }
  update: {
    isLoading: boolean
    isSuccess: boolean
  }
  delete: {
    isLoading: boolean
    isSuccess: boolean
  }
  read: {
    result: T | null
    isLoading: boolean
    isSuccess: boolean
  }
  search: {
    result: T[]
    isLoading: boolean
    isSuccess: boolean
  }
}

// ERP types
export interface Invoice {
  _id: string
  number: number
  client: any
  date: string
  expiredDate: string
  total: number
  discount: number
  taxRate: number
  status: "draft" | "pending" | "sent" | "paid" | "overdue" | "cancelled"
  items: InvoiceItem[]
  notes?: string
}

export interface InvoiceItem {
  itemName: string
  description?: string
  quantity: number
  price: number
  total: number
}

export interface Customer {
  _id: string
  name: string
  surname: string
  company: string
  email: string
  phone: string
  address?: string
  enabled: boolean
}

export interface Payment {
  _id: string
  number: number
  client: any
  invoice: any
  date: string
  amount: number
  paymentMode: string
  ref?: string
  description?: string
}

// Settings types
export interface AppSettings {
  idurar_app_company_email?: string
  idurar_app_company_name?: string
  idurar_app_company_address?: string
  idurar_app_company_phone?: string
  idurar_app_company_vat?: string
  idurar_app_currency?: string
  idurar_app_language?: string
}

// API types
export interface ApiResponse<T = any> {
  success: boolean
  result?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  items?: number
  search?: string
}
