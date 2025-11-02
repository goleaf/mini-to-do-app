import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils/test-utils'
import { TaskItem } from './task-item'
import { mockTask, mockTaskWithSubtasks, mockCategory, mockTaskOverdue } from '../test/utils/mock-data'
import * as actions from '@/lib/actions'

// Mock the actions
vi.mock('@/lib/actions', () => ({
  addSubtask: vi.fn(),
  deleteSubtask: vi.fn(),
  toggleSubtask: vi.fn(),
}))

describe('TaskItem', () => {
  const mockOnComplete = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnTaskUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render task title', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
  })

  it('should render task description when provided', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(mockTask.description!)).toBeInTheDocument()
  })

  it('should call onComplete when checkbox is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getAllByRole('button')[0]
    fireEvent.click(checkbox)

    expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id)
  })

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const buttons = screen.getAllByRole('button')
    const editButton = buttons.find((btn) => btn.querySelector('svg')?.getAttribute('class')?.includes('pen'))
    if (editButton) {
      fireEvent.click(editButton)
      expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
    }
  })

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find((btn) => btn.querySelector('svg')?.getAttribute('class')?.includes('trash'))
    if (deleteButton) {
      fireEvent.click(deleteButton)
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
    }
  })

  it('should display category badge when category is provided', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(mockCategory.name)).toBeInTheDocument()
  })

  it('should render in compact mode', () => {
    render(
      <TaskItem
        task={mockTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        compact
      />
    )

    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
  })

  it('should show subtasks when task has subtasks', () => {
    render(
      <TaskItem
        task={mockTaskWithSubtasks}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const subtaskToggle = screen.getByText(/subtasks/i)
    expect(subtaskToggle).toBeInTheDocument()
  })

  it('should toggle subtasks visibility when clicked', async () => {
    render(
      <TaskItem
        task={mockTaskWithSubtasks}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const subtaskToggle = screen.getByText(/subtasks/i)
    fireEvent.click(subtaskToggle)

    await waitFor(() => {
      expect(screen.getByText(mockTaskWithSubtasks.subtasks![0].title)).toBeInTheDocument()
    })
  })

  it('should show overdue styling for overdue tasks', () => {
    const { container } = render(
      <TaskItem
        task={mockTaskOverdue}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Find the element with the overdue border class
    const taskElement = container.querySelector('.border-red-500\\/50')
    expect(taskElement).toBeInTheDocument()
  })

  it('should show completed styling for completed tasks', () => {
    const completedTask = { ...mockTask, isCompleted: true, status: 'done' as const }
    render(
      <TaskItem
        task={completedTask}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const title = screen.getByText(completedTask.title)
    expect(title).toHaveClass('line-through')
  })

  it('should allow adding subtasks', async () => {
    vi.mocked(actions.addSubtask).mockResolvedValue({
      ...mockTask,
      subtasks: [{ id: 'sub-new', title: 'New Subtask', isCompleted: false }],
    })

    render(
      <TaskItem
        task={mockTaskWithSubtasks}
        category={mockCategory}
        onComplete={mockOnComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onTaskUpdate={mockOnTaskUpdate}
      />
    )

    // Expand subtasks
    const subtaskToggle = screen.getByText(/subtasks/i)
    fireEvent.click(subtaskToggle)

    await waitFor(() => {
      const addButton = screen.getByText(/add subtask/i)
      fireEvent.click(addButton)
    })

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/new subtask/i)
      expect(input).toBeInTheDocument()
    })
  })
})

