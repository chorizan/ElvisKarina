import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { consultas, getPaciente } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export function ConsultationsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Consultas</h2>
          <p className="text-muted-foreground">Historial de consultas odontológicas</p>
        </div>
        <Button asChild>
          <Link to="/consultas/nueva">
            <Plus className="h-4 w-4" />
            Nueva consulta
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Paciente</th>
                <th className="px-4 py-3 text-left font-medium">Motivo</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((c) => {
                const paciente = getPaciente(c.pacienteId)
                return (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">{formatDate(c.fecha)}</td>
                    <td className="px-4 py-3">
                      {paciente?.nombres} {paciente?.apellidos}
                    </td>
                    <td className="px-4 py-3">{c.motivo ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.estado === 'completada' ? 'success' : 'info'}>
                        {c.estado === 'completada' ? 'Completada' : 'En curso'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/odontograma?consulta=${c.id}`}>Odontograma</Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
