"use client"

import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { X, Upload, ImageIcon, Link, FolderOpen, ThumbsUp, ThumbsDown, Share, Copy, Trash, Plus, GripVertical } from "lucide-react"
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
import { MediaMenu } from "@/components/admin/stories/media-menu"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { ShareMenu } from "@/components/ui/share-menu"
import { cn } from "@/lib/utils"
import { DragDropProvider } from "@/components/providers/drag-drop-provider"
import { useToast } from "@/hooks/use-toast"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoryContext } from "@/contexts/story-context"
import { StoryProvider } from "@/contexts/story-context"
import { Navbar } from "@/components/admin/stories/navbar"

interface Story {
  id: string
  title: string
  description: string
  layerName: string
  media?: {
    type: 'link'
    url: string
  }
  cta: {
    enabled: boolean
    label: string
    url: string
  }
}

// Tipagem para o resultado do drag
interface DragResult {
  destination?: {
    index: number;
  };
  source: {
    index: number;
  };
}

// Array de imagens do iFood
const IFOOD_IMAGES = [
  "https://images.unsplash.com/photo-1526424382096-74a93e105682?w=800&q=80", // Entregador
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", // Pizza
  "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80", // Prato brasileiro
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", // Prato gourmet
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", // Hambúrguer
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80", // Comida japonesa
]

// Agora vamos ajustar o layout principal
export default function CreateStoryPage() {
  return (
    <StoryProvider>
      <CreateStoryContent />
    </StoryProvider>
  )
}

