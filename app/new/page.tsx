"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Task, Category } from "@/lib/db"
import { TaskForm } from "@/components/task-form"
import { getCategories, createTask } from "@/lib/actions"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewTaskPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleAddTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    await createTask(data)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-semibold">New Task</h1>
        </div>

        <TaskForm
          categories={categories}
          onSubmit={handleAddTask}
          onCancel={() => router.push("/")}
        />
      </div>
    </div>
  )
}
