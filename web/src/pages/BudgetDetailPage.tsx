import { motion } from 'framer-motion'
import { FileDown, Send } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PresupuestoTable } from '@/components/budgets/PresupuestoTable'
import { Badge, presupuestoEstadoBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Textarea } from '@/components/ui/input'
import { clinica, getPaciente, getPresupuesto } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const presupuesto = getPresupuesto(id ?? '')
  const paciente = presupuesto ? getPaciente(presupuesto.pacienteId) : null

  if (!presupuesto || !paciente) {
    return <p>Presupuesto no encontrado.</p>
  }

  const estado = presupuestoEstadoBadge[presupuesto.estado]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{presupuesto.numero}</h2>
          <p className="text-muted-foreground">
            {paciente.nombres} {paciente.apellidos} · {formatDate(presupuesto.fecha)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={estado?.variant}>{estado?.label}</Badge>
          <Button variant="outline">
            <FileDown className="h-4 w-4" />
            Generar PDF
          </Button>
          <Button variant="outline">Generar folleto</Button>
          <Button>
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </div>
      </div>

      <PresupuestoTable
        detalles={presupuesto.detalles}
        descuento={presupuesto.descuento}
        adelanto={presupuesto.adelanto}
        editable
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <Label>Vigencia</Label>
              <Input type="date" defaultValue={presupuesto.vigencia?.split('T')[0]} />
            </div>
            <div>
              <Label>Cuotas</Label>
              <Input type="number" defaultValue={3} />
            </div>
            <div>
              <Label>Forma de pago</Label>
              <Input defaultValue="Efectivo / Tarjeta" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <Label>Observaciones</Label>
              <Textarea defaultValue={presupuesto.observaciones} placeholder="Condiciones del presupuesto..." />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Vista previa proforma</h3>
          <div className="rounded-lg border border-border bg-white p-8 text-slate-900 dark:bg-white">
            <div className="mb-6 text-center">
              <p className="text-lg font-bold">{clinica.nombre}</p>
              <p className="text-sm">{clinica.direccion}</p>
              <p className="mt-4 text-xl font-bold">PROFORMA {presupuesto.numero}</p>
            </div>
            <p className="mb-4 text-sm">
              Paciente: {paciente.nombres} {paciente.apellidos}
              <br />
              Fecha: {formatDate(presupuesto.fecha)}
            </p>
            <PresupuestoTable
              detalles={presupuesto.detalles}
              descuento={presupuesto.descuento}
              adelanto={presupuesto.adelanto}
            />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link to="/presupuestos">← Volver a presupuestos</Link>
      </Button>
    </motion.div>
  )
}
