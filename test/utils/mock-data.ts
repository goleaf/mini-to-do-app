import type { Task, Category, Subtask } from '@/lib/db'

export const mockCategory: Category = {
  id: 'test-category',
  name: 'Test Category',
  color: '#3b82f6',
  icon: 'test',
  createdAt: new Date().toISOString(),
}

export const mockSubtask: Subtask = {
  id: 'sub-1',
  title: 'Test subtask',
  isCompleted: false,
}

export const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  priority: 'normal',
  status: 'todo',
  categoryId: 'test-category',
  isCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockTaskWithSubtasks: Task = {
  ...mockTask,
  id: 'task-2',
  subtasks: [
    { id: 'sub-1', title: 'Subtask 1', isCompleted: false },
    { id: 'sub-2', title: 'Subtask 2', isCompleted: true },
  ],
}

export const mockTaskInProgress: Task = {
  ...mockTask,
  id: 'task-3',
  status: 'in_progress',
}

export const mockTaskCompleted: Task = {
  ...mockTask,
  id: 'task-4',
  status: 'done',
  isCompleted: true,
}

export const mockTaskHighPriority: Task = {
  ...mockTask,
  id: 'task-5',
  priority: 'high',
}

export const mockTaskOverdue: Task = {
  ...mockTask,
  id: 'task-6',
  dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  isCompleted: false,
}

export const mockCategories: Category[] = [
  mockCategory,
  {
    id: 'work',
    name: 'Work',
    color: '#ef4444',
    icon: 'briefcase',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10b981',
    icon: 'user',
    createdAt: new Date().toISOString(),
  },
]

export const mockTasks: Task[] = [
  mockTask,
  mockTaskWithSubtasks,
  mockTaskInProgress,
  mockTaskCompleted,
  mockTaskHighPriority,
  mockTaskOverdue,
]

