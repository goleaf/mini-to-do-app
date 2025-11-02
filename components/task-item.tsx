"use client"

import type { Task, Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { MetadataBadge } from "@/components/shared/metadata-badge"
import { TaskMetadata } from "@/components/shared/task-metadata"
import { isOverdue, formatStatus } from "@/lib/utils/formatting"
import { CheckCircle2, Circle, Trash2, Edit2, RotateCw, CheckSquare, Plus, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { addSubtask, deleteSubtask, toggleSubtask } from "@/lib/actions"

interface TaskItemProps {
  task: Task
  category?: Category
  onComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleSubtask?: (taskId: string, subtaskId: string) => void
  onTaskUpdate?: (task: Task) => void
  compact?: boolean
}

export function TaskItem({
  task,
  category,
  onComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
  onTaskUpdate,
  compact,
}: TaskItemProps) {
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [localTask, setLocalTask] = useState(task)

  const completedSubtasks = localTask.subtasks?.filter((s) => s.isCompleted).length || 0
  const totalSubtasks = localTask.subtasks?.length || 0
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  const taskIsOverdue = isOverdue(localTask.dueDate || "", localTask.isCompleted)

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return
    const updated = await addSubtask(localTask.id, newSubtaskTitle)
    if (updated) {
      setLocalTask(updated)
      onTaskUpdate?.(updated)
      setNewSubtaskTitle("")
      setAddingSubtask(false)
    }
  }

  const handleDeleteSubtask = async (subtaskId: string) => {
    const updated = await deleteSubtask(localTask.id, subtaskId)
    if (updated) {
      setLocalTask(updated)
      onTaskUpdate?.(updated)
    }
  }

  const handleToggleSubtask = async (subtaskId: string) => {
    const updated = await toggleSubtask(localTask.id, subtaskId)
    if (updated) {
      setLocalTask(updated)
      onTaskUpdate?.(updated)
    }
  }

  if (compact) {
    return (
      <div
        className={`p-3 rounded-lg border border-border transition-material hover:shadow-sm hover:border-primary/50 ${
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
            {category && <span className="px-2 py-1 rounded-md bg-muted text-foreground text-xs">{category.name}</span>}
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
      className={`rounded-lg border border-border bg-card transition-material hover:shadow-md hover:border-primary/50 overflow-hidden ${
        task.isCompleted ? "opacity-70" : ""
      } ${taskIsOverdue ? "border-red-500/50" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onComplete(task.id)}
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
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-t border-border px-4 py-3 bg-muted/30">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="text-xs font-medium text-foreground flex items-center gap-2 transition-colors hover:text-primary"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showSubtasks ? "" : "-rotate-90"}`} />
            <CheckSquare className="w-4 h-4" />
            <span>
              {completedSubtasks}/{totalSubtasks} Subtasks
            </span>
          </button>

          {showSubtasks && (
            <div className="mt-3 space-y-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors group/subtask"
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {subtask.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 ${subtask.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="opacity-0 group-hover/subtask:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {addingSubtask && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-card border border-border">
                  <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubtask()
                      if (e.key === "Escape") {
                        setAddingSubtask(false)
                        setNewSubtaskTitle("")
                      }
                    }}
                    placeholder="New subtask..."
                    autoFocus
                    className="h-8 text-sm bg-background border border-border"
                  />
                </div>
              )}

              {!addingSubtask && (
                <button
                  onClick={() => setAddingSubtask(true)}
                  className="text-xs text-muted-foreground hover:text-primary font-medium flex items-center gap-1 transition-colors mt-2"
                >
                  <Plus className="w-3 h-3" /> Add subtask
                </button>
              )}

              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-1 bg-primary transition-all" style={{ width: `${subtaskPercentage}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
