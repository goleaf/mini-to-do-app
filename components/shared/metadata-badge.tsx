import { cn } from "@/lib/utils"

interface MetadataBadgeProps {
  label: string
  variant?: "default" | "priority-high" | "priority-low" | "status" | "recurring"
  className?: string
}

export function MetadataBadge({ label, variant = "default", className }: MetadataBadgeProps) {
  const variants = {
    default: "px-2.5 py-1 bg-muted text-xs font-medium",
    "priority-high":
      "px-2.5 py-1 bg-red-100/50 text-red-700 text-xs font-medium dark:bg-red-950/50 dark:text-red-300",
    "priority-low":
      "px-2.5 py-1 bg-emerald-100/50 text-emerald-700 text-xs font-medium dark:bg-emerald-950/50 dark:text-emerald-300",
    status:
      "px-2.5 py-1 bg-blue-100/50 text-blue-700 text-xs font-medium dark:bg-blue-950/50 dark:text-blue-300",
    recurring:
      "px-2.5 py-1 bg-purple-100/50 text-purple-700 text-xs font-medium dark:bg-purple-950/50 dark:text-purple-300",
  }

  return <span className={cn(variants[variant], className)}>{label}</span>
}
