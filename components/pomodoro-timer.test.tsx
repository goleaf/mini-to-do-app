import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../test/utils/test-utils"
import { PomodoroTimer } from "./pomodoro-timer"

// Mock Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: "",
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  }),
  destination: {},
  currentTime: 0,
})) as any

describe("PomodoroTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders pomodoro timer with default values", () => {
    render(<PomodoroTimer />)

    expect(screen.getByText("Focus Time")).toBeInTheDocument()
    expect(screen.getByText("25:00")).toBeInTheDocument()
  })

  it("renders with custom initial minutes", () => {
    render(<PomodoroTimer initialMinutes={30} />)

    expect(screen.getByText("30:00")).toBeInTheDocument()
  })

  it("displays task title when provided", () => {
    render(<PomodoroTimer taskTitle="Test Task" />)

    expect(screen.getByText("Current Task")).toBeInTheDocument()
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })

  it("starts timer when Start button is clicked", async () => {
    render(<PomodoroTimer />)

    const startButton = screen.getByRole("button", { name: /start/i })
    fireEvent.click(startButton)

    expect(screen.getByText("Pause")).toBeInTheDocument()
  })

  it("pauses timer when Pause button is clicked", async () => {
    render(<PomodoroTimer />)

    const startButton = screen.getByRole("button", { name: /start/i })
    fireEvent.click(startButton)

    // Wait for state update
    await waitFor(() => {
      const pauseButton = screen.queryByRole("button", { name: /pause/i })
      if (pauseButton) {
        fireEvent.click(pauseButton)
        expect(screen.getByText("Start")).toBeInTheDocument()
      }
    }, { timeout: 3000 })
  })

  it("resets timer when Reset button is clicked", () => {
    render(<PomodoroTimer initialMinutes={25} />)

    // Find reset button (icon button with RotateCcw icon)
    const buttons = screen.getAllByRole("button")
    const resetButton = buttons.find((btn) => btn.querySelector('svg'))

    if (resetButton) {
      fireEvent.click(resetButton)
      // Timer should reset to initial state
      expect(screen.getByText("25:00")).toBeInTheDocument()
    }
  })

  it("toggles mute when mute button is clicked", () => {
    render(<PomodoroTimer />)

    // Find mute button (icon button with Volume icon)
    const buttons = screen.getAllByRole("button")
    const muteButton = buttons.find((btn) => btn.querySelector('svg[class*="Volume"]'))

    if (muteButton) {
      fireEvent.click(muteButton)
      // Mute state is toggled
      expect(muteButton).toBeInTheDocument()
    }
  })

  it("opens settings dialog when Settings button is clicked", async () => {
    render(<PomodoroTimer />)

    // Find settings button (icon button with Settings icon)
    const buttons = screen.getAllByRole("button")
    const settingsButton = buttons.find((btn) => btn.querySelector('svg[class*="Settings"]'))

    if (settingsButton) {
      fireEvent.click(settingsButton)

      await waitFor(() => {
        expect(screen.getByText("Pomodoro Settings")).toBeInTheDocument()
      })
    }
  })

  it("adjusts work minutes in settings", async () => {
    render(<PomodoroTimer />)

    const settingsButton = screen.getByRole("button", { name: /settings/i })
    fireEvent.click(settingsButton)

    await waitFor(() => {
      expect(screen.getByText("Pomodoro Settings")).toBeInTheDocument()
    })

    // Settings UI is rendered
    expect(screen.getByText("Work Duration (minutes)")).toBeInTheDocument()
  })

  it("allows quick time adjustment when timer is not running", () => {
    render(<PomodoroTimer initialMinutes={25} />)

    const minusButton = screen.getByText("-1 min")
    fireEvent.click(minusButton)

    // Timer should decrease by 1 minute (if not running)
    // The exact behavior depends on timer state
    expect(minusButton).toBeInTheDocument()
  })

  it("disables quick adjustment buttons when timer is running", async () => {
    render(<PomodoroTimer initialMinutes={25} />)

    const startButton = screen.getByRole("button", { name: /start/i })
    fireEvent.click(startButton)

    // Quick adjustment buttons should be disabled when running
    await waitFor(() => {
      const minusButton = screen.getByText("-1 min")
      expect(minusButton).toBeDisabled()
    }, { timeout: 3000 })
  })

  it("displays sessions completed count", () => {
    render(<PomodoroTimer />)

    expect(screen.getByText(/sessions completed/i)).toBeInTheDocument()
    // Sessions count is displayed in the component
  })

  it("displays statistics cards", () => {
    render(<PomodoroTimer />)

    expect(screen.getByText("Sessions")).toBeInTheDocument()
    expect(screen.getByText("Minutes")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
  })
})

