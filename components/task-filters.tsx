"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TaskFiltersProps {
  status: string
  priority: string
  category: string
  search: string
  onStatusChange: (status: string) => void
  onPriorityChange: (priority: string) => void
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  categories: Array<{ id: string; name: string; icon: string }>
}

export function TaskFilters({
  status,
  priority,
  category,
  search,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onSearchChange,
  categories,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">🟢 Low</SelectItem>
            <SelectItem value="normal">🟡 Normal</SelectItem>
            <SelectItem value="high">🔴 High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
