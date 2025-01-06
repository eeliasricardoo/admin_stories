"use client"

import { createContext, useState, ReactNode } from "react"

interface StoryContextType {
  showDraftDialog: boolean
  setShowDraftDialog: (show: boolean) => void
  showPublishDialog: boolean
  setShowPublishDialog: (show: boolean) => void
}

export const StoryContext = createContext<StoryContextType>({} as StoryContextType)

export function StoryProvider({ children }: { children: ReactNode }) {
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)

  return (
    <StoryContext.Provider 
      value={{ 
        showDraftDialog, 
        setShowDraftDialog,
        showPublishDialog,
        setShowPublishDialog
      }}
    >
      {children}
    </StoryContext.Provider>
  )
} 