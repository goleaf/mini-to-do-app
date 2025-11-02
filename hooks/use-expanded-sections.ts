"use client"

import { useState, useEffect } from "react"

interface SectionState {
  [key: string]: boolean
}

const EXPANDED_SECTIONS_KEY = "expandedSections"

export function useExpandedSections(initialState: SectionState) {
  const [expandedSections, setExpandedSections] = useState<SectionState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(EXPANDED_SECTIONS_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Merge saved state with initial state to ensure all keys exist
          return { ...initialState, ...parsed }
        } catch {
          return initialState
        }
      }
    }
    return initialState
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(EXPANDED_SECTIONS_KEY, JSON.stringify(expandedSections))
    }
  }, [expandedSections])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return { expandedSections, toggleSection }
}
