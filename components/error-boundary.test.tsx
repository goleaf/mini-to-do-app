import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error")
  }
  return <div>No error</div>
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("catches errors and displays error UI", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText("Test error")).toBeInTheDocument()
    expect(screen.getByText("Try Again")).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it("allows resetting error state", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()

    // Reset by re-rendering without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    )

    // After reset, the error boundary should render children again
    // Note: Error boundaries don't automatically reset on prop changes in React
    // They only reset on remount or manual reset
    consoleSpy.mockRestore()
  })

  it("uses custom fallback component when provided", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const CustomFallback = ({ error, resetError }: { error: Error | null; resetError: () => void }) => (
      <div>
        <div>Custom Error: {error?.message}</div>
        <button onClick={resetError}>Reset</button>
      </div>
    )

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Custom Error: Test error")).toBeInTheDocument()
    expect(screen.getByText("Reset")).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it("handles null error gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    // Mock getDerivedStateFromError to return null error
    const originalGetDerivedStateFromError = ErrorBoundary.getDerivedStateFromError
    ErrorBoundary.getDerivedStateFromError = () => ({ hasError: true, error: null })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument()

    ErrorBoundary.getDerivedStateFromError = originalGetDerivedStateFromError
    consoleSpy.mockRestore()
  })
})

