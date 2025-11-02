"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetadataBadge } from "@/components/shared/metadata-badge"

interface Tab {
  value: string
  label: string
  count?: number
}

interface TabsSectionProps {
  tabs: Tab[]
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function TabsSection({ tabs, value, onValueChange, children }: TabsSectionProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="flex-1 flex flex-col">
      <div className="px-8 pt-6 border-b border-border">
        <TabsList
          className="grid w-fit gap-0 bg-transparent p-0 h-auto"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-3 text-sm font-medium"
            >
              {tab.label}
              {tab.count !== undefined && <MetadataBadge label={tab.count.toString()} className="ml-2" />}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  )
}
