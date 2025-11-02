"use client"

import type React from "react"

import type { Task, Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

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
  const [status, setStatus] = useState(task?.status || "todo")
  const [categoryId, setCategoryId] = useState(task?.categoryId || "inbox")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [pomodoroEstimate, setPomodoroEstimate] = useState(task?.pomodoroEstimate?.toString() || "0")
  const [estimatedMinutes, setEstimatedMinutes] = useState(task?.estimatedMinutes?.toString() || "")
  const [recurring, setRecurring] = useState(task?.recurring?.type || "none")
  const [expandAdvanced, setExpandAdvanced] = useState(false)
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority: priority as "low" | "normal" | "high",
      status: status as "todo" | "in_progress" | "done",
      categoryId,
      dueDate: dueDate || undefined,
      isCompleted: task?.isCompleted || false,
      pomodoroEstimate: pomodoroEstimate ? Number.parseInt(pomodoroEstimate) : undefined,
      estimatedMinutes: estimatedMinutes ? Number.parseInt(estimatedMinutes) : undefined,
      recurring: recurring !== "none" ? { type: recurring as any } : undefined,
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
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background pb-2 border-b border-border">
        <h2 className="text-lg font-semibold">{task ? "Edit Task" : "Create New Task"}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Task Title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="h-10"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            rows={2}
          />
        </div>
      </div>

      {/* Priority & Status Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9">
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
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category & Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-9">
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

        <div>
          <label className="text-sm font-medium mb-2 block">Due Date</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9" />
        </div>
      </div>

      {/* Subtasks Section */}
      <Card className="p-3 border bg-card">
        <h3 className="text-sm font-semibold mb-3">Subtasks</h3>
        <div className="space-y-2">
          {subtasks.length > 0 && (
            <div className="space-y-2 mb-3 pb-3 border-b border-border">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">•</span>
                  <span className="flex-1">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSubtask()
                }
              }}
              placeholder="Add a subtask..."
              className="h-8 text-sm"
            />
            <Button type="button" onClick={addSubtask} variant="outline" size="sm" className="px-2 bg-transparent">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Options */}
      <button
        type="button"
        onClick={() => setExpandAdvanced(!expandAdvanced)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full p-2 rounded hover:bg-muted"
      >
        {expandAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Advanced Options
      </button>

      {expandAdvanced && (
        <Card className="p-4 space-y-3 border bg-muted/30">
          <div>
            <label className="text-sm font-medium mb-2 block">Pomodoro Estimate</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={pomodoroEstimate}
                onChange={(e) => setPomodoroEstimate(e.target.value)}
                placeholder="0"
                min="0"
                className="h-9"
              />
              <span className="text-xs text-muted-foreground pt-2">25 min each</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Estimated Time (minutes)</label>
            <Input
              type="number"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              placeholder="30"
              min="0"
              className="h-9"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Recurring</label>
            <Select value={recurring} onValueChange={setRecurring}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-2 pt-2 sticky bottom-0 bg-background border-t border-border">
        <Button type="submit" className="flex-1">
          {task ? "Update Task" : "Create Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
