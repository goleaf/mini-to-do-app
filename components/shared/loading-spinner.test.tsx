import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LoadingSpinner, LoadingButton } from "@/components/shared/loading-spinner"

describe("LoadingSpinner", () => {
  it("renders with default size", () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass("w-6", "h-6") // default md size
  })

  it("renders with small size", () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toHaveClass("w-4", "h-4")
  })

  it("renders with large size", () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toHaveClass("w-8", "h-8")
  })

  it("applies custom className", () => {
    const { container } = render(<LoadingSpinner className="custom-class" />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toHaveClass("custom-class")
  })
})

describe("LoadingButton", () => {
  it("renders children when not loading", () => {
    render(
      <LoadingButton isLoading={false}>
        <span>Click me</span>
      </LoadingButton>,
    )
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("shows spinner when loading", () => {
    const { container } = render(
      <LoadingButton isLoading={true}>
        <span>Click me</span>
      </LoadingButton>,
    )
    expect(screen.getByText("Click me")).toBeInTheDocument()
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()
  })

  it("does not show spinner when not loading", () => {
    const { container } = render(
      <LoadingButton isLoading={false}>
        <span>Click me</span>
      </LoadingButton>,
    )
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).not.toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <LoadingButton isLoading={false} className="custom-button">
        <span>Click me</span>
      </LoadingButton>,
    )
    expect(container.firstChild).toHaveClass("custom-button")
  })
})

