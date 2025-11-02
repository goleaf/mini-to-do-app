"use client"

import type { Task, Category } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock } from "lucide-react"

interface QuickViewProps {
  tasks: Task[]
  categories: Category[]
}

export function QuickView({ tasks, categories }: QuickViewProps) {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const weekStart = new Date()
  const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const todayTasks = tasks.filter((t) => t.dueDate === today && !t.isCompleted)
  const tomorrowTasks = tasks.filter((t) => t.dueDate === tomorrow && !t.isCompleted)
  const thisWeekTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) >= weekStart && new Date(t.dueDate) <= weekEnd && !t.isCompleted,
  )
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(today) && !t.isCompleted)
  const completedToday = tasks.filter(
    (t) => t.isCompleted && new Date(t.updatedAt).toISOString().split("T")[0] === today,
  )

  const getCategoryIcon = (categoryId?: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || "📥"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-red-600 dark:text-red-300 font-medium">OVERDUE</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-200">{overdueTasks.length}</p>
          </div>
          <Calendar className="w-8 h-8 text-red-400 opacity-50" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">TODAY</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{todayTasks.length}</p>
          </div>
          <Clock className="w-8 h-8 text-blue-400 opacity-50" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 dark:text-amber-300 font-medium">TOMORROW</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-200">{tomorrowTasks.length}</p>
          </div>
          <Calendar className="w-8 h-8 text-amber-400 opacity-50" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">THIS WEEK</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">{thisWeekTasks.length}</p>
          </div>
          <Calendar className="w-8 h-8 text-purple-400 opacity-50" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-600 dark:text-green-300 font-medium">DONE TODAY</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-200">{completedToday.length}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
        </div>
      </Card>
    </div>
  )
}
