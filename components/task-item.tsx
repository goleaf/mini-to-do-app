"use client"

import type { Task, Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { MetadataBadge } from "@/components/shared/metadata-badge"
import { TaskMetadata } from "@/components/shared/task-metadata"
import { TaskHeader } from "@/components/tasks/task-header"
import { TaskSubtasks } from "@/components/tasks/task-subtasks"
import { isOverdue } from "@/lib/utils/formatting"
import { CheckCircle2, Circle, Trash2, Edit2 } from "lucide-react"

interface TaskItemProps {
  task: Task
  category?: Category
  onComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onTaskUpdate?: (task: Task) => void
  compact?: boolean
}

export function TaskItem({
  task,
  category,
  onComplete,
  onEdit,
  onDelete,
  onTaskUpdate,
  compact,
}: TaskItemProps) {
  const taskIsOverdue = isOverdue(task.dueDate || "", task.isCompleted)

  if (compact) {
    return (
      <div
        className={`p-3 border border-border transition-material hover:shadow-sm hover:border-primary/50 ${
          task.isCompleted ? "opacity-60 bg-muted" : "bg-card hover:bg-card"
        } ${taskIsOverdue ? "border-red-500/50 bg-red-50/50 dark:bg-red-950/30" : ""}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onComplete(task.id)}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            {task.isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            <TaskMetadata task={task} compact />
            {category && <span className="px-2 py-1 bg-muted text-foreground text-xs">{category.name}</span>}
          </div>
          <div className="flex gap-1 flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border border-border bg-card transition-material hover:shadow-md hover:border-primary/50 overflow-hidden ${
        task.isCompleted ? "opacity-70" : ""
      } ${taskIsOverdue ? "border-red-500/50" : ""}`}
    >
      <div className="p-4">
        <TaskHeader
          task={task}
          category={category}
          onComplete={() => onComplete(task.id)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      </div>

      <TaskSubtasks task={task} onTaskUpdate={onTaskUpdate} />
    </div>
  )
}
