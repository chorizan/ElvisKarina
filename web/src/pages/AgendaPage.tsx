import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AgendaCalendar } from '@/components/agenda/AgendaCalendar'
import { Button } from '@/components/ui/button'

export function AgendaPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agenda</h2>
          <p className="text-muted-foreground">Calendario de citas y reservas</p>
        </div>
        <Button asChild>
          <Link to="/reservas/nueva">
            <Plus className="h-4 w-4" />
            Nueva cita
          </Link>
        </Button>
      </div>
      <AgendaCalendar />
    </motion.div>
  )
}
