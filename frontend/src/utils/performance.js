"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * Deep comparison for useEffect dependencies
 */
export const useDeepCompareEffect = (callback, dependencies) => {
  const currentDependenciesRef = useRef()

  if (!areEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  useEffect(callback, [currentDependenciesRef.current])
}

/**
 * Debounced callback hook
 */
export const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null)

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )
}

/**
 * Throttled callback hook
 */
export const useThrottledCallback = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback(
    (...args) => {
      const timeElapsed = Date.now() - lastRun.current

      if (timeElapsed >= delay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    },
    [callback, delay],
  )
}

/**
 * Simple deep equality check
 */
const areEqual = (a, b) => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}

/**
 * Preload a route component
 */
export const preloadRoute = (importFunc) => {
  return importFunc()
}
