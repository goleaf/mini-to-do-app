"use client"

import type { Task, Category } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsPanelProps {
  tasks: Task[]
  categories: Category[]
}

export function AnalyticsPanel({ tasks, categories }: AnalyticsPanelProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.isCompleted).length
  const pending = total - completed
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  const overdue = tasks.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false
    return new Date(t.dueDate) < new Date()
  }).length

  const categoryStats = categories
    .map((cat) => ({
      name: cat.name,
      value: tasks.filter((t) => t.categoryId === cat.id).length,
      color: cat.color,
    }))
    .filter((stat) => stat.value > 0)

  const priorityStats = [
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, fill: "#10b981" },
    { name: "Normal", value: tasks.filter((t) => t.priority === "normal").length, fill: "#f59e0b" },
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, fill: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{overdue}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Completion Rate</h3>
        <div className="text-4xl font-bold text-primary mb-2">{completionRate}%</div>
        <div className="w-full bg-muted h-2">
          <div className="bg-green-600 h-2 transition-all" style={{ width: `${completionRate}%` }} />
        </div>
      </Card>

      {categoryStats.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
