"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { Select } from "@/components/ui/select"

interface StoriesHeaderProps {
  filter: "all" | "published" | "draft"
  onFilterChange: (filter: "all" | "published" | "draft") => void
}

export function StoriesHeader({ filter, onFilterChange }: StoriesHeaderProps) {
  const router = useRouter()

  const handleCreateStory = () => {
    router.push("/admin_stories/create")
  }

  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Buscar stories..." 
            className="pl-10"
          />
        </div>

        <Select
          value="recent"
          className="w-[180px]"
        >
          <option value="recent">Mais recente</option>
          <option value="old">Mais antigo</option>
          <option value="engagement">Maior engajamento</option>
        </Select>

        <Select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as "all" | "published" | "draft")}
          className="w-[180px]"
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicados</option>
          <option value="draft">Despublicados</option>
        </Select>
      </div>

      <Button 
        size="sm" 
        variant="default" 
        className="gap-2"
        onClick={handleCreateStory}
      >
        <Plus className="h-4 w-4" />
        CRIAR STORIES
      </Button>
    </header>
  )
} 