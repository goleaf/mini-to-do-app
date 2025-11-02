import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from './use-search'

interface TestItem {
  id: string
  name: string
  description: string
}

const mockItems: TestItem[] = [
  { id: '1', name: 'Apple', description: 'Red fruit' },
  { id: '2', name: 'Banana', description: 'Yellow fruit' },
  { id: '3', name: 'Cherry', description: 'Red fruit' },
]

describe('useSearch', () => {
  it('should initialize with empty search query', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.name.toLowerCase().includes(query))
    )

    expect(result.current.searchQuery).toBe('')
    expect(result.current.results).toEqual(mockItems)
  })

  it('should return all items when search query is empty', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.name.toLowerCase().includes(query))
    )

    expect(result.current.results.length).toBe(mockItems.length)
  })

  it('should filter items based on search function', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.name.toLowerCase().includes(query))
    )

    act(() => {
      result.current.setSearchQuery('apple')
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].name).toBe('Apple')
  })

  it('should filter by description when search function checks description', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.description.toLowerCase().includes(query))
    )

    act(() => {
      result.current.setSearchQuery('yellow')
    })

    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0].name).toBe('Banana')
  })

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.name.toLowerCase().includes(query))
    )

    act(() => {
      result.current.setSearchQuery('xyz')
    })

    expect(result.current.results).toEqual([])
  })

  it('should handle empty item list', () => {
    const { result } = renderHook(() =>
      useSearch([], (item, query) => item.name.toLowerCase().includes(query))
    )

    expect(result.current.results).toEqual([])
  })

  it('should trim search query before filtering', () => {
    const { result } = renderHook(() =>
      useSearch(mockItems, (item, query) => item.name.toLowerCase().includes(query.trim()))
    )

    act(() => {
      result.current.setSearchQuery('  apple  ')
    })

    // Should still return results because query is trimmed in search function
    expect(result.current.results.length).toBeGreaterThan(0)
  })

  it('should update results when items change', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useSearch(items, (item, query) => item.name.toLowerCase().includes(query)),
      {
        initialProps: { items: mockItems },
      }
    )

    act(() => {
      result.current.setSearchQuery('apple')
    })

    expect(result.current.results.length).toBe(1)

    const newItems = [...mockItems, { id: '4', name: 'Apple Pie', description: 'Dessert' }]
    rerender({ items: newItems })

    expect(result.current.results.length).toBe(2)
  })
})

