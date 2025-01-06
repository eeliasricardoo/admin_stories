"use client"

import { useRef, useEffect } from "react"
import { Facebook, Twitter, Linkedin, Link2, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ShareMenuProps {
  url: string
  title: string
  onClose: () => void
}

const SHARE_OPTIONS = [
  {
    name: 'Facebook',
    icon: Facebook,
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`
  },
  {
    name: 'Twitter',
    icon: Twitter,
    getUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?text=${title}&url=${url}`
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    getUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  }
] as const

export function ShareMenu({ url, title, onClose }: ShareMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleShare = (e: React.MouseEvent, getUrl: (url: string, title: string) => string) => {
    e.stopPropagation()
    window.open(getUrl(url, title), '_blank')
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      // Você pode adicionar um toast aqui
      alert('Link copiado!')
    } catch (err) {
      console.error('Falha ao copiar:', err)
    }
  }

  return (
    <div 
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "bg-zinc-900 rounded-xl shadow-xl p-2 min-w-[240px]",
        "animate-in slide-in-from-bottom-2 duration-200"
      )}
    >
      <header className="flex items-center justify-between px-2 py-1 border-b border-zinc-800">
        <span className="text-xs font-medium text-zinc-400">Compartilhar</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-zinc-400 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </header>
      
      <div className="p-1 space-y-1">
        {SHARE_OPTIONS.map(({ name, icon: Icon, getUrl }) => (
          <button
            key={name}
            onClick={(e) => handleShare(e, getUrl)}
            className={cn(
              "flex items-center gap-3 w-full px-2 py-1.5",
              "text-sm text-zinc-300 hover:text-white",
              "hover:bg-zinc-800/50 rounded-lg transition-colors"
            )}
          >
            <Icon className="h-4 w-4" />
            {name}
          </button>
        ))}
        
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex items-center gap-3 w-full px-2 py-1.5",
            "text-sm text-zinc-300 hover:text-white",
            "hover:bg-zinc-800/50 rounded-lg transition-colors"
          )}
        >
          <Link2 className="h-4 w-4" />
          Copiar Link
        </button>
      </div>
    </div>
  )
} 