"use server"

import { z } from "zod"
import type { Task, Category, Subtask, Reminder } from "./db"
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  addSubtaskSchema,
  updateSubtaskSchema,
  deleteSubtaskSchema,
  toggleSubtaskSchema,
  createReminderSchema,
  reminderIdSchema,
} from "./validations"

const taskStore: Map<string, Task> = new Map()
const categoryStore: Map<string, Category> = new Map()
const reminderStore: Map<string, Reminder> = new Map()

export async function initializeDefaults() {
  if (categoryStore.size === 0) {
    const defaults: Category[] = [
      { id: "inbox", name: "Inbox", color: "#0891b2", icon: "inbox", createdAt: new Date().toISOString() },
      { id: "work", name: "Work", color: "#f97316", icon: "briefcase", createdAt: new Date().toISOString() },
      { id: "personal", name: "Personal", color: "#06b6d4", icon: "user", createdAt: new Date().toISOString() },
      { id: "shopping", name: "Shopping", color: "#84cc16", icon: "shopping-bag", createdAt: new Date().toISOString() },
    ]
    defaults.forEach((cat) => categoryStore.set(cat.id, cat))
  }

  if (taskStore.size === 0) {
    const demoTasks: Task[] = [
      {
        id: "task-1",
        title: "Complete project proposal",
        description: "Finish the Q4 product roadmap proposal for stakeholders",
        priority: "high",
        status: "in_progress",
        categoryId: "work",
        isCompleted: false,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pomodoroEstimate: 4,
        pomodoroCompleted: 1,
        subtasks: [
          { id: "sub-1", title: "Research market trends", isCompleted: true },
          { id: "sub-2", title: "Create timeline", isCompleted: false },
          { id: "sub-3", title: "Design wireframes", isCompleted: false },
        ],
        recurring: { type: "weekly" },
      },
      {
        id: "task-2",
        title: "Grocery shopping",
        description: "Milk, eggs, bread, and vegetables",
        priority: "normal",
        status: "todo",
        categoryId: "shopping",
        isCompleted: false,
        dueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: ["grocery-list.txt"],
      },
      {
        id: "task-3",
        title: "Fix homepage bugs",
        description: "Address responsive design issues on mobile",
        priority: "high",
        status: "todo",
        categoryId: "work",
        isCompleted: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pomodoroEstimate: 3,
        pomodoroCompleted: 0,
        subtasks: [
          { id: "sub-4", title: "Test on iPhone", isCompleted: false },
          { id: "sub-5", title: "Fix navbar layout", isCompleted: false },
          { id: "sub-6", title: "Verify on Android", isCompleted: false },
        ],
      },
      {
        id: "task-4",
        title: "Review code from teammates",
        description: "PR reviews for authentication module",
        priority: "normal",
        status: "todo",
        categoryId: "work",
        isCompleted: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedMinutes: 45,
      },
      {
        id: "task-5",
        title: "Plan weekend trip",
        description: "Research destinations and book accommodation",
        priority: "low",
        status: "todo",
        categoryId: "personal",
        isCompleted: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [
          { id: "sub-7", title: "Look up hotels", isCompleted: false },
          { id: "sub-8", title: "Check flights", isCompleted: false },
          { id: "sub-9", title: "Book reservations", isCompleted: false },
        ],
      },
      {
        id: "task-6",
        title: "Call dentist for appointment",
        description: "Schedule cleaning and checkup",
        priority: "normal",
        status: "done",
        categoryId: "personal",
        isCompleted: true,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "task-7",
        title: "Update documentation",
        description: "Add API endpoint documentation for new features",
        priority: "normal",
        status: "in_progress",
        categoryId: "work",
        isCompleted: false,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recurring: { type: "daily" },
      },
      {
        id: "task-8",
        title: "Exercise",
        description: "30 min run or gym session",
        priority: "high",
        status: "todo",
        categoryId: "personal",
        isCompleted: false,
        dueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recurring: { type: "daily" },
        pomodoroEstimate: 1,
      },
    ]
    demoTasks.forEach((task) => taskStore.set(task.id, task))
  }
}

