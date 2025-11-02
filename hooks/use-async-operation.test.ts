import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useAsyncOperation } from "@/hooks/use-async-operation"

describe("useAsyncOperation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("initializes with loading false and no error", () => {
    const mockOperation = vi.fn().mockResolvedValue("result")
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("sets loading to true during operation", async () => {
    let resolveOperation: (value: string) => void
    const mockOperation = vi.fn().mockImplementation(() => {
      return new Promise<string>((resolve) => {
        resolveOperation = resolve
      })
    })
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    const executePromise = result.current.execute()
    
    // Wait for loading state to be set
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    }, { timeout: 1000 })

    // Resolve the operation
    resolveOperation!("result")
    await executePromise

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("executes operation and returns result", async () => {
    const mockOperation = vi.fn().mockResolvedValue("success")
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    const executeResult = await result.current.execute("arg1", "arg2")

    expect(mockOperation).toHaveBeenCalledWith("arg1", "arg2")
    expect(executeResult).toBe("success")
  })

  it("calls onSuccess callback when operation succeeds", async () => {
    const mockOperation = vi.fn().mockResolvedValue("success")
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useAsyncOperation(mockOperation, { onSuccess }))

    await result.current.execute()

    expect(onSuccess).toHaveBeenCalledWith("success")
  })

  it("handles errors and sets error state", async () => {
    const error = new Error("Operation failed")
    const mockOperation = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    const executeResult = await result.current.execute()

    await waitFor(() => {
      expect(result.current.error).toEqual(error)
    })
    expect(executeResult).toBe(null)
  })

  it("calls onError callback when operation fails", async () => {
    const error = new Error("Operation failed")
    const mockOperation = vi.fn().mockRejectedValue(error)
    const onError = vi.fn()
    const { result } = renderHook(() => useAsyncOperation(mockOperation, { onError }))

    await result.current.execute()

    expect(onError).toHaveBeenCalledWith(error)
  })

  it("handles non-Error rejections", async () => {
    const mockOperation = vi.fn().mockRejectedValue("string error")
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    await result.current.execute()

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe("Operation failed")
    })
  })

  it("resets error state on new execution", async () => {
    const error = new Error("First error")
    const mockOperation = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce("success")
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    await result.current.execute()
    
    await waitFor(() => {
      expect(result.current.error).toEqual(error)
    })

    await result.current.execute()
    
    await waitFor(() => {
      expect(result.current.error).toBe(null)
    })
  })

  it("sets loading to false after operation completes", async () => {
    const mockOperation = vi.fn().mockResolvedValue("result")
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    await result.current.execute()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("sets loading to false after operation fails", async () => {
    const mockOperation = vi.fn().mockRejectedValue(new Error("Failed"))
    const { result } = renderHook(() => useAsyncOperation(mockOperation))

    await result.current.execute()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeInstanceOf(Error)
    })
  })
})

