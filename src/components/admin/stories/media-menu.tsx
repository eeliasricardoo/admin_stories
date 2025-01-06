"use client"

import { useEffect, useRef, useState } from "react"
import { Link, Upload, FolderOpen, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MediaMenuProps {
  onSelect: (type: 'link' | 'file' | 'library', data?: string) => void
  onClose: () => void
}

export function MediaMenu({ onSelect, onClose }: MediaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState("")

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleLinkSubmit = () => {
    if (url.trim()) {
      onSelect('link', url.trim())
      setUrl("")
      setShowUrlInput(false)
    }
  }

  return (
    <div 
      ref={menuRef}
      className="absolute top-[55%] left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-zinc-900 rounded-xl shadow-xl">
        {!showUrlInput ? (
          <div className="flex items-center justify-between min-w-[280px] px-8 py-4">
            <button
              onClick={() => setShowUrlInput(true)}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Link className="h-5 w-5" />
              <span className="text-xs font-medium">Link</span>
            </button>

            <button
              onClick={() => onSelect('file')}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs font-medium">Arquivo</span>
            </button>

            <button
              onClick={() => onSelect('library')}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <FolderOpen className="h-5 w-5" />
              <span className="text-xs font-medium">Biblioteca</span>
            </button>
          </div>
        ) : (
          <div className="min-w-[280px] p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Cole a URL aqui"
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
              Pressione Enter para confirmar ou Esc para cancelar
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 