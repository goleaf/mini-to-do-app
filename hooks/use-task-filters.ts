"use client"

import { useState, useMemo } from "react"
import type { Task } from "@/lib/db"

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDescription = task.description?.toLowerCase().includes(query) || false
        if (!matchesTitle && !matchesDescription) return false
      }
      return true
    })
  }, [tasks, searchQuery, filterStatus])

  const statusGroups = useMemo(() => {
    return {
      todo: filteredTasks.filter((t) => t.status === "todo"),
      in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
      done: filteredTasks.filter((t) => t.status === "done"),
    }
  }, [filteredTasks])

  const tabStats = useMemo(() => {
    return {
      all: filteredTasks.length,
      todo: statusGroups.todo.length,
      in_progress: statusGroups.in_progress.length,
      done: statusGroups.done.length,
    }
  }, [filteredTasks, statusGroups])

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredTasks,
    statusGroups,
    tabStats,
  }
}
