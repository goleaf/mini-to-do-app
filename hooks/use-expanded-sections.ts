"use client"

import { useState } from "react"

interface SectionState {
  [key: string]: boolean
}

export function useExpandedSections(initialState: SectionState) {
  const [expandedSections, setExpandedSections] = useState(initialState)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return { expandedSections, toggleSection }
}
