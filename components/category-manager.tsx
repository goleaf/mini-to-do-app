"use client"
import { useState } from "react"
import { toast } from "sonner"
import type { Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, Plus } from "lucide-react"
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions"
import { cn } from "@/lib/utils"

const colorOptions = ["#0891b2", "#f97316", "#06b6d4", "#84cc16", "#ec4899", "#8b5cf6", "#ef4444", "#10b981"]

interface CategoryManagerContentProps {
  categories: Category[]
  onCategoriesChange: () => void
  className?: string
}

export function CategoryManagerContent({ categories, onCategoriesChange, className }: CategoryManagerContentProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingColor, setEditingColor] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#0891b2")
  const handleStartEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
    setEditingColor(category.color)
  }

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return
    try {
      await updateCategory(editingId, { name: editingName, color: editingColor })
      setEditingId(null)
      toast.success("Category updated successfully")
      onCategoriesChange()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id)
        toast.success("Category deleted successfully")
        onCategoriesChange()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete category")
      }
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required")
      return
    }
    try {
      await createCategory({
        name: newCategoryName,
        color: newCategoryColor,
        icon: "inbox",
      })
      setNewCategoryName("")
      setNewCategoryColor("#0891b2")
      toast.success("Category created successfully")
      onCategoriesChange()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create category")
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Your Categories</h3>
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 p-3 border border-border hover:bg-muted/50 transition-colors"
          >
            {editingId === category.id ? (
              <>
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-8 text-sm flex-1"
                />
                <div className="flex gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingColor(color)}
                      className={`w-6 h-6 transition-transform ${editingColor === color ? "ring-2 ring-foreground scale-110" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button size="sm" variant="default" onClick={handleSaveEdit} className="h-8">
                  Save
                </Button>
              </>
            ) : (
              <>
                <div className="w-4 h-4 flex-shrink-0" style={{ backgroundColor: category.color }} />
                <span className="text-sm font-medium flex-1">{category.name}</span>
                <Button size="sm" variant="ghost" onClick={() => handleStartEdit(category)} className="h-7 w-7 p-0">
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t border-border">
        <h3 className="font-semibold text-sm">Create New Category</h3>
        <div className="space-y-3">
          <Input
            placeholder="Category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="h-9 text-sm"
          />
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`h-8 transition-transform ${newCategoryColor === color ? "ring-2 ring-foreground scale-110" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreateCategory} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </div>
      </div>
    </div>
  )
}

interface CategoryManagerProps {
  categories: Category[]
  onCategoriesChange: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryManager({ categories, onCategoriesChange, open, onOpenChange }: CategoryManagerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>Create, edit, and delete your task categories</DialogDescription>
        </DialogHeader>

        <CategoryManagerContent
          categories={categories}
          onCategoriesChange={onCategoriesChange}
          className="max-h-96 overflow-y-auto space-y-4"
        />
      </DialogContent>
    </Dialog>
  )
}
