import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <Card>
        <CardContent className="flex h-48 items-center justify-center p-6">
          <p className="text-center text-sm text-muted-foreground">
            Módulo en desarrollo — disponible en próximas fases.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
