"use client"

import { useState } from "react"
import { StoriesEmptyState } from "@/components/admin/stories/stories-empty-state"
import { StoriesHeader } from "@/components/admin/stories/stories-header"
import { StoriesList } from "@/components/admin/stories/stories-list"
import { useToast } from "@/hooks/use-toast"

type ViewState = "all" | "published" | "draft"

export default function AdminStoriesPage() {
  const [viewState, setViewState] = useState<ViewState>("all")
  const [hasStories, setHasStories] = useState(true)
  const { toast } = useToast()

  const handleClearAll = () => {
    setHasStories(false)
    toast({
      title: "Storyboards removidos",
      description: "Todos os storyboards foram removidos com sucesso.",
      variant: "default",
    })
  }

  return (
    <main className="flex flex-col w-full min-h-screen p-8 gap-8">
      <StoriesHeader 
        filter={viewState}
        onFilterChange={setViewState}
        onClearAll={handleClearAll}
        hasStories={hasStories}
      />

      {!hasStories ? (
        <StoriesEmptyState />
      ) : (
        <StoriesList 
          filter={viewState} 
          onFilterChange={setViewState}
          onClearAll={handleClearAll}
        />
      )}
    </main>
  )
} 