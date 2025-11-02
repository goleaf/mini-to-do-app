"use client"

import { useState, useEffect } from "react"
import type { Task, Category } from "@/lib/db"
import { Sidebar } from "@/components/sidebar"
import { TaskListView } from "@/components/task-list-view"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/header"
import { TabsSection } from "@/components/shared/tabs-section"
import { Plus, Moon, Sun } from "lucide-react"
import { getTasks, getCategories, createTask, updateTask, deleteTask } from "@/lib/actions"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tasks")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [fetchedTasks, fetchedCategories] = await Promise.all([getTasks(), getCategories()])
      setTasks(fetchedTasks)
      setCategories(fetchedCategories)
      setIsLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleAddTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask = await createTask(data)
    setTasks([...tasks, newTask])
    setShowForm(false)
  }

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    const updated = await updateTask(id, data)
    if (updated) {
      setTasks(tasks.map((t) => (t.id === id ? updated : t)))
      setEditingTask(null)
      setShowForm(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id)
    if (success) {
      setTasks(tasks.filter((t) => t.id !== id))
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  const displayTasks = selectedCategory ? tasks.filter((t) => t.categoryId === selectedCategory) : tasks

  const tabs = [
    { value: "tasks", label: "Tasks", count: displayTasks.length },
    { value: "pomodoro", label: "Pomodoro" },
    { value: "analytics", label: "Analytics" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onCategoriesChange={async () => {
          const updated = await getCategories()
          setCategories(updated)
        }}
        totalTasks={tasks.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <PageHeader
          title="Tasks"
          subtitle={`${displayTasks.length} active`}
          actions={
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          }
        />

        <TabsSection tabs={tabs} value={activeTab} onValueChange={setActiveTab}>
          {activeTab === "tasks" && (
            <TaskListView
              tasks={displayTasks}
              categories={categories}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          )}

          {activeTab === "pomodoro" && (
            <div className="flex-1 p-8">
              <PomodoroTimer initialMinutes={25} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="flex-1 p-8 overflow-auto">
              <AnalyticsPanel tasks={tasks} categories={categories} />
            </div>
          )}
        </TabsSection>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => {
            setEditingTask(null)
            setShowForm(true)
          }}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Task Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update your task details below." : "Add a new task to your list."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={editingTask || undefined}
            categories={categories}
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleAddTask}
            onCancel={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
