import type React from "react"
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        {icon && <div className="mb-3 flex justify-center">{icon}</div>}
        <p className="text-base font-medium text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  )
}
