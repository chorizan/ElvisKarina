import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PopularTreatments } from '@/components/dashboard/PopularTreatments'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { StatCard, StatCardCurrency } from '@/components/dashboard/StatCard'
import { TodayAgenda } from '@/components/dashboard/TodayAgenda'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardStats, presupuestos, usuarioActual } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { useCitasStore } from '@/stores/citasStore'
import { useConsultasStore } from '@/stores/consultasStore'
import { usePacientesStore } from '@/stores/pacientesStore'

function saludo(hora: number) {
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const mismoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export function DashboardPage() {
  const now = new Date()
  const manana = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const citas = useCitasStore((s) => s.citas)
  const pacientes = usePacientesStore((s) => s.pacientes)
  const consultas = useConsultasStore((s) => s.consultas)

  const activas = citas.filter((c) => c.estado !== 'cancelada')
  const citasHoy = activas.filter((c) => mismoDia(new Date(c.fechaInicio), now))
  const citasPendientes = activas.filter(
    (c) => new Date(c.fechaInicio) > now && c.estado !== 'atendida' && c.estado !== 'no_asistio',
  )
  const sinConfirmarManana = activas.filter(
    (c) => mismoDia(new Date(c.fechaInicio), manana) && c.estado === 'programada',
  )
  const presupuestosPendientes = presupuestos.filter(
    (p) => p.estado === 'borrador' || p.estado === 'enviado',
  )
  const presupuestosAceptados = presupuestos.filter((p) => p.estado === 'aceptado')
  const tratamientosEnCurso = consultas.flatMap((c) => c.odontograma).filter((o) => o.enTratamiento)

  const alergiasHoy = citasHoy
    .map((c) => ({ cita: c, paciente: pacientes.find((p) => p.id === c.pacienteId) }))
    .filter((x) => x.paciente?.alergias)

  const nombre = usuarioActual.nombre.split(' ').slice(0, 2).join(' ')
  const hora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

  const sinAlertas =
    presupuestosPendientes.length === 0 && sinConfirmarManana.length === 0 && alergiasHoy.length === 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {saludo(now.getHours())}, {nombre}
        </h2>
        <p className="text-muted-foreground">{formatDate(now)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Citas de hoy" value={citasHoy.length} />
        <StatCard title="Pacientes registrados" value={pacientes.length} />
        <StatCard title="Citas pendientes" value={citasPendientes.length} />
        <StatCardCurrency
          title="Ingresos del mes"
          value={dashboardStats.ingresosMes}
          trend={dashboardStats.ingresosTrend}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Presupuestos emitidos" value={presupuestos.length} />
        <StatCard title="Presupuestos aceptados" value={presupuestosAceptados.length} />
        <StatCard title="Tratamientos en curso" value={tratamientosEnCurso.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayAgenda />
        <RevenueChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PopularTreatments />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alertas y recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sinAlertas && (
              <p className="text-sm text-muted-foreground">No hay alertas pendientes.</p>
            )}
            {presupuestosPendientes.length > 0 && (
              <Link
                to="/presupuestos"
                className="block rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm hover:underline dark:border-amber-900 dark:bg-amber-900/20"
              >
                {presupuestosPendientes.length} presupuesto(s) sin respuesta del paciente
              </Link>
            )}
            {sinConfirmarManana.length > 0 && (
              <Link
                to="/agenda"
                className="block rounded-lg border border-border p-3 text-sm hover:underline"
              >
                {sinConfirmarManana.length} cita(s) sin confirmar para mañana
              </Link>
            )}
            {alergiasHoy.map(({ cita, paciente }) => (
              <Link
                key={cita.id}
                to={`/pacientes/${paciente!.id}`}
                className="block rounded-lg border border-red-200 bg-red-50 p-3 text-sm hover:underline dark:border-red-900 dark:bg-red-900/20"
              >
                Paciente {paciente!.nombres} {paciente!.apellidos} — alergia a {paciente!.alergias}{' '}
                (cita hoy {hora(cita.fechaInicio)})
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
