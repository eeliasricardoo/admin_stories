"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "./settings-modal"
import { useState } from "react"

interface NavbarProps {
  onSaveAsDraft: () => void
  onPublish: () => void
}

export function Navbar({ onSaveAsDraft, onPublish }: NavbarProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  return (
    <div className="fixed top-0 right-0 left-[400px] h-16 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="h-full w-full px-8 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings2 className="h-4 w-4" />
            CONFIGURAÇÕES
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            className="font-medium text-base"
            onClick={onSaveAsDraft}
          >
            Salvar como rascunho
          </Button>

          <Button 
            size="sm"
            className="font-medium text-base"
            onClick={onPublish}
          >
            Publicar
          </Button>
        </div>
      </div>

      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </div>
  )
} 