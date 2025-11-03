import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../test/utils/test-utils"
import { useRouter } from "next/navigation"
import NewTaskPage from "../../app/new/page"
import { getCategories, createTask } from "@/lib/actions"
import { toast } from "sonner"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

// Mock server actions
vi.mock("@/lib/actions", () => ({
  getCategories: vi.fn(),
  createTask: vi.fn(),
}))

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockCategories = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "inbox" },
  { id: "work", name: "Work", color: "#10b981", icon: "briefcase" },
]

describe("NewTaskPage", () => {
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
    ;(getCategories as any).mockResolvedValue(mockCategories)
  })

  it("renders loading state initially", async () => {
    ;(getCategories as any).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<NewTaskPage />)

    // Should show loading spinner (div with spinner classes)
    const spinner = document.querySelector(".w-8.h-8.border-4")
    expect(spinner).toBeInTheDocument()
  })

  it("renders page after loading categories", async () => {
    render(<NewTaskPage />)

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument()
    })

    expect(screen.getByText("Back")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
  })

  it("loads categories on mount", async () => {
    render(<NewTaskPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })
  })

  it("shows error toast when categories fail to load", async () => {
    const error = new Error("Failed to load")
    ;(getCategories as any).mockRejectedValue(error)

    render(<NewTaskPage />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load categories")
    })
  })

  it("renders TaskForm with categories", async () => {
    render(<NewTaskPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
    })

    // TaskForm should be rendered
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
  })

  it("navigates back when Back button is clicked", async () => {
    render(<NewTaskPage />)

    await waitFor(() => {
      expect(screen.getByText("Back")).toBeInTheDocument()
    })

    const backButton = screen.getByText("Back").closest("button")
    fireEvent.click(backButton!)

    expect(mockPush).toHaveBeenCalledWith("/")
  })

  it("creates task and navigates to home on successful submission", async () => {
    const mockTask = {
      id: "new-task-id",
      title: "New Task",
      status: "todo" as const,
      priority: "normal" as const,
      categoryId: "inbox",
      isCompleted: false,
      createdAt: new Date().toISOString(),
      subtasks: [],
    }

    ;(createTask as any).mockResolvedValue(mockTask)

    render(<NewTaskPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
    })

    // Fill form
    const titleInput = screen.getByPlaceholderText("Task title")
    fireEvent.change(titleInput, { target: { value: "New Task" } })

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createTask).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith("Task created successfully")
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  it("shows error toast when task creation fails", async () => {
    const error = new Error("Failed to create task")
    ;(createTask as any).mockRejectedValue(error)

    render(<NewTaskPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
    })

    // Fill form
    const titleInput = screen.getByPlaceholderText("Task title")
    fireEvent.change(titleInput, { target: { value: "New Task" } })

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create task")
    })
  })
})

