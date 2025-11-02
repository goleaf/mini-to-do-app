"use client"

import { useState, useEffect } from "react"

const FAVORITES_KEY = "favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FAVORITES_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
      return newFavorites
    })
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
