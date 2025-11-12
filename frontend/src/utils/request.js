import axios from "axios"
import { handleApiError } from "./errorHandler"
import storePersist from "@/redux/storePersist"

const request = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
request.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const auth = storePersist.get("auth")
    if (auth && auth.current && auth.current.token) {
      config.headers.Authorization = `Bearer ${auth.current.token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("[v0] API Request:", config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error) => {
    console.error("[v0] Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor
request.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("[v0] API Response:", response.config.url, response.status)
    }

    return response
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      storePersist.remove("auth")
      window.location.href = "/login"
    }

    handleApiError(error)
    return Promise.reject(error)
  },
)

export default request
