import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge, presupuestoEstadoBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getPaciente, presupuestos } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export function BudgetsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Presupuestos</h2>
        <p className="text-muted-foreground">Cotizaciones y proformas de tratamiento</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Número</th>
                <th className="px-4 py-3 text-left font-medium">Paciente</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((p) => {
                const paciente = getPaciente(p.pacienteId)
                const estado = presupuestoEstadoBadge[p.estado]
                return (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.numero}</td>
                    <td className="px-4 py-3">
                      {paciente?.nombres} {paciente?.apellidos}
                    </td>
                    <td className="px-4 py-3">{formatDate(p.fecha)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(p.total)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={estado?.variant}>{estado?.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/presupuestos/${p.id}`}>Ver</Link>
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
