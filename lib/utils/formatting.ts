// Date formatting utilities
export function formatDate(date: string, options?: { showYear?: boolean }) {
  const d = new Date(date)
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: options?.showYear ? "numeric" : undefined,
  })
}

export function isOverdue(dueDate: string, isCompleted: boolean): boolean {
  return dueDate && new Date(dueDate) < new Date() && !isCompleted ? true : false
}

// Status formatting
export function formatStatus(status: string): string {
  return status
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function getPriorityColor(priority: "low" | "normal" | "high"): { bg: string; text: string } {
  switch (priority) {
    case "high":
      return { bg: "bg-red-100/50 dark:bg-red-950/50", text: "text-red-700 dark:text-red-300" }
    case "low":
      return { bg: "bg-emerald-100/50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-300" }
    case "normal":
    default:
      return { bg: "bg-amber-100/50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-300" }
  }
}
