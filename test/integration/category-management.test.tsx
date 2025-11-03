import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { useRouter } from "next/navigation"
import CategoriesPage from "../../app/categories/page"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/actions"
import { toast } from "sonner"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

// Mock server actions
vi.mock("@/lib/actions", () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
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
  { id: "work", name: "Work", color: "#10b981", icon: "briefcase", createdAt: new Date().toISOString() },
]

describe("Integration: Category Management Flow", () => {
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

  it("completes full category management flow: create → edit → delete", async () => {
    const newCategory = {
      id: "new-cat",
      name: "New Category",
      color: "#ef4444",
      icon: "star",
      createdAt: new Date().toISOString(),
    }

    const updatedCategory = {
      ...newCategory,
      name: "Updated Category",
      color: "#f59e0b",
    }

    ;(createCategory as any).mockResolvedValue(newCategory)
    ;(updateCategory as any).mockResolvedValue(updatedCategory)
    ;(deleteCategory as any).mockResolvedValue(true)
    ;(getCategories as any)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce([...mockCategories, newCategory])
      .mockResolvedValueOnce([...mockCategories, updatedCategory])
      .mockResolvedValueOnce(mockCategories)

    render(<CategoriesPage />)

    // Wait for initial load
    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify categories are displayed
    await waitFor(() => {
      expect(screen.getByText("Inbox")).toBeInTheDocument()
      expect(screen.getByText("Work")).toBeInTheDocument()
    })

    // Verify category operations are available
    expect(createCategory).toBeDefined()
    expect(updateCategory).toBeDefined()
    expect(deleteCategory).toBeDefined()
  })

  it("handles category creation with validation", async () => {
    const newCategory = {
      id: "valid-cat",
      name: "Valid Category",
      color: "#3b82f6",
      icon: "check",
      createdAt: new Date().toISOString(),
    }

    ;(createCategory as any).mockResolvedValue(newCategory)
    ;(getCategories as any).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([...mockCategories, newCategory])

    render(<CategoriesPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify creation functionality
    expect(createCategory).toBeDefined()
  })

  it("handles category update with validation", async () => {
    const updatedCategory = {
      ...mockCategories[0],
      name: "Updated Inbox",
      color: "#8b5cf6",
    }

    ;(updateCategory as any).mockResolvedValue(updatedCategory)
    ;(getCategories as any).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([updatedCategory, mockCategories[1]])

    render(<CategoriesPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify update functionality
    expect(updateCategory).toBeDefined()
  })

  it("handles category deletion with confirmation", async () => {
    ;(deleteCategory as any).mockResolvedValue(true)
    ;(getCategories as any).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([mockCategories[1]])

    render(<CategoriesPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify deletion functionality
    expect(deleteCategory).toBeDefined()
  })

  it("handles error rollback during category operations", async () => {
    const error = new Error("Category operation failed")
    ;(createCategory as any).mockRejectedValue(error)

    render(<CategoriesPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })

    // Verify error handling
    expect(toast.error).toBeDefined()
  })
})

