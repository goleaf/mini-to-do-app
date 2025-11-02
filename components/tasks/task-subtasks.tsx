"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Plus, X, ChevronDown, CheckSquare } from "lucide-react"
import { addSubtask, deleteSubtask, toggleSubtask } from "@/lib/actions"

interface TaskSubtasksProps {
  task: Task
  onTaskUpdate?: (task: Task) => void
}

export function TaskSubtasks({ task, onTaskUpdate }: TaskSubtasksProps) {
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [localTask, setLocalTask] = useState(task)

  useEffect(() => {
    setLocalTask(task)
  }, [task])

  const completedSubtasks = localTask.subtasks?.filter((s) => s.isCompleted).length || 0
  const totalSubtasks = localTask.subtasks?.length || 0
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

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

  if (!task.subtasks || task.subtasks.length === 0) {
    return null
  }

  return (
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
              className="flex items-center gap-2 p-2 hover:bg-muted transition-colors group/subtask"
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
            <div className="flex items-center gap-2 p-2 bg-card border border-border">
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

          <div className="mt-3 h-1 bg-muted overflow-hidden">
            <div className="h-1 bg-primary transition-all" style={{ width: `${subtaskPercentage}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

