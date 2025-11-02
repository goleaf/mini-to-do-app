import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../test/utils/test-utils"
import { CategoryManagerContent } from "./category-manager"
import { mockCategories } from "../test/utils/mock-data"
import * as actions from "@/lib/actions"
import { toast } from "sonner"

// Mock server actions
vi.mock("@/lib/actions", () => ({
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

// Mock window.confirm
const mockConfirm = vi.fn(() => true)
window.confirm = mockConfirm

describe("CategoryManagerContent", () => {
  const mockOnCategoriesChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
  })

  it("renders categories list", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })

  it("renders create new category section", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    expect(screen.getByText("Create New Category")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Category name...")).toBeInTheDocument()
    expect(screen.getByText("Create Category")).toBeInTheDocument()
  })

  it("enters edit mode when edit button is clicked", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const editButtons = screen.getAllByRole("button")
    const editButton = editButtons.find((btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-edit"))

    if (editButton) {
      fireEvent.click(editButton)

      const input = screen.getByDisplayValue(mockCategories[0].name)
      expect(input).toBeInTheDocument()
      expect(screen.getByText("Save")).toBeInTheDocument()
    }
  })

  it("updates category name in edit mode", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const editButtons = screen.getAllByRole("button")
    const editButton = editButtons.find((btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-edit"))

    if (editButton) {
      fireEvent.click(editButton)

      const input = screen.getByDisplayValue(mockCategories[0].name)
      fireEvent.change(input, { target: { value: "Updated Category" } })

      expect(input).toHaveValue("Updated Category")
    }
  })

  it("saves category edit", async () => {
    const mockUpdateCategory = vi.spyOn(actions, "updateCategory").mockResolvedValue({
      ...mockCategories[0],
      name: "Updated Category",
    })

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const editButtons = screen.getAllByRole("button")
    const editButton = editButtons.find((btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-edit"))

    if (editButton) {
      fireEvent.click(editButton)

      const input = screen.getByDisplayValue(mockCategories[0].name)
      fireEvent.change(input, { target: { value: "Updated Category" } })

      const saveButton = screen.getByText("Save")
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateCategory).toHaveBeenCalledWith(mockCategories[0].id, {
          name: "Updated Category",
          color: mockCategories[0].color,
        })
        expect(toast.success).toHaveBeenCalledWith("Category updated successfully")
        expect(mockOnCategoriesChange).toHaveBeenCalled()
      })
    }

    mockUpdateCategory.mockRestore()
  })

  it("deletes category when delete button is clicked", async () => {
    const mockDeleteCategory = vi.spyOn(actions, "deleteCategory").mockResolvedValue(true)

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const deleteButtons = screen.getAllByRole("button")
    const deleteButton = deleteButtons.find((btn) =>
      btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-trash"),
    )

    if (deleteButton) {
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategories[0].id)
        expect(toast.success).toHaveBeenCalledWith("Category deleted successfully")
        expect(mockOnCategoriesChange).toHaveBeenCalled()
      })
    }

    mockDeleteCategory.mockRestore()
  })

  it("does not delete category when confirmation is cancelled", async () => {
    mockConfirm.mockReturnValue(false)
    const mockDeleteCategory = vi.spyOn(actions, "deleteCategory")

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const deleteButtons = screen.getAllByRole("button")
    const deleteButton = deleteButtons.find((btn) =>
      btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-trash"),
    )

    if (deleteButton) {
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(mockDeleteCategory).not.toHaveBeenCalled()
      })
    }

    mockDeleteCategory.mockRestore()
  })

  it("creates new category", async () => {
    const mockCreateCategory = vi.spyOn(actions, "createCategory").mockResolvedValue({
      id: "new-category-id",
      name: "New Category",
      color: "#0891b2",
      icon: "inbox",
      createdAt: new Date().toISOString(),
    })

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const nameInput = screen.getByPlaceholderText("Category name...")
    fireEvent.change(nameInput, { target: { value: "New Category" } })

    const createButton = screen.getByText("Create Category")
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith({
        name: "New Category",
        color: "#0891b2",
        icon: "inbox",
      })
      expect(toast.success).toHaveBeenCalledWith("Category created successfully")
      expect(mockOnCategoriesChange).toHaveBeenCalled()
      expect(nameInput).toHaveValue("")
    })

    mockCreateCategory.mockRestore()
  })

  it("shows error when creating category without name", async () => {
    const mockCreateCategory = vi.spyOn(actions, "createCategory")

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const createButton = screen.getByText("Create Category")
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockCreateCategory).not.toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith("Category name is required")
    })

    mockCreateCategory.mockRestore()
  })

  it("handles error when updating category fails", async () => {
    const mockUpdateCategory = vi.spyOn(actions, "updateCategory").mockRejectedValue(new Error("Update failed"))

    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const editButtons = screen.getAllByRole("button")
    const editButton = editButtons.find((btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-edit"))

    if (editButton) {
      fireEvent.click(editButton)

      const saveButton = screen.getByText("Save")
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Update failed")
      })
    }

    mockUpdateCategory.mockRestore()
  })

  it("allows selecting color when editing", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    const editButtons = screen.getAllByRole("button")
    const editButton = editButtons.find((btn) => btn.querySelector("svg")?.getAttribute("class")?.includes("lucide-edit"))

    if (editButton) {
      fireEvent.click(editButton)

      // Find color buttons (they should be rendered in edit mode)
      const colorButtons = screen.getAllByRole("button")
      const colorButtonsInEdit = colorButtons.filter((btn) => btn.style.backgroundColor)

      expect(colorButtonsInEdit.length).toBeGreaterThan(0)
    }
  })

  it("allows selecting color when creating", () => {
    render(
      <CategoryManagerContent categories={mockCategories} onCategoriesChange={mockOnCategoriesChange} />,
    )

    // Color buttons should be visible in create section
    const colorButtons = screen.getAllByRole("button")
    const colorButtonsInCreate = colorButtons.filter((btn) => btn.style.backgroundColor)

    expect(colorButtonsInCreate.length).toBeGreaterThan(0)
  })
})

