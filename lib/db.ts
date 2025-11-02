// Simple in-memory database for this app
interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: "low" | "normal" | "high"
  status: "todo" | "in_progress" | "done"
  categoryId?: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  subtasks?: Subtask[]
  recurring?: RecurringConfig
  attachments?: string[]
  pomodoroEstimate?: number
  pomodoroCompleted?: number
  estimatedMinutes?: number
}

interface Subtask {
  id: string
  title: string
  isCompleted: boolean
}

interface RecurringConfig {
  type: "daily" | "weekly" | "custom"
  interval?: number
  endDate?: string
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  createdAt: string
}

interface Reminder {
  id: string
  taskId: string
  reminderTime: string
  reminderType: "10min" | "1h" | "1d"
  createdAt: string
}

// Initialize with localStorage-based store
const TASKS_KEY = "tasks"
const CATEGORIES_KEY = "categories"
const REMINDERS_KEY = "reminders"

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "inbox", name: "Inbox", color: "#3b82f6", icon: "📥", createdAt: new Date().toISOString() },
  { id: "work", name: "Work", color: "#ef4444", icon: "💼", createdAt: new Date().toISOString() },
  { id: "personal", name: "Personal", color: "#10b981", icon: "👤", createdAt: new Date().toISOString() },
  { id: "shopping", name: "Shopping", color: "#f59e0b", icon: "🛍️", createdAt: new Date().toISOString() },
]

export function getTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(TASKS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function getCategoriesFromStorage(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES
  const stored = localStorage.getItem(CATEGORIES_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
}

export function saveCategoriesFromStorage(categories: Category[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export type { Task, Category, Reminder, Subtask, RecurringConfig }
