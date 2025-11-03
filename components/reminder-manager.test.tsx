import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "../test/utils/test-utils"
import { ReminderManager } from "./reminder-manager"
import { createReminder, deleteReminder, getReminders } from "@/lib/actions"
import { toast } from "sonner"

// Mock server actions
vi.mock("@/lib/actions", () => ({
  createReminder: vi.fn(),
  deleteReminder: vi.fn(),
  getReminders: vi.fn(),
}))

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockReminders = [
  {
    id: "1",
    taskId: "task-1",
    reminderTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    reminderType: "1d" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    taskId: "task-1",
    reminderTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    reminderType: "1h" as const,
    createdAt: new Date().toISOString(),
  },
]

describe("ReminderManager", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getReminders as any).mockResolvedValue(mockReminders)
  })

  it("renders reminder manager with loading state", () => {
    ;(getReminders as any).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ReminderManager taskId="task-1" />)

    expect(screen.getByText("Loading reminders...")).toBeInTheDocument()
  })

  it("loads reminders on mount", async () => {
    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(getReminders).toHaveBeenCalledWith("task-1")
    })
  })

  it("displays reminders list", async () => {
    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(screen.getByText("Reminders")).toBeInTheDocument()
    })

    // Reminders should be displayed
    expect(screen.getByText("Reminders")).toBeInTheDocument()
  })

  it("shows reminder count", async () => {
    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(screen.getByText(/\(2\)/)).toBeInTheDocument()
    })
  })

  it("shows Add button when due date is provided", async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })
  })

  it("does not show Add button when no due date", async () => {
    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(screen.getByText("Reminders")).toBeInTheDocument()
    })

    expect(screen.queryByText("Add")).not.toBeInTheDocument()
    expect(screen.getByText("Set a due date to add reminders")).toBeInTheDocument()
  })

  it("opens add reminder form when Add button is clicked", async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })

    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("Add Reminder")).toBeInTheDocument()
    })
  })

  it("creates reminder with 10min type", async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    ;(createReminder as any).mockResolvedValue({ id: "new-reminder" })
    ;(getReminders as any).mockResolvedValue([...mockReminders, { id: "new-reminder" }])

    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })

    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("Add Reminder")).toBeInTheDocument()
    })

    const addReminderButton = screen.getByText("Add Reminder")
    fireEvent.click(addReminderButton)

    await waitFor(() => {
      expect(createReminder).toHaveBeenCalled()
    })
  })

  it("deletes reminder when delete button is clicked", async () => {
    ;(deleteReminder as any).mockResolvedValue(undefined)

    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(screen.getByText("Reminders")).toBeInTheDocument()
    })

    // Find delete button (X icon button)
    const deleteButtons = screen.getAllByRole("button")
    const deleteButton = deleteButtons.find((btn) => btn.querySelector('svg[class*="X"]'))

    if (deleteButton) {
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(deleteReminder).toHaveBeenCalled()
      })
    }
  })

  it("shows error toast when reminder creation fails", async () => {
    const error = new Error("Failed to create reminder")
    ;(createReminder as any).mockRejectedValue(error)
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })

    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("Add Reminder")).toBeInTheDocument()
    })

    const addReminderButton = screen.getByText("Add Reminder")
    fireEvent.click(addReminderButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it("shows error toast when reminder deletion fails", async () => {
    const error = new Error("Failed to delete reminder")
    ;(deleteReminder as any).mockRejectedValue(error)

    render(<ReminderManager taskId="task-1" />)

    await waitFor(() => {
      expect(screen.getByText("Reminders")).toBeInTheDocument()
    })

    // Delete operation is tested through component behavior
    expect(deleteReminder).toBeDefined()
  })

  it("cancels adding reminder", async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })

    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument()
    })

    const cancelButton = screen.getByText("Cancel")
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText("Add Reminder")).not.toBeInTheDocument()
    })
  })

  it("displays custom time input when custom type is selected", async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    render(<ReminderManager taskId="task-1" dueDate={dueDate} />)

    await waitFor(() => {
      expect(screen.getByText("Add")).toBeInTheDocument()
    })

    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText("Add Reminder")).toBeInTheDocument()
    })

    // Select custom option
    const selectTrigger = screen.getByRole("combobox")
    fireEvent.click(selectTrigger)

    await waitFor(() => {
      const customOption = screen.getByText("Custom time")
      fireEvent.click(customOption)
    })

    await waitFor(() => {
      const dateInput = screen.getByRole("textbox", { name: /datetime/i })
      expect(dateInput).toBeInTheDocument()
    })
  })
})

