import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Upload, FolderOpen, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateStoryboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStoryboardModal({ open, onOpenChange }: CreateStoryboardModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [showMediaOptions, setShowMediaOptions] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || !coverImage) return

    // Aqui você pode adicionar a lógica para salvar os dados iniciais
    // Por enquanto, vamos apenas navegar para a página de criação
    router.push("/admin_stories/create")
  }

  const handleMediaSelect = (type: 'link' | 'file' | 'library') => {
    setShowMediaOptions(false)
    
    // Simulando uma imagem selecionada
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
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Título do storyboard
            </label>
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
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Capa do storyboard
            </label>

            {!coverImage ? (
              <button
                onClick={() => setShowMediaOptions(true)}
                className="w-full h-[200px] rounded-lg border-2 border-dashed border-muted hover:border-muted-foreground/50 transition-colors"
              >
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <div className="p-4 rounded-full bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar uma capa
                  </p>
                </div>
              </button>
            ) : (
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden group">
                <Image
                  src={coverImage}
                  alt="Capa do storyboard"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

          {/* Opções de Mídia */}
          {showMediaOptions && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleMediaSelect('link')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="p-3 rounded-lg bg-background">
                    <Link className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">Link</span>
                </button>

                <button
                  onClick={() => handleMediaSelect('file')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="p-3 rounded-lg bg-background">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">Arquivo</span>
                </button>

                <button
                  onClick={() => handleMediaSelect('library')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="p-3 rounded-lg bg-background">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">Biblioteca</span>
                </button>
              </div>
            </div>
          )}

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