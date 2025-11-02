import { Calendar, Clock } from "lucide-react"
import type { Task } from "@/lib/db"
import { formatDate } from "@/lib/utils/formatting"

interface TaskMetadataProps {
  task: Task
  compact?: boolean
}

export function TaskMetadata({ task, compact = false }: TaskMetadataProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {task.dueDate && (
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(task.dueDate, { showYear: new Date(task.dueDate).getFullYear() !== new Date().getFullYear() })}
        </span>
      )}
      {task.pomodoroEstimate && (
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {task.pomodoroCompleted || 0}/{task.pomodoroEstimate} 🍅
        </span>
      )}
      {task.estimatedMinutes && (
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {task.estimatedMinutes}min
        </span>
      )}
    </div>
  )
}
