import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "../../test/utils/test-utils"
import { SectionHeader } from "./section-header"

describe("SectionHeader", () => {
  it("renders title", () => {
    render(<SectionHeader title="Test Section" />)

    expect(screen.getByText("Test Section")).toBeInTheDocument()
  })

  it("renders count when provided", () => {
    render(<SectionHeader title="Test Section" count={5} />)

    expect(screen.getByText("(5)")).toBeInTheDocument()
  })

  it("does not render count when not provided", () => {
    render(<SectionHeader title="Test Section" />)

    expect(screen.queryByText(/\(/)).not.toBeInTheDocument()
  })

  it("renders icon when provided", () => {
    const icon = <span data-testid="test-icon">📁</span>
    render(<SectionHeader title="Test Section" icon={icon} />)

    expect(screen.getByTestId("test-icon")).toBeInTheDocument()
  })

  it("calls onToggle when clicked", () => {
    const mockOnToggle = vi.fn()
    render(<SectionHeader title="Test Section" onToggle={mockOnToggle} />)

    const header = screen.getByText("Test Section").closest("h2")
    if (header) {
      fireEvent.click(header)
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    }
  })

  it("shows chevron when onToggle is provided", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<SectionHeader title="Test Section" onToggle={mockOnToggle} />)

    const chevron = container.querySelector("svg")
    expect(chevron).toBeInTheDocument()
  })

  it("does not show chevron when onToggle is not provided", () => {
    const { container } = render(<SectionHeader title="Test Section" />)

    const chevron = container.querySelector("svg")
    expect(chevron).not.toBeInTheDocument()
  })

  it("applies expanded class when expanded is true", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<SectionHeader title="Test Section" expanded={true} onToggle={mockOnToggle} />)

    const chevron = container.querySelector("svg")
    expect(chevron).not.toHaveClass("-rotate-90")
  })

  it("applies collapsed class when expanded is false", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<SectionHeader title="Test Section" expanded={false} onToggle={mockOnToggle} />)

    const chevron = container.querySelector("svg")
    expect(chevron).toHaveClass("-rotate-90")
  })

  it("has cursor-pointer class when onToggle is provided", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<SectionHeader title="Test Section" onToggle={mockOnToggle} />)

    const header = container.querySelector("h2")
    expect(header).toHaveClass("cursor-pointer")
  })
})

