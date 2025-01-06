import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function StoriesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] rounded-lg border-2 border-dashed border-muted">
      <div className="flex flex-col items-center space-y-6 max-w-[420px] text-center">
        <Image
          src="/empty-stories.svg"
          alt="Três cartões em branco representando stories"
          width={200}
          height={160}
          className="opacity-80"
          priority
        />
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Crie seu primeiro storie
          </h3>
          <p className="text-sm text-muted-foreground">
            Crie, personalize e adicione seu chat onde você deseja
          </p>
        </div>

        <Button className="gap-2 h-10 px-4 py-2">
          <PlusCircle className="h-4 w-4" />
          CRIAR STORIES
        </Button>
      </div>
    </div>
  )
} 