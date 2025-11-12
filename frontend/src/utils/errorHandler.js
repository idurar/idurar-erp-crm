import { notification } from "antd"

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, customMessage) => {
  console.error("API Error:", error)

  let errorMessage = customMessage || "An error occurred"
  let description = "Please try again later"

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response

    switch (status) {
      case 400:
        errorMessage = "Bad Request"
        description = data.message || "Invalid request parameters"
        break
      case 401:
        errorMessage = "Unauthorized"
        description = "Please login again"
        // Optionally trigger logout
        break
      case 403:
        errorMessage = "Forbidden"
        description = "You don't have permission to perform this action"
        break
      case 404:
        errorMessage = "Not Found"
        description = "The requested resource was not found"
        break
      case 500:
        errorMessage = "Server Error"
        description = "Something went wrong on the server"
        break
      default:
        errorMessage = `Error ${status}`
        description = data.message || "An unexpected error occurred"
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = "Network Error"
    description = "Unable to reach the server. Please check your connection."
  } else {
    // Error in request setup
    errorMessage = "Request Error"
    description = error.message || "Failed to make request"
  }

  notification.error({
    message: errorMessage,
    description,
    duration: 5,
  })

  return {
    message: errorMessage,
    description,
    error,
  }
}

/**
 * Success notification helper
 */
export const showSuccess = (message, description) => {
  notification.success({
    message,
    description,
    duration: 3,
  })
}

/**
 * Warning notification helper
 */
export const showWarning = (message, description) => {
  notification.warning({
    message,
    description,
    duration: 4,
  })
}

/**
 * Info notification helper
 */
export const showInfo = (message, description) => {
  notification.info({
    message,
    description,
    duration: 3,
  })
}

/**
 * Validate form data helper
 */
export const validateForm = (values, rules) => {
  const errors = {}

  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = values[field]

    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = `${rule.label || field} is required`
    }

    if (rule.email && value && !isValidEmail(value)) {
      errors[field] = "Please enter a valid email address"
    }

    if (rule.min && value && value.toString().length < rule.min) {
      errors[field] = `${rule.label || field} must be at least ${rule.min} characters`
    }

    if (rule.max && value && value.toString().length > rule.max) {
      errors[field] = `${rule.label || field} must be at most ${rule.max} characters`
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} format is invalid`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Email validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Retry helper for failed requests
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return retry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}
