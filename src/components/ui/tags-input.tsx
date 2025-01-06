"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown, Plus } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Tag {
  id: string
  label: string
}

interface TagsInputProps {
  value: Tag[]
  onChange: (tags: Tag[]) => void
  availableTags: Tag[]
  onCreateTag?: (label: string) => void
}

export function TagsInput({ value, onChange, availableTags, onCreateTag }: TagsInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const selectedTags = new Set(value.map(tag => tag.id))

  const handleSelect = (currentValue: string) => {
    const selectedTag = availableTags.find(tag => tag.label.toLowerCase() === currentValue.toLowerCase())
    
    if (selectedTag) {
      onChange(
        selectedTags.has(selectedTag.id)
          ? value.filter(tag => tag.id !== selectedTag.id)
          : [...value, selectedTag]
      )
    }
  }

  const handleUnselect = (tagToRemove: Tag) => {
    onChange(value.filter(tag => tag.id !== tagToRemove.id))
  }

  const handleCreateTag = (label: string) => {
    if (onCreateTag) {
      onCreateTag(label)
      setInputValue("")
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between hover:bg-muted/50"
          >
            <span className="text-muted-foreground">
              {value.length === 0 ? "Selecionar tags..." : `${value.length} tag${value.length !== 1 ? 's' : ''} selecionada${value.length !== 1 ? 's' : ''}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Buscar ou criar tag..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty className="py-2 px-4 text-sm">
                {inputValue && onCreateTag ? (
                  <button
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCreateTag(inputValue)}
                  >
                    <Plus className="h-4 w-4" />
                    Criar tag "{inputValue}"
                  </button>
                ) : (
                  "Nenhuma tag encontrada."
                )}
              </CommandEmpty>
              <CommandGroup>
                {availableTags
                  .filter(tag => 
                    tag.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.label}
                      onSelect={handleSelect}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedTags.has(tag.id) ? "bg-primary text-primary-foreground" : "opacity-50"
                        )}>
                          {selectedTags.has(tag.id) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span>{tag.label}</span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1 hover:bg-secondary/80"
            >
              {tag.label}
              <button
                className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                onClick={() => handleUnselect(tag)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 