// Task CRUD Operations
export async function getTasks(): Promise<Task[]> {
  try {
    await initializeDefaults()
    return Array.from(taskStore.values())
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  try {
    // Validate input
    const validated = createTaskSchema.parse(task)

    const newTask: Task = {
      ...validated,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    taskStore.set(newTask.id, newTask)
    return newTask
  } catch (error) {
    console.error("Error creating task:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to create task")
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  try {
    // Validate IDs and updates
    taskIdSchema.parse(id)
    const validated = updateTaskSchema.parse(updates)

    const task = taskStore.get(id)
    if (!task) {
      throw new Error(`Task with id ${id} not found`)
    }
    const updated = { ...task, ...validated, updatedAt: new Date().toISOString() }
    taskStore.set(id, updated)
    return updated
  } catch (error) {
    console.error("Error updating task:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to update task")
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    taskIdSchema.parse(id)
    const deleted = taskStore.delete(id)
    if (!deleted) {
      throw new Error(`Task with id ${id} not found`)
    }
    return deleted
  } catch (error) {
    console.error("Error deleting task:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to delete task")
  }
}

export async function bulkUpdateTasks(updates: { id: string; changes: Partial<Task> }[]): Promise<Task[]> {
  try {
    const results = updates
      .map((item) => {
        taskIdSchema.parse(item.id)
        if (Object.keys(item.changes).length > 0) {
          const validated = updateTaskSchema.parse(item.changes)
          const task = taskStore.get(item.id)
          if (!task) return null
          const updated = { ...task, ...validated, updatedAt: new Date().toISOString() }
          taskStore.set(item.id, updated)
          return updated
        }
        return null
      })
      .filter(Boolean) as Task[]
    return results
  } catch (error) {
    console.error("Error in bulk update:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to bulk update tasks")
  }
}

// Subtask CRUD
export async function addSubtask(taskId: string, title: string): Promise<Task | null> {
  try {
    const validated = addSubtaskSchema.parse({ taskId, title })
    const task = taskStore.get(validated.taskId)
    if (!task) return null
    const subtask: Subtask = {
      id: `sub-${Date.now()}`,
      title: validated.title,
      isCompleted: false,
    }
    if (!task.subtasks) task.subtasks = []
    task.subtasks.push(subtask)
    task.updatedAt = new Date().toISOString()
    taskStore.set(taskId, task)
    return task
  } catch (error) {
    console.error("Error adding subtask:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to add subtask")
  }
}

export async function updateSubtask(taskId: string, subtaskId: string, title: string): Promise<Task | null> {
  try {
    const validated = updateSubtaskSchema.parse({ taskId, subtaskId, title })
    const task = taskStore.get(validated.taskId)
    if (!task || !task.subtasks) return null
    const subtask = task.subtasks.find((s) => s.id === validated.subtaskId)
    if (subtask) {
      subtask.title = validated.title
      task.updatedAt = new Date().toISOString()
      taskStore.set(taskId, task)
    }
    return task
  } catch (error) {
    console.error("Error updating subtask:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to update subtask")
  }
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  try {
    const validated = deleteSubtaskSchema.parse({ taskId, subtaskId })
    const task = taskStore.get(validated.taskId)
    if (!task || !task.subtasks) return null
    task.subtasks = task.subtasks.filter((s) => s.id !== validated.subtaskId)
    task.updatedAt = new Date().toISOString()
    taskStore.set(taskId, task)
    return task
  } catch (error) {
    console.error("Error deleting subtask:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to delete subtask")
  }
}

export async function toggleSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  try {
    const validated = toggleSubtaskSchema.parse({ taskId, subtaskId })
    const task = taskStore.get(validated.taskId)
    if (!task || !task.subtasks) return null
    const subtask = task.subtasks.find((s) => s.id === validated.subtaskId)
    if (subtask) {
      subtask.isCompleted = !subtask.isCompleted
      task.updatedAt = new Date().toISOString()
      taskStore.set(taskId, task)
    }
    return task
  } catch (error) {
    console.error("Error toggling subtask:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to toggle subtask")
  }
}

// Category CRUD
export async function getCategories(): Promise<Category[]> {
  try {
    await initializeDefaults()
    return Array.from(categoryStore.values())
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

export async function createCategory(category: Omit<Category, "id" | "createdAt">): Promise<Category> {
  try {
    // Validate input
    const validated = createCategorySchema.parse(category)

    const newCategory: Category = {
      ...validated,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    categoryStore.set(newCategory.id, newCategory)
    return newCategory
  } catch (error) {
    console.error("Error creating category:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to create category")
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    categoryIdSchema.parse(id)
    const validated = updateCategorySchema.parse(updates)

    const category = categoryStore.get(id)
    if (!category) {
      throw new Error(`Category with id ${id} not found`)
    }
    const updated = { ...category, ...validated }
    categoryStore.set(id, updated)
    return updated
  } catch (error) {
    console.error("Error updating category:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to update category")
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    categoryIdSchema.parse(id)
    const deleted = categoryStore.delete(id)
    if (!deleted) {
      throw new Error(`Category with id ${id} not found`)
    }
    return deleted
  } catch (error) {
    console.error("Error deleting category:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to delete category")
  }
}

// Reminders
export async function getReminders(taskId?: string): Promise<Reminder[]> {
  try {
    const allReminders = Array.from(reminderStore.values())
    if (taskId) {
      return allReminders.filter((r) => r.taskId === taskId)
    }
    return allReminders
  } catch (error) {
    console.error("Error fetching reminders:", error)
    throw new Error("Failed to fetch reminders")
  }
}

export async function createReminder(reminder: Omit<Reminder, "id" | "createdAt">): Promise<Reminder> {
  try {
    const validated = createReminderSchema.parse(reminder)
    const newReminder: Reminder = {
      ...validated,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    reminderStore.set(newReminder.id, newReminder)
    return newReminder
  } catch (error) {
    console.error("Error creating reminder:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to create reminder")
  }
}

export async function deleteReminder(id: string): Promise<boolean> {
  try {
    reminderIdSchema.parse(id)
    const deleted = reminderStore.delete(id)
    if (!deleted) {
      throw new Error(`Reminder with id ${id} not found`)
    }
    return deleted
  } catch (error) {
    console.error("Error deleting reminder:", error)
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error instanceof Error ? error : new Error("Failed to delete reminder")
  }
}

