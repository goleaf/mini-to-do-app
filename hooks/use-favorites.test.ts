import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './use-favorites'

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

describe('useFavorites', () => {
  it('should initialize with empty favorites array', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
  })

  it('should add item to favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('item-1')
    })

    expect(result.current.favorites).toContain('item-1')
    expect(result.current.isFavorite('item-1')).toBe(true)
  })

  it('should remove item from favorites when toggled again', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('item-1')
    })

    expect(result.current.isFavorite('item-1')).toBe(true)

    act(() => {
      result.current.toggleFavorite('item-1')
    })

    expect(result.current.favorites).not.toContain('item-1')
    expect(result.current.isFavorite('item-1')).toBe(false)
  })

  it('should handle multiple favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('item-1')
      result.current.toggleFavorite('item-2')
      result.current.toggleFavorite('item-3')
    })

    expect(result.current.favorites.length).toBe(3)
    expect(result.current.isFavorite('item-1')).toBe(true)
    expect(result.current.isFavorite('item-2')).toBe(true)
    expect(result.current.isFavorite('item-3')).toBe(true)
  })

  it('should return false for non-favorite items', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isFavorite('item-1')).toBe(false)
  })

  it('should maintain favorites when toggling other items', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('item-1')
      result.current.toggleFavorite('item-2')
    })

    expect(result.current.favorites.length).toBe(2)

    act(() => {
      result.current.toggleFavorite('item-3')
    })

    expect(result.current.favorites.length).toBe(3)
    expect(result.current.isFavorite('item-1')).toBe(true)
    expect(result.current.isFavorite('item-2')).toBe(true)
    expect(result.current.isFavorite('item-3')).toBe(true)
  })

  it('should remove correct item when multiple favorites exist', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('item-1')
      result.current.toggleFavorite('item-2')
      result.current.toggleFavorite('item-3')
    })

    act(() => {
      result.current.toggleFavorite('item-2')
    })

    expect(result.current.favorites.length).toBe(2)
    expect(result.current.isFavorite('item-1')).toBe(true)
    expect(result.current.isFavorite('item-2')).toBe(false)
    expect(result.current.isFavorite('item-3')).toBe(true)
  })
})