function CreateStoryContent() {
  const router = useRouter()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [schedulePost, setSchedulePost] = useState(false)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  
  // Estados para os stories
  const [stories, setStories] = useState<Story[]>([
    {
      id: "story-1",
      title: "",
      description: "",
      layerName: "Storie 1",
      cta: {
        enabled: false,
        label: "Acessar agora",
        url: ""
      }
    }
  ])
  const [activeStoryId, setActiveStoryId] = useState("story-1")

  const activeStory = stories.find(s => s.id === activeStoryId)

  const [pressedButtons, setPressedButtons] = useState<{
    like: boolean;
    dislike: boolean;
  }>({
    like: false,
    dislike: false,
  });

  const [permissions, setPermissions] = useState({
    allowReactions: false,
    allowSharing: false
  })

  const { toast } = useToast()

  const handleMediaSelect = (type: 'link' | 'file' | 'library', data?: string) => {
    setShowMediaOptions(false)
    switch (type) {
      case 'link':
        // Seleciona uma imagem aleatória do array
        const randomImage = IFOOD_IMAGES[Math.floor(Math.random() * IFOOD_IMAGES.length)]
        
        setStories(prev => prev.map(story => 
          story.id === activeStoryId 
            ? { 
                ...story, 
                media: { 
                  type: 'link', 
                  url: randomImage
                } 
              }
            : story
        ))
        break
      case 'file':
        console.log('Upload de arquivo')
        break
      case 'library':
        console.log('Abrir biblioteca')
        break
    }
  }

  const handleAddStory = () => {
    const newId = `story-${stories.length + 1}`
    const newStory = {
      id: newId,
      title: "",
      description: "",
      layerName: `Storie ${stories.length + 1}`,
      cta: {
        enabled: false,
        label: "Acessar agora",
        url: ""
      }
    }
    setStories(prev => [...prev, newStory])
    setActiveStoryId(newId)
  }

  const handleDuplicateStory = (storyId: string) => {
    if (hasStoryWithMedia) return
    
    const storyToDuplicate = stories.find(s => s.id === storyId)
    if (storyToDuplicate) {
      const newStory = {
        ...storyToDuplicate,
        id: `story-${stories.length + 1}`,
        layerName: `${storyToDuplicate.layerName} (cópia)`
      }
      setStories(prev => [...prev, newStory])
    }
  }

  const handleDeleteStory = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? {
            ...story,
            media: undefined,
            title: "",
            description: "",
          }
        : story
    ))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(stories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setStories(items)
  }

  const hasStoryWithMedia = stories.some(story => story.media)

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel 
          defaultSize={25} 
          minSize={20} 
          maxSize={40}
          className="bg-background"
        >
          {/* Sidebar */}
          <ScrollArea className="h-screen">
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setShowExitDialog(true)}
                  className="hover:bg-muted px-2 py-1 rounded-md transition-colors text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Voltar
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Informações básicas</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ajuste o título e descrição para você deseja publicar
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Adicionar título" 
                      className="text-base"
                      value={activeStory?.title || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 50) {
                          setStories(prev => prev.map(story => 
                            story.id === activeStoryId 
                              ? { ...story, title: value }
                              : story
                          ))
                        }
                      }}
                      maxLength={50}
                    />
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {activeStory?.title?.length || 0}/50 caracteres
                    </span>
                  </div>

                  <div>
                    <Textarea 
                      placeholder="Descrição dos stories" 
                      className="min-h-[96px] resize-none text-base"
                      value={activeStory?.description || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 128) {
                          setStories(prev => prev.map(story => 
                            story.id === activeStoryId 
                              ? { ...story, description: value }
                              : story
                          ))
                        }
                      }}
                      maxLength={128}
                    />
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {activeStory?.description?.length || 0}/128 caracteres
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Actions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Ações do Story</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Gerencie este story
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDuplicateStory(activeStoryId)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </Button>
                  {stories.length > 1 && (
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteStory(activeStoryId)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
              </div>

              {/* Link externo (CTA) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Link externo (CTA)</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Configure as informações de redirecionamento
                    </p>
                  </div>
                  <Switch 
                    checked={activeStory?.cta?.enabled}
                    onCheckedChange={(enabled) => {
                      setStories(prev => prev.map(story => 
                        story.id === activeStoryId 
                          ? { 
                              ...story, 
                              cta: { 
                                ...story.cta,
                                enabled 
                              } 
                            }
                          : story
                      ))
                    }}
                  />
                </div>

                {activeStory?.cta?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label>Texto do botão</Label>
                      <Input 
                        placeholder="Ex: Acessar agora"
                        value={activeStory?.cta?.label || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          setStories(prev => prev.map(story => 
                            story.id === activeStoryId 
                              ? { 
                                  ...story, 
                                  cta: { 
                                    ...story.cta,
                                    label: value 
                                  } 
                                }
                              : story
                          ))
                        }}
                      />
                    </div>

                    <div>
                      <Label>URL de destino</Label>
                      <Input 
                        placeholder="Ex: https://ifood.com.br/promocao"
                        value={activeStory?.cta?.url || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          setStories(prev => prev.map(story => 
                            story.id === activeStoryId 
                              ? { 
                                  ...story, 
                                  cta: { 
                                    ...story.cta,
                                    url: value 
                                  } 
                                }
                              : story
                          ))
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={75}>
          <div className="h-screen relative">
            <Navbar 
              onSaveAsDraft={() => setShowDraftDialog(true)}
              onPublish={() => setShowPublishDialog(true)}
            />

            {/* Preview Area */}
            <div className="h-screen flex flex-col relative">
              {/* Content */}
              <div className="flex-1 bg-muted/5 pt-16">
                {/* Active Story Preview */}
                <div className="flex-1 p-8 flex flex-col items-center justify-center">
                  {/* Phone Preview */}
                  <div className="w-[340px] h-[680px] bg-zinc-900 rounded-[3rem] shadow-2xl p-4 relative overflow-hidden">
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-zinc-900 rounded-b-3xl z-20" />
                    
                    {/* Screen Content */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                      {!activeStory?.media ? (
                        <div className="absolute inset-0">
                          <button 
                            className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group"
                            onClick={() => setShowMediaOptions(true)}
                          >
                            <div className="relative">
                              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                              <div className="relative bg-white rounded-xl p-4 shadow-sm border group-hover:border-primary/20 transition-all">
                                <ImageIcon className="h-8 w-8 text-zinc-400 group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-center max-w-[280px] mx-auto">
                              <p className="text-sm font-medium text-zinc-900">Adicionar mídia</p>
                              <div className="space-y-1 text-xs text-zinc-500">
                                <p>Dimensões de 1080×1920</p>
                                <p>Imagens: PNG, JPG e WebP</p>
                                <p>Vídeos: MP4 e MOV</p>
                                <p>Duração máxima: 3 minutos</p>
                                <p>Tamanho máximo: 4 GB</p>
                              </div>
                            </div>
                          </button>

                          {showMediaOptions && (
                            <div className="absolute inset-0 z-10">
                              <MediaMenu 
                                onSelect={handleMediaSelect}
                                onClose={() => setShowMediaOptions(false)}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative w-full h-full bg-black/60">
                          {/* Background Image */}
                          <Image
                            src={activeStory.media.url}
                            alt={activeStory.title}
                            fill
                            className="object-cover"
                            priority
                          />

                          {/* Gradients para melhor leitura */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                          {/* Content Area */}
                          <div className="absolute inset-0 flex flex-col">
                            {/* Header */}
                            <div className="p-4 flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-[#EA1D2C] text-sm font-bold">iF</span>
                              </div>
                              <span className="text-sm font-medium text-white">@iFoodparaparceiros</span>
                            </div>

                            {/* Story Progress */}
                            <div className="px-4 flex gap-1">
                              {stories.map((story, index) => (
                                <div 
                                  key={story.id} 
                                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                                >
                                  <div 
                                    className={`h-full bg-white transition-all duration-300 ${
                                      story.id === activeStoryId ? 'w-full' : index < stories.findIndex(s => s.id === activeStoryId) ? 'w-full' : 'w-0'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Title Area */}
                            <div className="flex-1 flex flex-col justify-end p-6 space-y-6">
                              {/* Title e Description */}
                              <div className="space-y-4">
                                <h1 className="text-2xl font-bold text-white leading-tight break-words">
                                  {activeStory.title || ""}
                                </h1>

                                <div>
                                  <p 
                                    className={`text-base text-white/90 leading-relaxed break-words whitespace-pre-wrap transition-all duration-300 ease-in-out ${
                                      !showFullDescription 
                                        ? 'line-clamp-2 h-[48px]'
                                        : 'h-auto'
                                    }`}
                                  >
                                    {activeStory.description || ""}
                                    {!showFullDescription && activeStory?.description?.length > 64 && (
                                      <span className="inline-block transition-opacity duration-200">...</span>
                                    )}
                                  </p>
                                  
                                  {activeStory?.description?.length > 64 && (
                                    <button 
                                      className="text-white/80 text-sm mt-2 hover:text-white 
                                      transition-all duration-200 ease-in-out transform 
                                      hover:-translate-y-0.5 active:translate-y-0
                                      hover:shadow-sm active:shadow-none
                                      focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-2 py-1 -mx-2"
                                      onClick={() => setShowFullDescription(!showFullDescription)}
                                    >
                                      <span className="inline-flex items-center gap-1 group">
                                        {showFullDescription ? 'Ver menos' : 'Ver mais'}
                                        <span className="transition-transform group-hover:translate-x-0.5">
                                          {showFullDescription ? '↑' : '↓'}
                                        </span>
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* CTA Button */}
                              {activeStory?.cta?.enabled && (
                                <button className="w-full bg-white hover:bg-white/90 transition-colors text-black font-medium rounded-full py-3 text-sm">
                                  {activeStory.cta.label || "Acessar agora"}
                                </button>
                              )}

                              {/* Interaction Buttons */}
                              <div className="flex items-center gap-3">
                                {permissions.allowReactions && (
                                  <>
                                    {/* Like Button */}
                                    <button 
                                      className={`w-10 h-10 rounded-full flex items-center justify-center
                                      transform transition-all duration-150 
                                      hover:-translate-y-0.5 active:translate-y-0
                                      ${pressedButtons.like 
                                        ? 'bg-white text-zinc-900 scale-95 shadow-inner' 
                                        : 'bg-zinc-900/40 text-white hover:shadow-lg hover:bg-zinc-900/50'
                                      }
                                      `}
                                      onClick={() => {
                                        setPressedButtons(prev => ({
                                          like: !prev.like,
                                          dislike: false
                                        }))
                                      }}
                                    >
                                      <ThumbsUp className={`w-5 h-5 transition-all duration-150 ${
                                        pressedButtons.like ? 'scale-110' : 'scale-100'
                                      }`} />
                                    </button>

                                    {/* Dislike Button */}
                                    <button 
                                      className={`w-10 h-10 rounded-full flex items-center justify-center
                                      transform transition-all duration-150 
                                      hover:-translate-y-0.5 active:translate-y-0
                                      ${pressedButtons.dislike 
                                        ? 'bg-white text-zinc-900 scale-95 shadow-inner' 
                                        : 'bg-zinc-900/40 text-white hover:shadow-lg hover:bg-zinc-900/50'
                                      }
                                      `}
                                      onClick={() => {
                                        setPressedButtons(prev => ({
                                          like: false,
                                          dislike: !prev.dislike
                                        }))
                                      }}
                                    >
                                      <ThumbsDown className={`w-5 h-5 transition-all duration-150 ${
                                        pressedButtons.dislike ? 'scale-110' : 'scale-100'
                                      }`} />
                                    </button>
                                  </>
                                )}

                                {permissions.allowSharing && (
                                  <div className="relative">
                                    <button 
                                      className="h-10 px-4 bg-zinc-900/40 backdrop-blur-sm rounded-full 
                                      flex items-center gap-2 hover:bg-zinc-900/50 active:scale-95 
                                      transform transition-all duration-150 hover:shadow-lg 
                                      hover:-translate-y-0.5 active:translate-y-0 active:shadow-none group"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setShareMenuOpen(prev => !prev)
                                      }}
                                    >
                                      <Share className={cn(
                                        "w-4 h-4 text-white transition-transform",
                                        shareMenuOpen ? "rotate-12" : "rotate-0",
                                        "group-hover:rotate-12"
                                      )} />
                                      <span className="text-sm font-medium text-white">Compartilhar</span>
                                    </button>

                                    {shareMenuOpen && (
                                      <div className="absolute bottom-full left-0 mb-2">
                                        <ShareMenu
                                          url={`https://seu-dominio.com/stories/${activeStory?.id}`}
                                          title={activeStory?.title || ""}
                                          onClose={() => setShareMenuOpen(false)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stories List */}
                <div className="h-32 border-t bg-background/50 backdrop-blur-sm">
                  <div className="h-full max-w-[1400px] mx-auto px-8">
                    <DragDropProvider onDragEnd={handleDragEnd}>
                      <div className="h-full flex items-center">
                        <div className="flex-1 overflow-x-auto">
                          <div className="flex items-start gap-4 py-4 min-w-max">
                            {stories.map((story, index) => (
                              <Draggable key={story.id} draggableId={story.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={cn(
                                      "group relative flex-none",
                                      snapshot.isDragging && "opacity-60"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      {/* Grip Handle */}
                                      <div
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          "w-6 flex items-center justify-center opacity-0 group-hover:opacity-40 hover:!opacity-100",
                                          "cursor-grab active:cursor-grabbing transition-opacity"
                                        )}
                                      >
                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                      </div>

                                      {/* Card */}
                                      <div
                                        onClick={() => setActiveStoryId(story.id)}
                                        className={cn(
                                          "w-16 h-24 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                          story.id === activeStoryId 
                                            ? 'border-primary shadow-md' 
                                            : 'border-transparent hover:border-primary/50',
                                          snapshot.isDragging && "shadow-lg"
                                        )}
                                      >
                                        {story.media ? (
                                          <Image
                                            src={story.media.url}
                                            alt={story.layerName}
                                            width={64}
                                            height={96}
                                            className="w-full h-full object-cover rounded-lg"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Story Actions */}
                                    {story.media && !snapshot.isDragging && (
                                      <div className={cn(
                                        "absolute -top-2 right-0 flex gap-1 transition-all duration-200",
                                        "opacity-0 group-hover:opacity-100"
                                      )}>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDuplicateStory(story.id)
                                          }}
                                          disabled={hasStoryWithMedia}
                                          className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-colors",
                                            hasStoryWithMedia 
                                              ? "bg-muted cursor-not-allowed" 
                                              : "bg-white hover:bg-zinc-50"
                                          )}
                                        >
                                          <Copy className={cn(
                                            "w-3 h-3",
                                            hasStoryWithMedia ? "text-muted-foreground/40" : "text-zinc-900"
                                          )} />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteStory(story.id)
                                          }}
                                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-50 transition-colors"
                                        >
                                          <Trash className="w-3 h-3 text-zinc-900" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}

                            {/* Botão de adicionar */}
                            <div className="flex-none">
                              <button
                                onClick={handleAddStory}
                                disabled={hasStoryWithMedia}
                                className={cn(
                                  "w-16 h-24 rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-200",
                                  hasStoryWithMedia 
                                    ? "border-muted-foreground/10 bg-muted/5 cursor-not-allowed" 
                                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                                )}
                              >
                                <Plus className={cn(
                                  "w-6 h-6",
                                  hasStoryWithMedia ? "text-muted-foreground/40" : "text-muted-foreground"
                                )} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DragDropProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja sair sem salvar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Todas as alterações serão perdidas. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push("/admin_stories")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Publicar story?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Ao publicar, seu story ficará visível para todos os usuários do iFood.
              </p>
              <p className="text-muted-foreground">
                Certifique-se de que todo o conteúdo está correto antes de prosseguir.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e revisar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowPublishDialog(false)
                // Simula a publicação
                setTimeout(() => {
                  toast({
                    variant: "success",
                    title: "Story publicado com sucesso!",
                    description: "Seu story já está disponível para visualização.",
                  })
                  router.push("/admin_stories")
                }, 500)
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sim, publicar agora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Draft Dialog */}
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Salvar como rascunho?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Seu story será salvo como rascunho e você poderá continuar editando depois.
              </p>
              <p className="text-muted-foreground">
                O conteúdo não ficará visível para os usuários até ser publicado.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                // Lógica de salvar rascunho
                console.log('Salvando rascunho...')
              }}
            >
              Salvar rascunho
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 