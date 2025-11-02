"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface KeyboardShortcutsProps {
  onNewTask: () => void
  onSearch: () => void
}

export function KeyboardShortcuts({ onNewTask, onSearch }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onSearch()
      } else if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        onNewTask()
      } else if (e.key === "?") {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onNewTask, onSearch])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Quick actions to boost your productivity</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">New Task</span>
            <kbd className="px-2 py-1 bg-muted text-xs font-mono">⌘ N</kbd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Search</span>
            <kbd className="px-2 py-1 bg-muted text-xs font-mono">⌘ K</kbd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Keyboard Help</span>
            <kbd className="px-2 py-1 bg-muted text-xs font-mono">?</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
