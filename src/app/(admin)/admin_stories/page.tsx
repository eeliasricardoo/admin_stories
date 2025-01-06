"use client"

import { useState } from "react"
import { StoriesEmptyState } from "@/components/admin/stories/stories-empty-state"
import { StoriesHeader } from "@/components/admin/stories/stories-header"
import { StoriesList } from "@/components/admin/stories/stories-list"

type ViewState = "all" | "published" | "draft" | "empty"

export default function AdminStoriesPage() {
  const [viewState, setViewState] = useState<ViewState>("all")

  return (
    <main className="flex flex-col w-full min-h-screen p-8 gap-8">
      <StoriesHeader 
        viewState={viewState}
        onViewStateChange={setViewState}
      />

      {viewState === "empty" ? (
        <StoriesEmptyState />
      ) : (
        <StoriesList 
          filter={viewState} 
          onFilterChange={setViewState}
        />
      )}
    </main>
  )
} 