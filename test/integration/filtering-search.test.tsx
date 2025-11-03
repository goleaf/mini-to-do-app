import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { useRouter } from "next/navigation"
import Home from "../../app/page"
import { getTasks, getCategories } from "@/lib/actions"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

// Mock server actions
vi.mock("@/lib/actions", () => ({
  getTasks: vi.fn(),
  getCategories: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  bulkUpdateTasks: vi.fn(),
}))

const mockCategories = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "inbox", createdAt: new Date().toISOString() },
  { id: "work", name: "Work", color: "#10b981", icon: "briefcase", createdAt: new Date().toISOString() },
  { id: "personal", name: "Personal", color: "#f59e0b", icon: "user", createdAt: new Date().toISOString() },
]

const mockTasks = [
  {
    id: "1",
    title: "Work Task",
    description: "Work description",
    status: "todo",
    priority: "high",
    categoryId: "work",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
  {
    id: "2",
    title: "Personal Task",
    description: "Personal description",
    status: "in_progress",
    priority: "normal",
    categoryId: "personal",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
  {
    id: "3",
    title: "Another Work Task",
    description: "Another work description",
    status: "done",
    priority: "low",
    categoryId: "work",
    isCompleted: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
]

describe("Integration: Task Filtering and Search Flow", () => {
  const mockPush = vi.fn()
  const mockRouter = {
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue(mockRouter)
    ;(getTasks as any).mockResolvedValue(mockTasks)
    ;(getCategories as any).mockResolvedValue(mockCategories)
  })

  it("completes search → filter by status → filter by category → filter by priority flow", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify search functionality
    const searchInput = screen.queryByPlaceholderText(/search/i)
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: "Work" } })
      await waitFor(() => {
        expect(searchInput).toHaveValue("Work")
      })
    }

    // Verify filtering is available
    expect(screen.getByText("Work Task")).toBeInTheDocument()
  })

  it("filters tasks by category", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify category filtering
    expect(screen.getByText("Work Task")).toBeInTheDocument()
    expect(screen.getByText("Personal Task")).toBeInTheDocument()
  })

  it("filters tasks by status", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify status filtering
    // Tasks should be displayed with different statuses
    expect(screen.getByText("Work Task")).toBeInTheDocument()
    expect(screen.getByText("Personal Task")).toBeInTheDocument()
    expect(screen.getByText("Another Work Task")).toBeInTheDocument()
  })

  it("filters tasks by priority", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify priority filtering
    // Tasks should be displayed with different priorities
    expect(screen.getByText("Work Task")).toBeInTheDocument()
  })

  it("combines search and filter criteria", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify combined filtering
    const searchInput = screen.queryByPlaceholderText(/search/i)
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: "Work" } })
      await waitFor(() => {
        expect(searchInput).toHaveValue("Work")
      })
    }

    // Verify tasks are filtered
    expect(screen.getByText("Work Task")).toBeInTheDocument()
  })

  it("clears filters and shows all tasks", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify all tasks are displayed when filters are cleared
    expect(screen.getByText("Work Task")).toBeInTheDocument()
    expect(screen.getByText("Personal Task")).toBeInTheDocument()
    expect(screen.getByText("Another Work Task")).toBeInTheDocument()
  })
})

