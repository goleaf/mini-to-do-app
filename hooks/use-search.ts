"use client"

import { useState, useMemo } from "react"

export function useSearch<T>(items: T[], searchFn: (item: T, query: string) => boolean) {
  const [searchQuery, setSearchQuery] = useState("")

  const results = useMemo(() => {
    if (!searchQuery.trim()) return items
    return items.filter((item) => searchFn(item, searchQuery.toLowerCase()))
  }, [items, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    results,
  }
}
