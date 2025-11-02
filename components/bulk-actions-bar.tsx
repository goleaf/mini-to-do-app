"use client"

import { Button } from "@/components/ui/button"
import { Trash2, CheckSquare, Square, X, Loader2 } from "lucide-react"

interface BulkActionsBarProps {
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkDelete: () => void
  onBulkComplete: () => void
  totalCount: number
  allSelected: boolean
  isLoading?: boolean
}

export function BulkActionsBar({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkComplete,
  totalCount,
  allSelected,
  isLoading = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onClearSelection : onSelectAll}
          className="h-7 text-xs"
          disabled={isLoading}
        >
          {allSelected ? (
            <>
              <Square className="w-3 h-3 mr-1" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="w-3 h-3 mr-1" />
              Select All
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkComplete}
          className="h-7 text-xs"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Processing...
            </>
          ) : (
            "Mark Complete"
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="h-7 text-xs text-destructive"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-7 w-7 p-0" disabled={isLoading}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

