import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskFilters } from './use-task-filters'
import { mockTasks } from '../test/utils/mock-data'

describe('useTaskFilters', () => {
  it('should initialize with empty search query and all status filter', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    expect(result.current.searchQuery).toBe('')
    expect(result.current.filterStatus).toBe('all')
  })

  it('should filter tasks by search query', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    act(() => {
      result.current.setSearchQuery('Test')
    })

    expect(result.current.filteredTasks.length).toBeGreaterThan(0)
    expect(result.current.filteredTasks.every((task) => task.title.toLowerCase().includes('test'))).toBe(true)
  })

  it('should filter tasks by status', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    act(() => {
      result.current.setFilterStatus('todo')
    })

    expect(result.current.filteredTasks.every((task) => task.status === 'todo')).toBe(true)
  })

  it('should combine search query and status filter', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    act(() => {
      result.current.setSearchQuery('Test')
      result.current.setFilterStatus('in_progress')
    })

    const filtered = result.current.filteredTasks
    expect(filtered.every((task) => task.status === 'in_progress')).toBe(true)
    expect(filtered.every((task) => task.title.toLowerCase().includes('test'))).toBe(true)
  })

  it('should group tasks by status', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    expect(result.current.statusGroups.todo).toBeDefined()
    expect(result.current.statusGroups.in_progress).toBeDefined()
    expect(result.current.statusGroups.done).toBeDefined()
    expect(Array.isArray(result.current.statusGroups.todo)).toBe(true)
  })

  it('should calculate tab statistics', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    expect(result.current.tabStats.all).toBeGreaterThanOrEqual(0)
    expect(result.current.tabStats.todo).toBeGreaterThanOrEqual(0)
    expect(result.current.tabStats.in_progress).toBeGreaterThanOrEqual(0)
    expect(result.current.tabStats.done).toBeGreaterThanOrEqual(0)
  })

  it('should update tab stats when filters change', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    const initialAll = result.current.tabStats.all

    act(() => {
      result.current.setFilterStatus('todo')
    })

    // Filtered tasks count should change
    expect(result.current.tabStats.all).toBeLessThanOrEqual(initialAll)
  })

  it('should handle empty task list', () => {
    const { result } = renderHook(() => useTaskFilters([]))

    expect(result.current.filteredTasks).toEqual([])
    expect(result.current.statusGroups.todo).toEqual([])
    expect(result.current.statusGroups.in_progress).toEqual([])
    expect(result.current.statusGroups.done).toEqual([])
  })

  it('should be case-insensitive in search', () => {
    const { result } = renderHook(() => useTaskFilters(mockTasks))

    act(() => {
      result.current.setSearchQuery('TEST')
    })

    const lowerCaseResults = result.current.filteredTasks.length

    act(() => {
      result.current.setSearchQuery('test')
    })

    expect(result.current.filteredTasks.length).toBe(lowerCaseResults)
  })
})

