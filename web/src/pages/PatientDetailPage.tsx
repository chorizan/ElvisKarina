import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, presupuestoEstadoBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getConsultasPaciente,
  getPaciente,
  getPresupuestosPaciente,
  getCitasPaciente,
} from '@/lib/mock-data'
import { calcAge, formatCurrency, formatDate } from '@/lib/utils'

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const paciente = getPaciente(id ?? '')
  const consultas = getConsultasPaciente(id ?? '')
  const presupuestos = getPresupuestosPaciente(id ?? '')
  const citas = getCitasPaciente(id ?? '')

  if (!paciente) {
    return <p>Paciente no encontrado.</p>
  }

  const proximaCita = citas
    .filter((c) => new Date(c.fechaInicio) > new Date())
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())[0]

  const ultimoPresupuesto = presupuestos[0]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/pacientes">
          <ArrowLeft className="h-4 w-4" />
          Volver a pacientes
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {paciente.nombres.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {paciente.nombres} {paciente.apellidos}
            </h2>
            <p className="text-muted-foreground">
              {paciente.dni && `DNI: ${paciente.dni} · `}
              {paciente.fechaNacimiento && `${calcAge(paciente.fechaNacimiento)} años · `}
              {paciente.codigo}
            </p>
            <p className="text-sm text-muted-foreground">
              {paciente.telefono} · {paciente.email}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/consultas/nueva?paciente=${paciente.id}`}>Nueva consulta</Link>
        </Button>
      </div>

      {paciente.alergias && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <strong>ALERGIA:</strong> {paciente.alergias}
        </div>
      )}

      <Tabs defaultValue="resumen">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="historial">Historial clínico</TabsTrigger>
          <TabsTrigger value="tratamientos">Tratamientos</TabsTrigger>
          <TabsTrigger value="presupuestos">Presupuestos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Próxima cita</p>
                <p className="mt-1 font-semibold">
                  {proximaCita
                    ? `${formatDate(proximaCita.fechaInicio)} · ${proximaCita.tratamiento}`
                    : 'Sin citas programadas'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Último presupuesto</p>
                <p className="mt-1 font-semibold">
                  {ultimoPresupuesto
                    ? `${ultimoPresupuesto.numero} · ${formatCurrency(ultimoPresupuesto.total)}`
                    : 'Sin presupuestos'}
                </p>
                {ultimoPresupuesto && (
                  <Badge variant={presupuestoEstadoBadge[ultimoPresupuesto.estado]?.variant} className="mt-2">
                    {presupuestoEstadoBadge[ultimoPresupuesto.estado]?.label}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
          {paciente.antecedentes && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium">Antecedentes</p>
                <p className="mt-1 text-sm text-muted-foreground">{paciente.antecedentes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardContent className="space-y-4 p-4">
              {consultas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin consultas registradas.</p>
              ) : (
                consultas.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{formatDate(c.fecha)}</p>
                      <p className="text-sm text-muted-foreground">{c.motivo}</p>
                    </div>
                    <Badge variant={c.estado === 'completada' ? 'success' : 'info'}>
                      {c.estado === 'completada' ? 'Completada' : 'En curso'}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tratamientos">
          <Card>
            <CardContent className="p-4">
              {consultas.flatMap((c) => c.odontograma.filter((o) => o.enTratamiento)).length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin tratamientos activos.</p>
              ) : (
                consultas.flatMap((c) =>
                  c.odontograma
                    .filter((o) => o.enTratamiento)
                    .map((o) => (
                      <div key={o.id} className="mb-3 rounded-lg border border-border p-3">
                        <p className="font-medium capitalize">
                          {o.tratamiento?.replace('_', ' ')} — Pieza {o.pieza}
                        </p>
                        <p className="text-sm text-muted-foreground">Prioridad: {o.prioridad}</p>
                      </div>
                    )),
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presupuestos">
          <Card>
            <CardContent className="p-4">
              {presupuestos.map((p) => (
                <div key={p.id} className="mb-3 flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{p.numero}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(p.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(p.total)}</p>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary" asChild>
                      <Link to={`/presupuestos/${p.id}`}>Ver</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
