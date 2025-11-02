"use server"

import type { Task, Category, Subtask, Reminder } from "./db"

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
  await initializeDefaults()
  return Array.from(taskStore.values())
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  taskStore.set(newTask.id, newTask)
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const task = taskStore.get(id)
  if (!task) return null
  const updated = { ...task, ...updates, updatedAt: new Date().toISOString() }
  taskStore.set(id, updated)
  return updated
}

export async function deleteTask(id: string): Promise<boolean> {
  return taskStore.delete(id)
}

export async function bulkUpdateTasks(updates: { id: string; changes: Partial<Task> }[]): Promise<Task[]> {
  return updates
    .map((item) => {
      const task = taskStore.get(item.id)
      if (!task) return null
      const updated = { ...task, ...item.changes, updatedAt: new Date().toISOString() }
      taskStore.set(item.id, updated)
      return updated
    })
    .filter(Boolean) as Task[]
}

// Subtask CRUD
export async function addSubtask(taskId: string, title: string): Promise<Task | null> {
  const task = taskStore.get(taskId)
  if (!task) return null
  const subtask: Subtask = {
    id: `sub-${Date.now()}`,
    title,
    isCompleted: false,
  }
  if (!task.subtasks) task.subtasks = []
  task.subtasks.push(subtask)
  task.updatedAt = new Date().toISOString()
  taskStore.set(taskId, task)
  return task
}

export async function updateSubtask(taskId: string, subtaskId: string, title: string): Promise<Task | null> {
  const task = taskStore.get(taskId)
  if (!task || !task.subtasks) return null
  const subtask = task.subtasks.find((s) => s.id === subtaskId)
  if (subtask) {
    subtask.title = title
    task.updatedAt = new Date().toISOString()
    taskStore.set(taskId, task)
  }
  return task
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  const task = taskStore.get(taskId)
  if (!task || !task.subtasks) return null
  task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId)
  task.updatedAt = new Date().toISOString()
  taskStore.set(taskId, task)
  return task
}

export async function toggleSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  const task = taskStore.get(taskId)
  if (!task || !task.subtasks) return null
  const subtask = task.subtasks.find((s) => s.id === subtaskId)
  if (subtask) {
    subtask.isCompleted = !subtask.isCompleted
    task.updatedAt = new Date().toISOString()
    taskStore.set(taskId, task)
  }
  return task
}

// Category CRUD
export async function getCategories(): Promise<Category[]> {
  await initializeDefaults()
  return Array.from(categoryStore.values())
}

export async function createCategory(category: Omit<Category, "id" | "createdAt">): Promise<Category> {
  const newCategory: Category = {
    ...category,
    id: `cat-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  categoryStore.set(newCategory.id, newCategory)
  return newCategory
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const category = categoryStore.get(id)
  if (!category) return null
  const updated = { ...category, ...updates }
  categoryStore.set(id, updated)
  return updated
}

export async function deleteCategory(id: string): Promise<boolean> {
  return categoryStore.delete(id)
}

// Reminders
export async function createReminder(reminder: Omit<Reminder, "id" | "createdAt">): Promise<Reminder> {
  const newReminder: Reminder = {
    ...reminder,
    id: `rem-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  reminderStore.set(newReminder.id, newReminder)
  return newReminder
}

export async function deleteReminder(id: string): Promise<boolean> {
  return reminderStore.delete(id)
}

