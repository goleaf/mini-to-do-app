"use client"

import { useState } from "react"

export function useAsyncOperation<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  options?: {
    onSuccess?: (result: Awaited<ReturnType<T>>) => void
    onError?: (error: Error) => void
  },
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await operation(...args)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Operation failed")
      setError(error)
      options?.onError?.(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { execute, isLoading, error }
}

