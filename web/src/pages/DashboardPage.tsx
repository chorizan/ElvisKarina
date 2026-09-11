import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { PopularTreatments } from '@/components/dashboard/PopularTreatments'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { StatCard, StatCardCurrency } from '@/components/dashboard/StatCard'
import { TodayAgenda } from '@/components/dashboard/TodayAgenda'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardStats } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export function DashboardPage() {
  const today = formatDate(new Date())

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Buenos días, Dr. Juan</h2>
        <p className="text-muted-foreground">{today}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Citas de hoy" value={dashboardStats.citasHoy} />
        <StatCard
          title="Pacientes atendidos (mes)"
          value={dashboardStats.pacientesAtendidos}
          trend={dashboardStats.pacientesAtendidosTrend}
        />
        <StatCard title="Citas pendientes" value={dashboardStats.citasPendientes} />
        <StatCardCurrency
          title="Ingresos del mes"
          value={dashboardStats.ingresosMes}
          trend={dashboardStats.ingresosTrend}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Presupuestos emitidos" value={dashboardStats.presupuestosEmitidos} />
        <StatCard title="Presupuestos aceptados" value={dashboardStats.presupuestosAceptados} />
        <StatCard title="Tratamientos en curso" value={dashboardStats.tratamientosEnCurso} />
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
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-900/20">
              3 presupuestos sin respuesta (vencen esta semana)
            </div>
            <div className="rounded-lg border border-border p-3 text-sm">
              2 citas sin confirmar para mañana
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-900/20">
              Paciente Juan Pérez — alergia a Penicilina (cita hoy 09:00)
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
