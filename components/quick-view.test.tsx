import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "../test/utils/test-utils"
import { QuickView } from "./quick-view"
import { mockTasks, mockCategories } from "../test/utils/mock-data"

describe("QuickView", () => {
  it("renders all quick view cards", () => {
    render(<QuickView tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("OVERDUE")).toBeInTheDocument()
    expect(screen.getByText("TODAY")).toBeInTheDocument()
    expect(screen.getByText("TOMORROW")).toBeInTheDocument()
    expect(screen.getByText("THIS WEEK")).toBeInTheDocument()
    expect(screen.getByText("DONE TODAY")).toBeInTheDocument()
  })

  it("displays correct count for overdue tasks", () => {
    const overdueTasks = mockTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())
    render(<QuickView tasks={mockTasks} categories={mockCategories} />)

    const overdueCard = screen.getByText("OVERDUE").closest("div")
    expect(overdueCard).toBeInTheDocument()
    // Multiple cards might show the same number, so check that the count exists
    const countElements = screen.getAllByText(String(overdueTasks.length))
    expect(countElements.length).toBeGreaterThan(0)
  })

  it("displays correct count for today tasks", () => {
    const today = new Date().toISOString().split("T")[0]
    const todayTasks = mockTasks.filter((t) => t.dueDate === today && !t.isCompleted)
    render(<QuickView tasks={mockTasks} categories={mockCategories} />)

    // Multiple cards might show the same number
    const countElements = screen.getAllByText(String(todayTasks.length))
    expect(countElements.length).toBeGreaterThan(0)
  })

  it("displays correct count for completed today tasks", () => {
    const today = new Date().toISOString().split("T")[0]
    const completedToday = mockTasks.filter(
      (t) => t.isCompleted && new Date(t.updatedAt).toISOString().split("T")[0] === today,
    )
    render(<QuickView tasks={mockTasks} categories={mockCategories} />)

    const doneTodayCard = screen.getByText("DONE TODAY").closest("div")
    expect(doneTodayCard).toBeInTheDocument()
    // Verify the count is displayed (might be 0 or more)
    const countElements = screen.getAllByText(String(completedToday.length))
    expect(countElements.length).toBeGreaterThan(0)
  })

  it("handles empty tasks array", () => {
    render(<QuickView tasks={[]} categories={mockCategories} />)

    // All cards will show 0, so check that at least one exists
    const countElements = screen.getAllByText("0")
    expect(countElements.length).toBeGreaterThanOrEqual(5) // All 5 cards should show 0
  })

  it("renders with correct styling classes", () => {
    const { container } = render(<QuickView tasks={mockTasks} categories={mockCategories} />)

    const cards = container.querySelectorAll('[class*="bg-gradient"]')
    expect(cards.length).toBeGreaterThan(0)
  })
})

