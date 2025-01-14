"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Trash2 } from "lucide-react"
import { Select } from "@/components/ui/select"
import { CreateStoryboardModal } from "./create-storyboard-modal"

interface StoriesHeaderProps {
  filter: "all" | "published" | "draft"
  onFilterChange: (value: "all" | "published" | "draft") => void
  onClearAll: () => void
  hasStories: boolean
}

export function StoriesHeader({ filter, onFilterChange, onClearAll, hasStories }: StoriesHeaderProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Buscar storyboard..." 
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
          <option value="draft">Rascunhos</option>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        {hasStories && (
          <Button 
            size="sm" 
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            onClick={onClearAll}
          >
            <Trash2 className="h-4 w-4" />
            LIMPAR TUDO
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="default" 
          className="gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle className="h-4 w-4" />
          CRIAR STORYBOARD
        </Button>
      </div>

      <CreateStoryboardModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </header>
  )
} 