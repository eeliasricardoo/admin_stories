import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { motion } from "framer-motion"

export function StoriesEmptyState() {
  const router = useRouter()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center flex-1 min-h-[400px] rounded-lg border-2 border-dashed border-muted"
    >
      <div className="flex flex-col items-center space-y-6 max-w-[420px] text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2
          }}
        >
          <Image
            src="/empty-stories.svg"
            alt="Três cartões em branco representando um storyboard"
            width={200}
            height={160}
            className="opacity-80 drop-shadow-xl"
            priority
          />
        </motion.div>
        
        <div className="space-y-2">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold tracking-tight"
          >
            Nenhum storyboard encontrado
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Crie seu primeiro storyboard para engajar seus clientes com conteúdo exclusivo
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Button 
            className="gap-2 h-10 px-6"
            onClick={() => router.push("/admin_stories/create")}
          >
            <PlusCircle className="h-4 w-4" />
            CRIAR MEU PRIMEIRO STORYBOARD
          </Button>
          <p className="text-xs text-muted-foreground px-8">
            Você pode criar storyboards com imagens, vídeos e textos para compartilhar novidades, promoções e muito mais
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
} 