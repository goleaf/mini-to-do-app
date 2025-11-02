"use client"

import { useState } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]))
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
