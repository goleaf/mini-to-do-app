"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"

interface SectionHeaderProps {
  title: string
  count?: number
  expanded?: boolean
  onToggle?: () => void
  icon?: React.ReactNode
}

export function SectionHeader({ title, count, expanded = true, onToggle, icon }: SectionHeaderProps) {
  return (
    <h2
      className={`flex items-center gap-2 w-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth ${
        onToggle ? "cursor-pointer" : ""
      } mb-3`}
      onClick={onToggle}
    >
      {onToggle && <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "" : "-rotate-90"}`} />}
      {icon}
      {title}
      {count !== undefined && <span className="ml-auto text-muted-foreground">({count})</span>}
    </h2>
  )
}
