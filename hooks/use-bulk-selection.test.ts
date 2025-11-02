import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useBulkSelection } from "@/hooks/use-bulk-selection"

describe("useBulkSelection", () => {
  it("initializes with empty selection", () => {
    const { result } = renderHook(() => useBulkSelection())

    expect(result.current.selectedIds).toEqual([])
    expect(result.current.selectedCount).toBe(0)
    expect(result.current.isSelected("any-id")).toBe(false)
  })

  it("toggles selection for an item", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.toggleSelection("task-1")
    })

    expect(result.current.selectedIds).toEqual(["task-1"])
    expect(result.current.selectedCount).toBe(1)
    expect(result.current.isSelected("task-1")).toBe(true)

    act(() => {
      result.current.toggleSelection("task-1")
    })

    expect(result.current.selectedIds).toEqual([])
    expect(result.current.selectedCount).toBe(0)
    expect(result.current.isSelected("task-1")).toBe(false)
  })

  it("selects multiple items", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.toggleSelection("task-1")
      result.current.toggleSelection("task-2")
      result.current.toggleSelection("task-3")
    })

    expect(result.current.selectedCount).toBe(3)
    expect(result.current.isSelected("task-1")).toBe(true)
    expect(result.current.isSelected("task-2")).toBe(true)
    expect(result.current.isSelected("task-3")).toBe(true)
  })

  it("selects all items", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.selectAll(["task-1", "task-2", "task-3"])
    })

    expect(result.current.selectedIds).toEqual(["task-1", "task-2", "task-3"])
    expect(result.current.selectedCount).toBe(3)
    expect(result.current.isSelected("task-1")).toBe(true)
    expect(result.current.isSelected("task-2")).toBe(true)
    expect(result.current.isSelected("task-3")).toBe(true)
  })

  it("clears selection", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.selectAll(["task-1", "task-2", "task-3"])
    })

    expect(result.current.selectedCount).toBe(3)

    act(() => {
      result.current.clearSelection()
    })

    expect(result.current.selectedIds).toEqual([])
    expect(result.current.selectedCount).toBe(0)
    expect(result.current.isSelected("task-1")).toBe(false)
  })

  it("replaces selection when selectAll is called", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.toggleSelection("task-1")
      result.current.toggleSelection("task-2")
    })

    expect(result.current.selectedCount).toBe(2)

    act(() => {
      result.current.selectAll(["task-3", "task-4"])
    })

    expect(result.current.selectedIds).toEqual(["task-3", "task-4"])
    expect(result.current.selectedCount).toBe(2)
    expect(result.current.isSelected("task-1")).toBe(false)
    expect(result.current.isSelected("task-2")).toBe(false)
    expect(result.current.isSelected("task-3")).toBe(true)
    expect(result.current.isSelected("task-4")).toBe(true)
  })

  it("handles empty array in selectAll", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.toggleSelection("task-1")
    })

    expect(result.current.selectedCount).toBe(1)

    act(() => {
      result.current.selectAll([])
    })

    expect(result.current.selectedIds).toEqual([])
    expect(result.current.selectedCount).toBe(0)
  })

  it("returns selectedIds as array", () => {
    const { result } = renderHook(() => useBulkSelection())

    act(() => {
      result.current.toggleSelection("task-1")
      result.current.toggleSelection("task-2")
    })

    expect(Array.isArray(result.current.selectedIds)).toBe(true)
    expect(result.current.selectedIds.length).toBe(2)
  })
})

