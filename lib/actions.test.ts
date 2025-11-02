import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializeDefaults,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createReminder,
  deleteReminder,
} from './actions'
import type { Task, Category } from './db'

describe('Actions', () => {
  beforeEach(() => {
    // Clear stores before each test
    vi.clearAllMocks()
  })

  describe('initializeDefaults', () => {
    it('should initialize default categories', async () => {
      await initializeDefaults()
      const categories = await getCategories()
      expect(categories.length).toBeGreaterThan(0)
      expect(categories.some((c) => c.id === 'inbox')).toBe(true)
    })

    it('should initialize demo tasks', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      expect(tasks.length).toBeGreaterThan(0)
    })
  })

  describe('Task CRUD Operations', () => {
    it('should get all tasks', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      expect(Array.isArray(tasks)).toBe(true)
    })

    it('should create a new task', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'Test description',
        priority: 'high' as const,
        status: 'todo' as const,
        categoryId: 'work',
        isCompleted: false,
      }

      const created = await createTask(newTask)
      expect(created.id).toBeDefined()
      expect(created.title).toBe(newTask.title)
      expect(created.createdAt).toBeDefined()
      expect(created.updatedAt).toBeDefined()
    })

    it('should update an existing task', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      const firstTask = tasks[0]

      const updated = await updateTask(firstTask.id, { title: 'Updated Title' })
      expect(updated).not.toBeNull()
      expect(updated?.title).toBe('Updated Title')
      expect(updated?.updatedAt).not.toBe(firstTask.updatedAt)
    })

    it('should throw error when updating non-existent task', async () => {
      await expect(updateTask('non-existent-id', { title: 'Updated' })).rejects.toThrow('Task with id non-existent-id not found')
    })

    it('should delete a task', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      const firstTask = tasks[0]

      const deleted = await deleteTask(firstTask.id)
      expect(deleted).toBe(true)

      const updatedTasks = await getTasks()
      expect(updatedTasks.find((t) => t.id === firstTask.id)).toBeUndefined()
    })

    it('should throw error when deleting non-existent task', async () => {
      await expect(deleteTask('non-existent-id')).rejects.toThrow('Task with id non-existent-id not found')
    })

    it('should bulk update tasks', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      const updates = [
        { id: tasks[0].id, changes: { title: 'Updated 1' } },
        { id: tasks[1]?.id || 'non-existent', changes: { title: 'Updated 2' } },
      ]

      const updated = await bulkUpdateTasks(updates)
      expect(updated.length).toBeGreaterThan(0)
      expect(updated[0].title).toBe('Updated 1')
    })
  })

  describe('Subtask Operations', () => {
    let taskId: string

    beforeEach(async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      taskId = tasks[0].id
    })

    it('should add a subtask to a task', async () => {
      const updated = await addSubtask(taskId, 'New Subtask')
      expect(updated).not.toBeNull()
      expect(updated?.subtasks?.some((s) => s.title === 'New Subtask')).toBe(true)
    })

    it('should return null when adding subtask to non-existent task', async () => {
      const updated = await addSubtask('non-existent-id', 'New Subtask')
      expect(updated).toBeNull()
    })

    it('should update a subtask', async () => {
      const taskWithSubtask = await addSubtask(taskId, 'Original Subtask')
      const subtaskId = taskWithSubtask?.subtasks?.[0].id

      if (subtaskId) {
        const updated = await updateSubtask(taskId, subtaskId, 'Updated Subtask')
        expect(updated).not.toBeNull()
        expect(updated?.subtasks?.find((s) => s.id === subtaskId)?.title).toBe('Updated Subtask')
      }
    })

    it('should delete a subtask', async () => {
      const taskWithSubtask = await addSubtask(taskId, 'Subtask to Delete')
      const subtaskId = taskWithSubtask?.subtasks?.[0].id

      if (subtaskId) {
        const updated = await deleteSubtask(taskId, subtaskId)
        expect(updated).not.toBeNull()
        expect(updated?.subtasks?.find((s) => s.id === subtaskId)).toBeUndefined()
      }
    })

    it('should toggle subtask completion', async () => {
      const taskWithSubtask = await addSubtask(taskId, 'Subtask to Toggle')
      const subtaskId = taskWithSubtask?.subtasks?.[0].id

      if (subtaskId) {
        const initialCompleted = taskWithSubtask.subtasks?.find((s) => s.id === subtaskId)?.isCompleted
        const updated = await toggleSubtask(taskId, subtaskId)
        expect(updated).not.toBeNull()
        const toggledCompleted = updated?.subtasks?.find((s) => s.id === subtaskId)?.isCompleted
        expect(toggledCompleted).toBe(!initialCompleted)
      }
    })
  })

  describe('Category Operations', () => {
    it('should get all categories', async () => {
      await initializeDefaults()
      const categories = await getCategories()
      expect(Array.isArray(categories)).toBe(true)
    })

    it('should create a new category', async () => {
      const newCategory = {
        name: 'New Category',
        color: '#ff0000',
        icon: 'star',
      }

      const created = await createCategory(newCategory)
      expect(created.id).toBeDefined()
      expect(created.name).toBe(newCategory.name)
      expect(created.createdAt).toBeDefined()
    })

    it('should update an existing category', async () => {
      await initializeDefaults()
      const categories = await getCategories()
      const firstCategory = categories[0]

      const updated = await updateCategory(firstCategory.id, { name: 'Updated Category' })
      expect(updated).not.toBeNull()
      expect(updated?.name).toBe('Updated Category')
    })

    it('should throw error when updating non-existent category', async () => {
      await expect(updateCategory('non-existent-id', { name: 'Updated' })).rejects.toThrow('Category with id non-existent-id not found')
    })

    it('should delete a category', async () => {
      await initializeDefaults()
      const categories = await getCategories()
      const firstCategory = categories[0]

      const deleted = await deleteCategory(firstCategory.id)
      expect(deleted).toBe(true)

      const updatedCategories = await getCategories()
      expect(updatedCategories.find((c) => c.id === firstCategory.id)).toBeUndefined()
    })
  })

  describe('Reminder Operations', () => {
    it('should create a reminder', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      const taskId = tasks[0].id

      const reminder = await createReminder({
        taskId,
        reminderTime: new Date().toISOString(),
        reminderType: '10min',
      })

      expect(reminder.id).toBeDefined()
      expect(reminder.taskId).toBe(taskId)
      expect(reminder.createdAt).toBeDefined()
    })

    it('should delete a reminder', async () => {
      await initializeDefaults()
      const tasks = await getTasks()
      const taskId = tasks[0].id

      const reminder = await createReminder({
        taskId,
        reminderTime: new Date().toISOString(),
        reminderType: '1h',
      })

      const deleted = await deleteReminder(reminder.id)
      expect(deleted).toBe(true)
    })

    it('should throw error when deleting non-existent reminder', async () => {
      await expect(deleteReminder('non-existent-id')).rejects.toThrow('Reminder with id non-existent-id not found')
    })
  })
})

