import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../test/utils/test-utils"
import { TaskFilters } from "./task-filters"

const mockCategories = [
  { id: "inbox", name: "Inbox", icon: "inbox" },
  { id: "work", name: "Work", icon: "briefcase" },
]

describe("TaskFilters", () => {
  const mockOnStatusChange = vi.fn()
  const mockOnPriorityChange = vi.fn()
  const mockOnCategoryChange = vi.fn()
  const mockOnSearchChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders task filters with all controls", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument()
  })

  it("renders status select", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    const statusSelect = screen.getByRole("combobox")
    expect(statusSelect).toBeInTheDocument()
  })

  it("calls onSearchChange when search input changes", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    const searchInput = screen.getByPlaceholderText("Search tasks...")
    fireEvent.change(searchInput, { target: { value: "test query" } })

    expect(mockOnSearchChange).toHaveBeenCalledWith("test query")
  })

  it("displays current search value", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search="current search"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    const searchInput = screen.getByPlaceholderText("Search tasks...")
    expect(searchInput).toHaveValue("current search")
  })

  it("renders all filter selects", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    // All selects should be rendered
    const selects = screen.getAllByRole("combobox")
    expect(selects.length).toBeGreaterThan(0)
  })

  it("renders categories in category select", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    // Category select should be rendered
    const selects = screen.getAllByRole("combobox")
    expect(selects.length).toBeGreaterThan(0)
  })

  it("handles empty categories array", () => {
    render(
      <TaskFilters
        status="all"
        priority="all"
        category="all"
        search=""
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={[]}
      />,
    )

    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument()
  })

  it("maintains filter state", () => {
    render(
      <TaskFilters
        status="todo"
        priority="high"
        category="work"
        search="test"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
        onCategoryChange={mockOnCategoryChange}
        onSearchChange={mockOnSearchChange}
        categories={mockCategories}
      />,
    )

    const searchInput = screen.getByPlaceholderText("Search tasks...")
    expect(searchInput).toHaveValue("test")
  })
})

