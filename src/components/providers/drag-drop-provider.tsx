"use client"

import { ReactNode } from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./strict-mode-droppable"
import { cn } from "@/lib/utils"

interface DragDropProviderProps {
  children: ReactNode
  onDragEnd: (result: DropResult) => void
}

export function DragDropProvider({ children, onDragEnd }: DragDropProviderProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="stories" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="h-full px-8 flex items-center"
          >
            <div className="flex items-center gap-4">
              {children}
              {provided.placeholder}
            </div>
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
} 