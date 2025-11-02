"use client"

import { useState } from "react"
import type { Task, Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

interface TaskFormProps {
  task?: Task
  categories: Category[]
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function TaskForm({ task, categories, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState(task?.priority || "normal")
  const [categoryId, setCategoryId] = useState(task?.categoryId || "inbox")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority: priority as "low" | "normal" | "high",
      status: task?.status || "todo",
      categoryId,
      dueDate: dueDate || undefined,
      isCompleted: task?.isCompleted || false,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    })
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        isCompleted: false,
      },
    ])
    setNewSubtaskTitle("")
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
            className="h-12 text-lg"
          />
        </div>

        <div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Due Date</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {subtasks.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground block">Subtasks</label>
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 p-2 bg-muted/50">
                <span className="flex-1 text-sm">{subtask.title}</span>
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addSubtask()
            }
          }}
          placeholder="Add subtask..."
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addSubtask}
          variant="outline"
          size="icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" className="flex-1">
          {task ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
