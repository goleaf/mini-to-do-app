"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Reminder } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Bell, X, Plus } from "lucide-react"
import { createReminder, deleteReminder, getReminders } from "@/lib/actions"
import { format } from "date-fns"

interface ReminderManagerProps {
  taskId: string
  dueDate?: string
}

export function ReminderManager({ taskId, dueDate }: ReminderManagerProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [reminderType, setReminderType] = useState<"10min" | "1h" | "1d" | "custom">("10min")
  const [customTime, setCustomTime] = useState("")

  useEffect(() => {
    async function loadReminders() {
      try {
        const fetched = await getReminders(taskId)
        setReminders(fetched)
      } catch (error) {
        toast.error("Failed to load reminders")
      } finally {
        setIsLoading(false)
      }
    }
    loadReminders()
  }, [taskId])

  const handleAddReminder = async () => {
    if (!dueDate) {
      toast.error("Task must have a due date to set reminders")
      return
    }

    try {
      const dueDateObj = new Date(dueDate)
      let reminderTime: Date

      if (reminderType === "10min") {
        reminderTime = new Date(dueDateObj.getTime() - 10 * 60 * 1000)
      } else if (reminderType === "1h") {
        reminderTime = new Date(dueDateObj.getTime() - 60 * 60 * 1000)
      } else if (reminderType === "1d") {
        reminderTime = new Date(dueDateObj.getTime() - 24 * 60 * 60 * 1000)
      } else {
        // Custom time - use the datetime-local input value
        if (!customTime) {
          toast.error("Please select a custom reminder time")
          return
        }
        reminderTime = new Date(customTime)
        if (isNaN(reminderTime.getTime())) {
          toast.error("Invalid custom reminder time")
          return
        }
      }

      await createReminder({
        taskId,
        reminderTime: reminderTime.toISOString(),
        reminderType: reminderType === "custom" ? "1d" : reminderType, // Use 1d as fallback for custom
      })
      toast.success("Reminder added successfully")
      setShowAdd(false)
      setCustomTime("")
      // Reload reminders
      const fetched = await getReminders(taskId)
      setReminders(fetched)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create reminder")
    }
  }

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id)
      toast.success("Reminder deleted successfully")
      setReminders(reminders.filter((r) => r.id !== id))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete reminder")
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading reminders...</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Reminders</span>
          {reminders.length > 0 && (
            <span className="text-xs text-muted-foreground">({reminders.length})</span>
          )}
        </div>
        {dueDate && !showAdd && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdd(true)}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
            >
              <div>
                <div className="font-medium">{format(new Date(reminder.reminderTime), "MMM dd, yyyy HH:mm")}</div>
                <div className="text-xs text-muted-foreground">
                  {reminder.reminderType === "10min" && "10 minutes before"}
                  {reminder.reminderType === "1h" && "1 hour before"}
                  {reminder.reminderType === "1d" && "1 day before"}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReminder(reminder.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="space-y-2 p-3 border border-border rounded">
          <Select value={reminderType} onValueChange={(v) => setReminderType(v as "10min" | "1h" | "1d")}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10min">10 minutes before</SelectItem>
              <SelectItem value="1h">1 hour before</SelectItem>
              <SelectItem value="1d">1 day before</SelectItem>
              <SelectItem value="custom">Custom time</SelectItem>
            </SelectContent>
          </Select>

          {reminderType === "custom" && (
            <Input
              type="datetime-local"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="h-8 text-sm"
            />
          )}

          <div className="flex gap-2">
            <Button type="button" onClick={handleAddReminder} size="sm" className="h-7 text-xs flex-1">
              Add Reminder
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAdd(false)
                setCustomTime("")
              }}
              size="sm"
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!dueDate && (
        <p className="text-xs text-muted-foreground">Set a due date to add reminders</p>
      )}
    </div>
  )
}

