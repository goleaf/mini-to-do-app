import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "../test/utils/test-utils"
import { AnalyticsPanel } from "./analytics-panel"
import { mockTasks, mockCategories } from "../test/utils/mock-data"

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any

describe("AnalyticsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders analytics panel with task statistics", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Total Tasks")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
    expect(screen.getByText("Overdue")).toBeInTheDocument()
  })

  it("displays correct total task count", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    const totalElement = screen.getByText("Total Tasks").closest(".text-center")
    expect(totalElement).toBeInTheDocument()
  })

  it("displays correct completed task count", () => {
    const completedTasks = mockTasks.filter((t) => t.isCompleted)
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Completed")).toBeInTheDocument()
  })

  it("displays correct pending task count", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Pending")).toBeInTheDocument()
  })

  it("displays correct overdue task count", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Overdue")).toBeInTheDocument()
  })

  it("displays completion rate", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Completion Rate")).toBeInTheDocument()
  })

  it("calculates completion rate correctly for empty tasks", () => {
    render(<AnalyticsPanel tasks={[]} categories={mockCategories} />)

    expect(screen.getByText("Completion Rate")).toBeInTheDocument()
    expect(screen.getByText("0%")).toBeInTheDocument()
  })

  it("displays tasks by category chart when categories have tasks", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Tasks by Category")).toBeInTheDocument()
  })

  it("displays priority distribution chart", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    expect(screen.getByText("Priority Distribution")).toBeInTheDocument()
  })

  it("handles empty tasks array", () => {
    render(<AnalyticsPanel tasks={[]} categories={mockCategories} />)

    expect(screen.getByText("Total Tasks")).toBeInTheDocument()
    expect(screen.getByText("0%")).toBeInTheDocument()
  })

  it("handles empty categories array", () => {
    render(<AnalyticsPanel tasks={mockTasks} categories={[]} />)

    expect(screen.getByText("Total Tasks")).toBeInTheDocument()
    expect(screen.getByText("Priority Distribution")).toBeInTheDocument()
  })

  it("filters out categories with zero tasks", () => {
    const categoriesWithTasks = mockCategories.filter((cat) =>
      mockTasks.some((task) => task.categoryId === cat.id),
    )
    render(<AnalyticsPanel tasks={mockTasks} categories={mockCategories} />)

    // Should only show categories that have tasks
    expect(screen.getByText("Tasks by Category")).toBeInTheDocument()
  })
})

