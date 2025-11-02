import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useExpandedSections } from "@/hooks/use-expanded-sections"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// Setup localStorage mock before tests
beforeEach(() => {
  localStorageMock.clear()
  vi.stubGlobal("localStorage", localStorageMock)
  // Ensure window is defined
  if (typeof window === "undefined") {
    // @ts-expect-error - creating window for test
    global.window = {} as Window & typeof globalThis
  }
  // @ts-expect-error - adding localStorage to window
  window.localStorage = localStorageMock
})

describe("useExpandedSections", () => {
  it("initializes with initial state", () => {
    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    expect(result.current.expandedSections).toEqual(initialState)
  })

  it("toggles section state", () => {
    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    expect(result.current.expandedSections.categories).toBe(true)

    act(() => {
      result.current.toggleSection("categories")
    })

    expect(result.current.expandedSections.categories).toBe(false)

    act(() => {
      result.current.toggleSection("categories")
    })

    expect(result.current.expandedSections.categories).toBe(true)
  })

  it("persists state to localStorage", () => {
    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    act(() => {
      result.current.toggleSection("insights")
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "expandedSections",
      JSON.stringify({ categories: true, insights: true }),
    )
  })

  it("loads state from localStorage on initialization", () => {
    const savedState = { categories: false, insights: true }
    localStorageMock.setItem("expandedSections", JSON.stringify(savedState))

    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    // Should merge saved state with initial state
    expect(result.current.expandedSections).toEqual(savedState)
  })

  it("merges localStorage state with initial state", () => {
    const savedState = { categories: false }
    localStorageMock.setItem("expandedSections", JSON.stringify(savedState))

    const initialState = { categories: true, insights: false, tasks: true }
    const { result } = renderHook(() => useExpandedSections(initialState))

    // Should have all keys from initial state
    expect(result.current.expandedSections).toEqual({
      categories: false, // from localStorage
      insights: false, // from initial state
      tasks: true, // from initial state
    })
  })

  it("handles invalid JSON in localStorage", () => {
    localStorageMock.setItem("expandedSections", "invalid json")

    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    // Should fall back to initial state
    expect(result.current.expandedSections).toEqual(initialState)
  })

  it("handles missing localStorage gracefully", () => {
    // Test that the hook handles the case when localStorage.getItem returns null
    // This simulates the case when localStorage is empty or unavailable
    localStorageMock.getItem.mockReturnValueOnce(null)

    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    // Should use initial state when localStorage is empty
    expect(result.current.expandedSections).toEqual(initialState)
  })

  it("updates localStorage when section is toggled", () => {
    const initialState = { categories: true, insights: false }
    const { result } = renderHook(() => useExpandedSections(initialState))

    localStorageMock.setItem.mockClear()

    act(() => {
      result.current.toggleSection("insights")
    })

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "expandedSections",
      JSON.stringify({ categories: true, insights: true }),
    )
  })

  it("handles multiple sections", () => {
    const initialState = {
      categories: true,
      insights: false,
      tasks: true,
      analytics: false,
    }
    const { result } = renderHook(() => useExpandedSections(initialState))

    act(() => {
      result.current.toggleSection("insights")
      result.current.toggleSection("analytics")
    })

    expect(result.current.expandedSections).toEqual({
      categories: true,
      insights: true,
      tasks: true,
      analytics: true,
    })
  })

  it("preserves other sections when toggling one", () => {
    const initialState = { categories: true, insights: false, tasks: true }
    const { result } = renderHook(() => useExpandedSections(initialState))

    act(() => {
      result.current.toggleSection("insights")
    })

    expect(result.current.expandedSections.categories).toBe(true)
    expect(result.current.expandedSections.insights).toBe(true)
    expect(result.current.expandedSections.tasks).toBe(true)
  })
})
