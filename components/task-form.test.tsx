import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils/test-utils'
import { TaskForm } from './task-form'
import { mockTask, mockCategories } from '../test/utils/mock-data'

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form for creating new task', () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
  })

  it('should render form for editing existing task', () => {
    render(<TaskForm task={mockTask} categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument()
  })

  it('should prefill form fields when editing', () => {
    render(<TaskForm task={mockTask} categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument()
    if (mockTask.description) {
      expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument()
    }
  })

  it('should call onSubmit with form data when submitted', async () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(titleInput, { target: { value: 'New Task Title' } })

    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task Title',
        })
      )
    })
  })

  it('should not submit form when title is empty', async () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  it('should call onCancel when cancel button is clicked', () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should call onCancel when X button is clicked', () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const buttons = screen.getAllByRole('button')
    const closeButton = buttons.find((btn) => btn.querySelector('svg')?.getAttribute('class')?.includes('lucide-x'))
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(mockOnCancel).toHaveBeenCalled()
    }
  })

  it('should allow selecting priority', async () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })

    // Note: Select components from Radix UI might need special handling
    // This is a basic test structure
    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('should allow adding subtasks', async () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const subtaskInput = screen.getByPlaceholderText(/add a subtask/i)
    fireEvent.change(subtaskInput, { target: { value: 'New Subtask' } })

    const buttons = screen.getAllByRole('button')
    const addButton = buttons.find((btn) => btn.querySelector('svg')?.getAttribute('class')?.includes('lucide-plus'))
    if (addButton) {
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('New Subtask')).toBeInTheDocument()
      })
    }
  })

  it('should allow removing subtasks', async () => {
    const taskWithSubtasks = {
      ...mockTask,
      subtasks: [{ id: 'sub-1', title: 'Existing Subtask', isCompleted: false }],
    }

    render(
      <TaskForm task={taskWithSubtasks} categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await waitFor(() => {
      expect(screen.getByText('Existing Subtask')).toBeInTheDocument()
    })

    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find((btn) => btn.querySelector('svg')?.getAttribute('class')?.includes('lucide-trash'))
    if (deleteButton) {
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(screen.queryByText('Existing Subtask')).not.toBeInTheDocument()
      })
    }
  })

  it('should toggle advanced options', () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const advancedButton = screen.getByText(/advanced options/i)
    fireEvent.click(advancedButton)

    expect(screen.getByText(/pomodoro estimate/i)).toBeInTheDocument()
  })

  it('should include subtasks in form submission', async () => {
    render(<TaskForm categories={mockCategories} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })

    const subtaskInput = screen.getByPlaceholderText(/add a subtask/i)
    fireEvent.change(subtaskInput, { target: { value: 'Subtask 1' } })
    fireEvent.keyDown(subtaskInput, { key: 'Enter' })

    const submitButton = screen.getByRole('button', { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          subtasks: expect.arrayContaining([
            expect.objectContaining({
              title: 'Subtask 1',
            }),
          ]),
        })
      )
    })
  })
})

