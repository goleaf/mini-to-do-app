"use client"

import type { Task, Category } from "@/lib/db"
import { TaskList } from "@/components/tasks/task-list"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTaskFilters } from "@/hooks/use-task-filters"
import { EmptyState } from "@/components/shared/empty-state"
import { MetadataBadge } from "@/components/shared/metadata-badge"
import { Search } from "lucide-react"

interface TaskListViewProps {
  tasks: Task[]
  categories: Category[]
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit: (task: Task) => void
}

const STATUS_LABELS = {
  all: "All",
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
} as const

export function TaskListView({ tasks, categories, onUpdate, onDelete, onEdit }: TaskListViewProps) {
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus, filteredTasks, tabStats } =
    useTaskFilters(tasks)

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="px-8 py-6 border-b border-border flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-secondary border-0"
            />
          </div>
        </div>
      </div>

      {/* Tabs with minimal styling */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-6 border-b border-border flex-shrink-0">
          <TabsList className="grid w-fit grid-cols-4 gap-0 bg-transparent p-0 h-auto">
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <TabsTrigger
                key={status}
                value={status}
                className="px-4 py-2 text-sm font-medium data-[selected]:text-foreground data-[selected]:border-b-2 data-[selected]:border-primary text-muted-foreground hover:text-foreground"
              >
                {label}
                <MetadataBadge label={tabStats[status as keyof typeof tabStats].toString()} className="ml-2" />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        {Object.keys(STATUS_LABELS).map((status) => {
          const tasksForStatus = status === "all" ? filteredTasks : filteredTasks.filter((t) => t.status === status)

          return (
            <TabsContent key={status} value={status} className="flex-1 overflow-y-auto p-8">
              {tasksForStatus.length === 0 ? (
                <EmptyState
                  title={status === "all" ? "No tasks yet" : `No ${STATUS_LABELS[status as keyof typeof STATUS_LABELS].toLowerCase()} tasks`}
                  description="Create a new task to get started"
                />
              ) : (
                <div className="max-w-3xl">
                  <TaskList
                    tasks={tasksForStatus}
                    categories={categories}
                    onComplete={async (taskId) => {
                      const task = tasksForStatus.find((t) => t.id === taskId)
                      if (task) {
                        await onUpdate(taskId, { isCompleted: !task.isCompleted })
                      }
                    }}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    groupByStatus={status === "all"}
                    statusLabels={STATUS_LABELS}
                  />
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
