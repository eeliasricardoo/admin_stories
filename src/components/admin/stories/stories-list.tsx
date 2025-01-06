"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Copy, Pencil, Trash, Eye, Share } from "lucide-react"
import { HLSPlayer } from "@/components/ui/hls-player"
import { ShareMenu } from "@/components/ui/share-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Story {
  id: string
  title: string
  image: string
  videoUrl?: string // URL do stream HLS
  isPublished: boolean
  views?: number
  engagement?: number
}

// Imagens verticais de delivery e comida
const deliveryImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", // Prato gourmet
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", // Food presentation
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80", // Salada gourmet
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", // Pizza artesanal
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", // Prato com vegetais
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80", // Hambúrguer gourmet
]

const videoUrls = [
  // Vídeos verticais de comida em MP4
  "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/d13de3d6-accd-4e15-b2ea-1f8de30a91d8.mp4",
  "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/6c8f91ef-b2c5-4de9-9d75-59b3d7bf2e31.mp4",
  "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/e5c5c2f9-8466-4787-b8a5-3f6e21dad663.mp4",
  "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/d9a43ac6-e738-4c5e-8f45-00e2a1974782.mp4"
]

const mockStories: Story[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: i % 2 === 0 
    ? "Incremente seu cardápio com pratos exclusivos"
    : "Aumente suas vendas com fotos profissionais",
  image: deliveryImages[i % deliveryImages.length],
  // Usando vídeos reais
  videoUrl: videoUrls[i % videoUrls.length],
  isPublished: i % 2 === 0,
  views: Math.floor(Math.random() * 10000),
  engagement: Math.floor(Math.random() * 100)
}))

interface StoriesListProps {
  filter: "all" | "published" | "draft"
  onFilterChange: (filter: "all" | "published" | "draft") => void
}

export function StoriesList({ filter, onFilterChange }: StoriesListProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredStory, setHoveredStory] = useState<string | null>(null)
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null)
  const [storyToToggle, setStoryToToggle] = useState<Story | null>(null)
  const [stories, setStories] = useState<Story[]>(mockStories)
  
  // Adicionando o estado de permissões
  const [permissions, setPermissions] = useState({
    allowReactions: true,
    allowSharing: true
  })

  // Garantir que a renderização aconteça apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatNumber = (num: number) => {
    if (!mounted) return '0' // Retorna um valor padrão durante SSR
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const filteredStories = stories.filter(story => {
    if (filter === "all") return true
    if (filter === "published") return story.isPublished
    if (filter === "draft") return !story.isPublished
    return true
  })

  const handleTogglePublish = (story: Story) => {
    setStoryToToggle(story)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredStories.map((story) => (
          <div 
            key={story.id} 
            className="group relative flex flex-col rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            onMouseEnter={() => setHoveredStory(story.id)}
            onMouseLeave={() => setHoveredStory(null)}
          >
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              {hoveredStory === story.id && story.videoUrl ? (
                <HLSPlayer
                  src={story.videoUrl}
                  poster={story.image}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
                  priority={story.id === "1"}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2">
                  {story.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/90">
                  <Eye className="h-4 w-4" />
                  <span suppressHydrationWarning>
                    {mounted ? formatNumber(story.views || 0) : '0'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2.5 gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity"
                  title="Duplicar"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                  title="Excluir"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted/50">
                  {story.isPublished ? 'Publicado' : 'Despublicar'}
                </span>
                <Switch
                  checked={story.isPublished}
                  onCheckedChange={() => handleTogglePublish(story)}
                  aria-label="Toggle publish"
                  className="data-[state=checked]:bg-green-500/90 scale-75"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Confirmação */}
      <AlertDialog 
        open={!!storyToToggle} 
        onOpenChange={() => setStoryToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {storyToToggle?.isPublished ? 'Despublicar story?' : 'Publicar story?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {storyToToggle?.isPublished ? (
                <>
                  <p>
                    Ao despublicar, seu story não ficará mais visível para os usuários do iFood.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Você pode publicá-lo novamente quando desejar.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Ao publicar, seu story ficará visível para todos os usuários do iFood.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Certifique-se de que todo o conteúdo está correto antes de prosseguir.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setStories(currentStories => 
                  currentStories.map(story => 
                    story.id === storyToToggle?.id 
                      ? { ...story, isPublished: !story.isPublished }
                      : story
                  )
                )
                setStoryToToggle(null)
              }}
              className={cn(
                storyToToggle?.isPublished
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {storyToToggle?.isPublished ? 'Sim, despublicar' : 'Sim, publicar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 