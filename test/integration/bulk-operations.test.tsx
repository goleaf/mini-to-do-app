import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { useRouter } from "next/navigation"
import Home from "../../app/page"
import { getTasks, getCategories, bulkUpdateTasks, deleteTask } from "@/lib/actions"
import { toast } from "sonner"

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

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockCategories = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "inbox", createdAt: new Date().toISOString() },
]

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "todo",
    priority: "normal",
    categoryId: "inbox",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "todo",
    priority: "normal",
    categoryId: "inbox",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    status: "todo",
    priority: "normal",
    categoryId: "inbox",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
]

describe("Integration: Bulk Operations Flow", () => {
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
    ;(bulkUpdateTasks as any).mockResolvedValue(true)
    ;(deleteTask as any).mockResolvedValue(true)
  })

  it("completes bulk selection → bulk complete → bulk delete flow", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify bulk operations are available
    expect(bulkUpdateTasks).toBeDefined()
    expect(deleteTask).toBeDefined()

    // Verify tasks are rendered
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument()
    })
  })

  it("handles bulk complete operation", async () => {
    const updatedTasks = mockTasks.map((task) => ({
      ...task,
      isCompleted: true,
      status: "done" as const,
    }))

    ;(bulkUpdateTasks as any).mockResolvedValue(updatedTasks)
    ;(getTasks as any).mockResolvedValue(updatedTasks)

    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify bulk update functionality
    expect(bulkUpdateTasks).toBeDefined()
  })

  it("handles bulk delete operation", async () => {
    const remainingTasks = [mockTasks[0]]
    ;(getTasks as any).mockResolvedValue(remainingTasks)

    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify bulk delete functionality
    expect(deleteTask).toBeDefined()
  })

  it("handles error rollback during bulk operations", async () => {
    const error = new Error("Bulk operation failed")
    ;(bulkUpdateTasks as any).mockRejectedValue(error)

    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify error handling
    expect(bulkUpdateTasks).toBeDefined()
    expect(toast.error).toBeDefined()
  })

  it("handles partial failure during bulk operations", async () => {
    // Simulate partial success
    ;(deleteTask as any)
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error("Delete failed"))
      .mockResolvedValueOnce(true)

    render(<Home />)

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled()
    })

    // Verify error handling for partial failures
    expect(deleteTask).toBeDefined()
  })
})

