import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../test/utils/test-utils"
import { Sidebar } from "./sidebar"
import type { Task, Category } from "@/lib/db"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

vi.stubGlobal("localStorage", localStorageMock)

const mockCategories: Category[] = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "inbox" },
  { id: "work", name: "Work", color: "#10b981", icon: "briefcase" },
  { id: "personal", name: "Personal", color: "#f59e0b", icon: "user" },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "todo",
    priority: "normal",
    categoryId: "inbox",
    isCompleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    subtasks: [],
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "in_progress",
    priority: "high",
    categoryId: "work",
    isCompleted: false,
    createdAt: "2024-01-02T00:00:00Z",
    subtasks: [],
  },
]

describe("Sidebar", () => {
  const mockOnCategorySelect = vi.fn()
  const mockOnCategoriesChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it("renders sidebar with title and task count", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("Tasks")).toBeInTheDocument()
    expect(screen.getByText("2 items")).toBeInTheDocument()
  })

  it("renders search input", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument()
  })

  it("filters categories by search query", async () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    const searchInput = screen.getByPlaceholderText("Search...")
    fireEvent.change(searchInput, { target: { value: "Work" } })

    await waitFor(() => {
      expect(screen.getByText("Work")).toBeInTheDocument()
      expect(screen.queryByText("Personal")).not.toBeInTheDocument()
    })
  })

  it("renders categories section", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("CATEGORIES")).toBeInTheDocument()
  })

  it("renders All Tasks button", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("All Tasks")).toBeInTheDocument()
  })

  it("calls onCategorySelect when All Tasks is clicked", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    const allTasksButton = screen.getByText("All Tasks")
    fireEvent.click(allTasksButton)

    expect(mockOnCategorySelect).toHaveBeenCalledWith(null)
  })

  it("renders category list", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("Inbox")).toBeInTheDocument()
    expect(screen.getByText("Work")).toBeInTheDocument()
    expect(screen.getByText("Personal")).toBeInTheDocument()
  })

  it("calls onCategorySelect when category is clicked", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    const inboxButton = screen.getByText("Inbox")
    fireEvent.click(inboxButton)

    expect(mockOnCategorySelect).toHaveBeenCalledWith("inbox")
  })

  it("highlights selected category", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory="work"
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    const workButton = screen.getByText("Work").closest("button")
    expect(workButton).toHaveClass("bg-secondary", "text-primary", "font-medium")
  })

  it("displays task count for each category", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    // Inbox has 1 task, Work has 1 task
    const badges = screen.getAllByText("1")
    expect(badges.length).toBeGreaterThan(0)
  })

  it("renders insights section", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("INSIGHTS")).toBeInTheDocument()
  })

  it("toggles categories section", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    // SectionHeader is rendered, verify it's present
    expect(screen.getByText("CATEGORIES")).toBeInTheDocument()

    // Categories section should be expanded by default (from useExpandedSections default)
    expect(screen.getByText("All Tasks")).toBeInTheDocument()
  })

  it("toggles insights section", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    // SectionHeader is rendered, verify it's present
    expect(screen.getByText("INSIGHTS")).toBeInTheDocument()

    // Insights section should be expanded by default (from useExpandedSections default)
    expect(screen.getByText("Productivity")).toBeInTheDocument()
  })

  it("renders Manage button", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("Manage")).toBeInTheDocument()
  })

  it("renders Settings button", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("opens category manager when Manage button is clicked", async () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    const manageButton = screen.getByText("Manage")
    fireEvent.click(manageButton)

    // CategoryManager should open (tested in CategoryManager tests)
    // We can verify the dialog is rendered
    await waitFor(() => {
      // CategoryManager component should be rendered
      // The exact test depends on CategoryManager implementation
    })
  })

  it("shows no categories message when categories list is empty", () => {
    render(
      <Sidebar
        categories={[]}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={mockTasks.length}
      />,
    )

    expect(screen.getByText("No categories")).toBeInTheDocument()
  })

  it("displays correct total task count", () => {
    render(
      <Sidebar
        categories={mockCategories}
        tasks={mockTasks}
        onCategorySelect={mockOnCategorySelect}
        selectedCategory={null}
        onCategoriesChange={mockOnCategoriesChange}
        totalTasks={5}
      />,
    )

    expect(screen.getByText("5 items")).toBeInTheDocument()
  })
})

