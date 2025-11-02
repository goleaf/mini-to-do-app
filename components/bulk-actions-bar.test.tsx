import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "../test/utils/test-utils"
import { BulkActionsBar } from "./bulk-actions-bar"

describe("BulkActionsBar", () => {
  const mockOnSelectAll = vi.fn()
  const mockOnClearSelection = vi.fn()
  const mockOnBulkDelete = vi.fn()
  const mockOnBulkComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not render when no items are selected", () => {
    render(
      <BulkActionsBar
        selectedCount={0}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/select all/i)).not.toBeInTheDocument()
  })

  it("renders when items are selected", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    expect(screen.getByText("3 selected")).toBeInTheDocument()
  })

  it("shows Select All button when not all items are selected", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    const selectAllButton = screen.getByText(/select all/i)
    expect(selectAllButton).toBeInTheDocument()
  })

  it("shows Deselect All button when all items are selected", () => {
    render(
      <BulkActionsBar
        selectedCount={10}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={true}
      />,
    )

    const deselectButton = screen.getByText(/deselect all/i)
    expect(deselectButton).toBeInTheDocument()
  })

  it("calls onSelectAll when Select All is clicked", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    const selectAllButton = screen.getByText(/select all/i)
    fireEvent.click(selectAllButton)

    expect(mockOnSelectAll).toHaveBeenCalledTimes(1)
  })

  it("calls onClearSelection when Deselect All is clicked", () => {
    render(
      <BulkActionsBar
        selectedCount={10}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={true}
      />,
    )

    const deselectButton = screen.getByText(/deselect all/i)
    fireEvent.click(deselectButton)

    expect(mockOnClearSelection).toHaveBeenCalledTimes(1)
  })

  it("calls onBulkComplete when Mark Complete is clicked", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    const completeButton = screen.getByText("Mark Complete")
    fireEvent.click(completeButton)

    expect(mockOnBulkComplete).toHaveBeenCalledTimes(1)
  })

  it("calls onBulkDelete when Delete is clicked", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    const deleteButton = screen.getByText(/delete/i)
    fireEvent.click(deleteButton)

    expect(mockOnBulkDelete).toHaveBeenCalledTimes(1)
  })

  it("calls onClearSelection when X button is clicked", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
      />,
    )

    const buttons = screen.getAllByRole("button")
    // Find the button that contains the X icon (last button, which is the close button)
    const closeButton = buttons[buttons.length - 1]
    fireEvent.click(closeButton)

    expect(mockOnClearSelection).toHaveBeenCalledTimes(1)
  })

  it("disables buttons when loading", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
        isLoading={true}
      />,
    )

    const completeButton = screen.getByText("Processing...")
    expect(completeButton).toBeDisabled()

    const deleteButton = screen.getByText(/deleting.../i)
    expect(deleteButton).toBeDisabled()
  })

  it("shows loading state when isLoading is true", () => {
    render(
      <BulkActionsBar
        selectedCount={3}
        onSelectAll={mockOnSelectAll}
        onClearSelection={mockOnClearSelection}
        onBulkDelete={mockOnBulkDelete}
        onBulkComplete={mockOnBulkComplete}
        totalCount={10}
        allSelected={false}
        isLoading={true}
      />,
    )

    expect(screen.getByText("Processing...")).toBeInTheDocument()
    expect(screen.getByText(/deleting.../i)).toBeInTheDocument()
  })
})

