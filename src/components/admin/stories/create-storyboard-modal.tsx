"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"
import { TagsInput, type Tag } from "@/components/ui/tags-input"
import { Switch } from "@/components/ui/switch"

interface CreateStoryboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStoryboardModal({ open, onOpenChange }: CreateStoryboardModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [schedulePost, setSchedulePost] = useState(false)
  const [allowReactions, setAllowReactions] = useState(true)
  const [allowSharing, setAllowSharing] = useState(true)
  const [availableTags, setAvailableTags] = useState<Tag[]>([
    { id: "1", label: "Restaurantes" },
    { id: "2", label: "Delivery" },
    { id: "3", label: "Promoções" },
    { id: "4", label: "Novidades" },
    { id: "5", label: "Dicas" },
  ])

  const handleCreateTag = (label: string) => {
    const newTag = {
      id: `tag-${availableTags.length + 1}`,
      label
    }
    setAvailableTags(prev => [...prev, newTag])
    setSelectedTags(prev => [...prev, newTag])
  }

  const handleSubmit = () => {
    if (!title.trim() || !coverImage) return
    router.push("/admin_stories/create")
  }

  const handleMediaSelect = (type: 'link' | 'file' | 'library') => {
    setShowMediaOptions(false)
    setCoverImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar novo storyboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do storyboard</Label>
            <Input
              id="title"
              placeholder="Digite um título atraente..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/50 caracteres
            </p>
          </div>

          {/* Capa */}
          <div className="space-y-2">
            <Label>Capa do storyboard</Label>
            {!coverImage ? (
              <button
                onClick={() => setShowMediaOptions(true)}
                className="w-full h-[160px] rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-4"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                  <div className="relative bg-white rounded-xl p-4 shadow-sm border group-hover:border-primary/20 transition-all">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium text-foreground">Adicionar capa</p>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    Dimensões de 1080×1920 (PNG, JPG e WebP)
                  </p>
                </div>
              </button>
            ) : (
              <div className="relative w-full h-[160px] rounded-lg overflow-hidden group">
                <img 
                  src={coverImage} 
                  alt="Capa do storyboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowMediaOptions(true)}
                  >
                    Alterar capa
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsInput
              value={selectedTags}
              onChange={setSelectedTags}
              availableTags={availableTags}
              onCreateTag={handleCreateTag}
            />
            <p className="text-xs text-muted-foreground">
              Adicione tags para categorizar seu storyboard
            </p>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <Label>Configurações</Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Agendar publicação</Label>
                  <p className="text-xs text-muted-foreground">
                    Defina uma data e hora para publicação automática
                  </p>
                </div>
                <Switch 
                  checked={schedulePost}
                  onCheckedChange={setSchedulePost}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir reações</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir que usuários reajam ao conteúdo
                  </p>
                </div>
                <Switch 
                  checked={allowReactions}
                  onCheckedChange={setAllowReactions}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir compartilhamento</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir que usuários compartilhem o conteúdo
                  </p>
                </div>
                <Switch 
                  checked={allowSharing}
                  onCheckedChange={setAllowSharing}
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !coverImage}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 