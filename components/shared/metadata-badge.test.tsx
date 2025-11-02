import { describe, it, expect } from "vitest"
import { render, screen } from "../../test/utils/test-utils"
import { MetadataBadge } from "./metadata-badge"

describe("MetadataBadge", () => {
  it("renders label", () => {
    render(<MetadataBadge label="Test Badge" />)

    expect(screen.getByText("Test Badge")).toBeInTheDocument()
  })

  it("renders with default variant", () => {
    const { container } = render(<MetadataBadge label="Test Badge" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("bg-muted")
  })

  it("renders with priority-high variant", () => {
    const { container } = render(<MetadataBadge label="High Priority" variant="priority-high" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("bg-red-100/50", "text-red-700")
  })

  it("renders with priority-low variant", () => {
    const { container } = render(<MetadataBadge label="Low Priority" variant="priority-low" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("bg-emerald-100/50", "text-emerald-700")
  })

  it("renders with status variant", () => {
    const { container } = render(<MetadataBadge label="Active" variant="status" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("bg-blue-100/50", "text-blue-700")
  })

  it("renders with recurring variant", () => {
    const { container } = render(<MetadataBadge label="Daily" variant="recurring" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("bg-purple-100/50", "text-purple-700")
  })

  it("applies custom className", () => {
    const { container } = render(<MetadataBadge label="Test Badge" className="custom-class" />)

    const badge = container.querySelector("span")
    expect(badge).toHaveClass("custom-class")
  })
})

