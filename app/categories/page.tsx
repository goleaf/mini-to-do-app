"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { CategoryManagerContent } from "@/components/category-manager"
import { getCategories } from "@/lib/actions"
import { ArrowLeft, RefreshCcw } from "lucide-react"

export default function ManageCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadCategories = async () => {
    const fetched = await getCategories()
    setCategories(fetched)
  }

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true)
      await loadCategories()
      setIsLoading(false)
    }
    bootstrap()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadCategories()
    setIsRefreshing(false)
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
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="p-0 h-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to tasks</span>
            </Button>
            <h1 className="mt-3 text-2xl font-semibold">Manage Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Create, edit, and delete the categories that organize your tasks.</p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="flex items-center gap-2">
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
          </Button>
        </div>

        <CategoryManagerContent categories={categories} onCategoriesChange={loadCategories} className="space-y-6" />
      </div>
    </div>
  )
}
