"use client"

import type { Task, Category } from "@/lib/db"
import { TaskItem } from "@/components/task-item"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTaskFilters } from "@/hooks/use-task-filters"
import { EmptyState } from "@/components/shared/empty-state"
import { Search } from "lucide-react"

interface TaskListViewProps {
  tasks: Task[]
  categories: Category[]
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit: (task: Task) => void
}

export function TaskListView({ tasks, categories, onUpdate, onDelete, onEdit }: TaskListViewProps) {
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus, filteredTasks, statusGroups, tabStats } =
    useTaskFilters(tasks)

  const getCategoryById = (id?: string) => categories.find((c) => c.id === id)

  const statusLabels = {
    all: "All",
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  }

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
              className="pl-10 h-10 bg-secondary border-0 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tabs with minimal styling */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-6 border-b border-border flex-shrink-0">
          <TabsList className="grid w-fit grid-cols-4 gap-0 bg-transparent p-0 h-auto">
            {Object.entries(tabStats).map(([status, count]) => (
              <TabsTrigger
                key={status}
                value={status}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm font-medium data-[state=inactive]:text-muted-foreground hover:text-foreground"
              >
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-2 text-xs text-muted-foreground">{count}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        {["all", "todo", "in_progress", "done"].map((status) => {
          const tasksForStatus = status === "all" ? filteredTasks : filteredTasks.filter((t) => t.status === status)

          return (
            <TabsContent key={status} value={status} className="flex-1 overflow-y-auto p-8">
              {tasksForStatus.length === 0 ? (
                <EmptyState
                  title={status === "all" ? "No tasks yet" : `No ${status.replace("_", " ")} tasks`}
                  description="Create a new task to get started"
                />
              ) : (
                <div className="space-y-2 max-w-3xl">
                  {status === "all"
                    ? Object.entries(statusGroups).map(([groupStatus, groupTasks]) =>
                        groupTasks.length > 0 ? (
                          <div key={groupStatus} className="space-y-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {statusLabels[groupStatus as keyof typeof statusLabels]} • {groupTasks.length}
                            </h3>
                            <div className="space-y-2">
                              {groupTasks.map((task) => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  category={getCategoryById(task.categoryId)}
                                  onComplete={async () => {
                                    await onUpdate(task.id, { isCompleted: !task.isCompleted })
                                  }}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  onToggleSubtask={async () => {}}
                                  compact={false}
                                />
                              ))}
                            </div>
                          </div>
                        ) : null,
                      )
                    : tasksForStatus.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          category={getCategoryById(task.categoryId)}
                          onComplete={async () => {
                            await onUpdate(task.id, { isCompleted: !task.isCompleted })
                          }}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onToggleSubtask={async () => {}}
                          compact={false}
                        />
                      ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
