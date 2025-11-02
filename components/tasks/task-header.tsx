"use client"

import type { Task, Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { MetadataBadge } from "@/components/shared/metadata-badge"
import { TaskMetadata } from "@/components/shared/task-metadata"
import { CheckCircle2, Circle, Trash2, Edit2, RotateCw } from "lucide-react"
import { formatStatus } from "@/lib/utils/formatting"

interface TaskHeaderProps {
  task: Task
  category?: Category
  onComplete: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskHeader({ task, category, onComplete, onEdit, onDelete }: TaskHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onComplete}
        className="mt-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      >
        {task.isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 justify-between mb-2">
          <h3
            className={`font-medium leading-snug ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p
            className={`text-sm leading-relaxed mb-3 ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground/80"}`}
          >
            {task.description}
          </p>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {category && <MetadataBadge label={category.name} />}
          {task.priority !== "normal" && (
            <MetadataBadge
              label={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority`}
              variant={task.priority === "high" ? "priority-high" : "priority-low"}
            />
          )}
          {task.status === "in_progress" && <MetadataBadge label="In Progress" variant="status" />}
          {task.recurring && (
            <MetadataBadge label={`${RotateCw} ${formatStatus(task.recurring.type)}`} variant="recurring" />
          )}
        </div>

        <TaskMetadata task={task} />
      </div>
    </div>
  )
}

