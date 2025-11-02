"use client"

import type { Task, Category } from "@/lib/db"
import { TaskItem } from "@/components/task-item"

interface TaskListProps {
  tasks: Task[]
  categories: Category[]
  onComplete: (taskId: string) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
  onTaskUpdate?: (task: Task) => void
  groupByStatus?: boolean
  statusLabels?: Record<string, string>
}

const DEFAULT_STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

export function TaskList({
  tasks,
  categories,
  onComplete,
  onEdit,
  onDelete,
  onTaskUpdate,
  groupByStatus = false,
  statusLabels = DEFAULT_STATUS_LABELS,
}: TaskListProps) {
  const getCategoryById = (id?: string) => categories.find((c) => c.id === id)

  if (tasks.length === 0) {
    return null
  }

  if (groupByStatus) {
    const groupedTasks = {
      todo: tasks.filter((t) => t.status === "todo"),
      in_progress: tasks.filter((t) => t.status === "in_progress"),
      done: tasks.filter((t) => t.status === "done"),
    }

    return (
      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([status, groupTasks]) =>
          groupTasks.length > 0 ? (
            <div key={status} className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {statusLabels[status] || status.replace("_", " ")} • {groupTasks.length}
              </h3>
              <div className="space-y-2">
                {groupTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onComplete={async () => onComplete(task.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTaskUpdate={onTaskUpdate}
                    compact={false}
                  />
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          category={getCategoryById(task.categoryId)}
          onComplete={async () => onComplete(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onTaskUpdate={onTaskUpdate}
          compact={false}
        />
      ))}
    </div>
  )
}

