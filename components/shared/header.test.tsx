import { describe, it, expect } from "vitest"
import { render, screen } from "../../test/utils/test-utils"
import { PageHeader } from "./header"

describe("PageHeader", () => {
  it("renders title", () => {
    render(<PageHeader title="Test Page" />)

    expect(screen.getByText("Test Page")).toBeInTheDocument()
  })

  it("renders subtitle when provided", () => {
    render(<PageHeader title="Test Page" subtitle="Test subtitle" />)

    expect(screen.getByText("Test subtitle")).toBeInTheDocument()
  })

  it("does not render subtitle when not provided", () => {
    render(<PageHeader title="Test Page" />)

    expect(screen.queryByText("Test subtitle")).not.toBeInTheDocument()
  })

  it("renders actions when provided", () => {
    const actionContent = <button>Action Button</button>
    render(<PageHeader title="Test Page" actions={actionContent} />)

    expect(screen.getByText("Action Button")).toBeInTheDocument()
  })

  it("does not render actions when not provided", () => {
    render(<PageHeader title="Test Page" />)

    expect(screen.queryByText("Action Button")).not.toBeInTheDocument()
  })

  it("renders title with correct styling", () => {
    render(<PageHeader title="Test Page" />)

    const title = screen.getByText("Test Page")
    expect(title).toHaveClass("text-2xl", "font-semibold")
  })
})

