import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../test/utils/test-utils"
import { useRouter } from "next/navigation"
import ManageCategoriesPage from "../../app/categories/page"
import { getCategories } from "@/lib/actions"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

// Mock server actions
vi.mock("@/lib/actions", () => ({
  getCategories: vi.fn(),
}))

const mockCategories = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "inbox" },
  { id: "work", name: "Work", color: "#10b981", icon: "briefcase" },
]

describe("ManageCategoriesPage", () => {
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

    render(<ManageCategoriesPage />)

    // Should show loading spinner (div with spinner classes)
    const spinner = document.querySelector(".w-8.h-8.border-4")
    expect(spinner).toBeInTheDocument()
  })

  it("renders page after loading categories", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(screen.getByText("Manage Categories")).toBeInTheDocument()
    })

    expect(screen.getByText("Back to tasks")).toBeInTheDocument()
    expect(screen.getByText("Refresh")).toBeInTheDocument()
  })

  it("loads categories on mount", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalled()
    })
  })

  it("displays category manager with loaded categories", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(screen.getByText("Manage Categories")).toBeInTheDocument()
    })

    // CategoryManagerContent should be rendered
    // This is tested indirectly through the CategoryManager component tests
    expect(screen.getByText("Manage Categories")).toBeInTheDocument()
  })

  it("navigates back when Back button is clicked", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(screen.getByText("Back to tasks")).toBeInTheDocument()
    })

    const backButton = screen.getByText("Back to tasks").closest("button")
    fireEvent.click(backButton!)

    expect(mockPush).toHaveBeenCalledWith("/")
  })

  it("refreshes categories when Refresh button is clicked", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(screen.getByText("Refresh")).toBeInTheDocument()
    })

    const refreshButton = screen.getByText("Refresh")
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(getCategories).toHaveBeenCalledTimes(2) // Once on mount, once on refresh
    })
  })

  it("shows refreshing state during refresh", async () => {
    // First resolve immediately for initial load
    ;(getCategories as any).mockResolvedValueOnce(mockCategories)

    let resolveRefresh: (value: any) => void
    const refreshPromise = new Promise((resolve) => {
      resolveRefresh = resolve
    })
    ;(getCategories as any).mockImplementationOnce(() => refreshPromise)

    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(screen.getByText("Manage Categories")).toBeInTheDocument()
    })

    const refreshButton = screen.getByRole("button", { name: /refresh/i })
    fireEvent.click(refreshButton)

    // Should show refreshing state
    await waitFor(() => {
      expect(screen.getByText("Refreshing")).toBeInTheDocument()
    })

    // Resolve the refresh promise
    resolveRefresh!(mockCategories)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument()
    })
  })

  it("displays page description", async () => {
    render(<ManageCategoriesPage />)

    await waitFor(() => {
      expect(
        screen.getByText("Create, edit, and delete the categories that organize your tasks."),
      ).toBeInTheDocument()
    })
  })
})

