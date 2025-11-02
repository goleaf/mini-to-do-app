"use client"

import type React from "react"
import { useState } from "react"
import type { Category } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "@/components/shared/section-header"
import { useExpandedSections } from "@/hooks/use-expanded-sections"
import { useFavorites } from "@/hooks/use-favorites"
import { useSearch } from "@/hooks/use-search"
import {
  Inbox,
  Briefcase,
  User,
  ShoppingBag,
  Settings,
  BarChart3,
  CheckSquare2,
  Star,
  Edit2,
  Search,
  TrendingUp,
} from "lucide-react"
import { CategoryManager } from "@/components/category-manager"

interface SidebarProps {
  categories: Category[]
  onCategorySelect: (categoryId: string) => void
  selectedCategory: string | null
  onCategoriesChange: () => void
  totalTasks: number
}

const ICON_MAP: Record<string, React.ReactNode> = {
  inbox: <Inbox className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
  "shopping-bag": <ShoppingBag className="w-4 h-4" />,
}

export function Sidebar({
  categories,
  onCategorySelect,
  selectedCategory,
  onCategoriesChange,
  totalTasks,
}: SidebarProps) {
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  const { expandedSections, toggleSection } = useExpandedSections({
    categories: true,
    insights: true,
  })
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const {
    searchQuery,
    setSearchQuery,
    results: filteredCategories,
  } = useSearch(categories, (cat, query) => cat.name.toLowerCase().includes(query))

  const favoriteCategories = filteredCategories.filter((cat) => isFavorite(cat.id))
  const otherCategories = filteredCategories.filter((cat) => !isFavorite(cat.id))

  return (
    <div className="w-64 bg-background border-r border-border h-screen flex flex-col overflow-hidden transition-smooth">
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <CheckSquare2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-base leading-tight">Tasks</h1>
            <p className="text-xs text-muted-foreground">{totalTasks} items</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-sm bg-secondary border-0 rounded-lg placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 border-b border-border">
          <SectionHeader
            title="CATEGORIES"
            expanded={expandedSections.categories}
            onToggle={() => toggleSection("categories")}
          />
          {expandedSections.categories && (
            <div className="space-y-1">
              {otherCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No categories</p>
              ) : (
                otherCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-smooth text-sm group/item ${
                      selectedCategory === category.id
                        ? "bg-secondary text-primary font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="flex-1 text-left truncate">{category.name}</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(category.id)
                      }}
                      className="opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Star
                        className={`w-3 h-3 ${isFavorite(category.id) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-4">
          <SectionHeader
            title="INSIGHTS"
            expanded={expandedSections.insights}
            onToggle={() => toggleSection("insights")}
          />
          {expandedSections.insights && (
            <div className="space-y-2">
              <div className="p-3 rounded-md bg-secondary border border-border">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Productivity</p>
                    <p className="text-xs text-muted-foreground">2 today</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-md bg-secondary border border-border">
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Streak</p>
                    <p className="text-xs text-muted-foreground">5 days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border flex-shrink-0 p-4 space-y-2">
        <Button
          onClick={() => setShowCategoryManager(true)}
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-secondary"
          size="sm"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Manage
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-foreground hover:bg-secondary">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Category Manager Dialog */}
      <CategoryManager
        categories={categories}
        onCategoriesChange={onCategoriesChange}
        open={showCategoryManager}
        onOpenChange={setShowCategoryManager}
      />
    </div>
  )
}
