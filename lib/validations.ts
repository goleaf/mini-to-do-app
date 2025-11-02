import { z } from "zod"

// Task validation schemas
export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Subtask title is required"),
  isCompleted: z.boolean(),
})

export const recurringConfigSchema = z.object({
  type: z.enum(["daily", "weekly", "custom"]),
  interval: z.number().optional(),
  endDate: z.string().optional(),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200, "Task title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  priority: z.enum(["low", "normal", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
  isCompleted: z.boolean(),
  subtasks: z.array(subtaskSchema).optional(),
  recurring: recurringConfigSchema.optional(),
  attachments: z.array(z.string()).optional(),
  pomodoroEstimate: z.number().min(0).optional(),
  pomodoroCompleted: z.number().min(0).optional(),
  estimatedMinutes: z.number().min(0).optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  title: z.string().min(1, "Task title is required").max(200, "Task title is too long").optional(),
})

export const taskIdSchema = z.string().min(1, "Task ID is required")

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name is too long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  icon: z.string().min(1, "Icon is required"),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryIdSchema = z.string().min(1, "Category ID is required")

// Subtask validation schemas
export const addSubtaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  title: z.string().min(1, "Subtask title is required").max(200, "Subtask title is too long"),
})

export const updateSubtaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  subtaskId: z.string().min(1, "Subtask ID is required"),
  title: z.string().min(1, "Subtask title is required").max(200, "Subtask title is too long"),
})

export const deleteSubtaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  subtaskId: z.string().min(1, "Subtask ID is required"),
})

export const toggleSubtaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  subtaskId: z.string().min(1, "Subtask ID is required"),
})

// Reminder validation schemas
export const createReminderSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  reminderTime: z.string().min(1, "Reminder time is required"),
  reminderType: z.enum(["10min", "1h", "1d"]),
})

export const reminderIdSchema = z.string().min(1, "Reminder ID is required")

