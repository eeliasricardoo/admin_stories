"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FolderOpen, Link as LinkIcon, ArrowRight } from "lucide-react"

interface MediaMenuProps {
  onSelect: (type: 'link' | 'file' | 'library', data?: string) => void
  onClose: () => void
}

export function MediaMenu({ onSelect, onClose }: MediaMenuProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState("")

  const handleLinkSubmit = () => {
    if (!url.trim()) return
    onSelect('link', url)
    setUrl("")
  }

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg shadow-xl">
        {!showUrlInput ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setShowUrlInput(true)}
                className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <div className="p-3 rounded-lg bg-white/10">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Link</span>
                <div className="absolute mt-20 bg-zinc-800 rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] text-zinc-400 whitespace-nowrap">
                    <p>Suporta apenas Shorts do Youtube</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSelect('file')}
                className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <div className="p-3 rounded-lg bg-white/10">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Arquivo</span>
                <div className="absolute mt-20 bg-zinc-800 rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] text-zinc-400 whitespace-nowrap space-y-2">
                    <div>
                      <p className="text-white/60 font-medium mb-1">Formatos aceitos</p>
                      <p>• Imagens: PNG, JPG e WebP</p>
                      <p>• Vídeos: MP4 e MOV</p>
                    </div>
                    <div>
                      <p className="text-white/60 font-medium mb-1">Dimensões</p>
                      <p>• Duração máxima: 3 minutos</p>
                      <p>• Tamanho máximo: 4 GB</p>
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSelect('library')}
                className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <div className="p-3 rounded-lg bg-white/10">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Biblioteca</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full text-xs text-white/40 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="min-w-[280px] p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Cole a URL do Youtube Shorts aqui"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-8 text-xs bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLinkSubmit()
                  if (e.key === 'Escape') {
                    setShowUrlInput(false)
                    setUrl("")
                  }
                }}
                autoFocus
              />
              <Button 
                size="sm"
                onClick={handleLinkSubmit}
                className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">
              Pressione Enter para confirmar ou Esc para cancelar • Apenas Youtube Shorts
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 