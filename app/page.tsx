"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Task, Category } from "@/lib/db"
import { Sidebar } from "@/components/sidebar"
import { TaskListView } from "@/components/task-list-view"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { QuickView } from "@/components/quick-view"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/header"
import { TabsSection } from "@/components/shared/tabs-section"
import { Plus, Moon, Sun } from "lucide-react"
import { getTasks, getCategories, updateTask, deleteTask, bulkUpdateTasks } from "@/lib/actions"

export default function Home() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode")
      return saved === "true"
    }
    return false
  })
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isBulkOperation, setIsBulkOperation] = useState(false)

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }
  const [activeTab, setActiveTab] = useState("tasks")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [fetchedTasks, fetchedCategories] = await Promise.all([getTasks(), getCategories()])
        setTasks(fetchedTasks)
        setCategories(fetchedCategories)
      } catch (error) {
        toast.error("Failed to load tasks and categories")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    setIsUpdating(true)
    // Optimistic update
    const originalTask = tasks.find((t) => t.id === id)
    if (originalTask) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...data } : t)))
    }

    try {
      const updated = await updateTask(id, data)
      if (updated) {
        setTasks(tasks.map((t) => (t.id === id ? updated : t)))
        setEditingTask(null)
        setShowForm(false)
        toast.success("Task updated successfully")
      }
    } catch (error) {
      // Rollback optimistic update
      if (originalTask) {
        setTasks(tasks.map((t) => (t.id === id ? originalTask : t)))
      }
      toast.error(error instanceof Error ? error.message : "Failed to update task")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    setIsDeleting(id)
    // Optimistic update
    const originalTasks = [...tasks]
    setTasks(tasks.filter((t) => t.id !== id))

    try {
      const success = await deleteTask(id)
      if (!success) {
        throw new Error("Delete operation failed")
      }
      toast.success("Task deleted successfully")
    } catch (error) {
      // Rollback optimistic update
      setTasks(originalTasks)
      toast.error(error instanceof Error ? error.message : "Failed to delete task")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleBulkDelete = async (taskIds: string[]) => {
    setIsBulkOperation(true)
    // Optimistic update
    const originalTasks = [...tasks]
    setTasks(tasks.filter((t) => !taskIds.includes(t.id)))

    try {
      await Promise.all(taskIds.map((id) => deleteTask(id)))
      toast.success(`${taskIds.length} task(s) deleted successfully`)
    } catch (error) {
      // Rollback optimistic update
      setTasks(originalTasks)
      throw error
    } finally {
      setIsBulkOperation(false)
    }
  }

  const handleBulkUpdate = async (updates: { id: string; changes: Partial<Task> }[]) => {
    setIsBulkOperation(true)
    // Optimistic update
    const originalTasks = [...tasks]
    const updatedTasks = tasks.map((task) => {
      const update = updates.find((u) => u.id === task.id)
      return update ? { ...task, ...update.changes } : task
    })
    setTasks(updatedTasks)

    try {
      await bulkUpdateTasks(updates)
      const refreshedTasks = await getTasks()
      setTasks(refreshedTasks)
      toast.success(`${updates.length} task(s) updated successfully`)
    } catch (error) {
      // Rollback optimistic update
      setTasks(originalTasks)
      throw error
    } finally {
      setIsBulkOperation(false)
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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin mx-auto mb-2" />
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
        tasks={tasks}
        onCategorySelect={handleCategorySelect}
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
              className="p-2 hover:bg-secondary transition-smooth text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          }
        />

        <TabsSection tabs={tabs} value={activeTab} onValueChange={setActiveTab}>
          {activeTab === "tasks" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-8 pb-0">
                <QuickView tasks={tasks} categories={categories} />
              </div>
              <div className="flex-1 overflow-y-auto">
                <TaskListView
                  tasks={displayTasks}
                  categories={categories}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onBulkDelete={handleBulkDelete}
                  onBulkUpdate={handleBulkUpdate}
                  isDeleting={(id) => isDeleting === id}
                  isBulkOperation={isBulkOperation}
                />
              </div>
            </div>
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
          onClick={() => router.push("/new")}
          size="lg"
          className="shadow-lg h-14 w-14 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Task Form Dialog - Only for editing */}
      {editingTask && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update your task details below.</DialogDescription>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              categories={categories}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => {
                setShowForm(false)
                setEditingTask(null)
              }}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
