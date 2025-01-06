"use client"

import { Link, Upload, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaOptionsProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: 'link' | 'file' | 'library') => void
  className?: string
}

export function MediaOptions({ isOpen, onClose, onSelect, className }: MediaOptionsProps) {
  if (!isOpen) return null

  const options = [
    { id: 'link', label: 'Link', icon: Link },
    { id: 'file', label: 'Arquivo', icon: Upload },
    { id: 'library', label: 'Biblioteca', icon: FolderOpen },
  ] as const

  return (
    <div 
      className={cn(
        "absolute left-1/2 -translate-x-1/2 bottom-full mb-4 bg-background rounded-full shadow-lg border animate-in zoom-in-90 duration-200",
        className
      )}
    >
      <div className="relative">
        {/* Options */}
        <div className="flex items-center gap-2 p-1">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-muted transition-colors"
            >
              <option.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-background border-r border-b" />
      </div>
    </div>
  )
} 