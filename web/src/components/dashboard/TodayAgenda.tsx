import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { citas, getPaciente } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export function TodayAgenda() {
  const today = new Date()
  const todayCitas = citas
    .filter((c) => {
      const d = new Date(c.fechaInicio)
      return d.toDateString() === today.toDateString()
    })
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda de hoy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayCitas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay citas programadas para hoy.</p>
        ) : (
          todayCitas.map((cita) => {
            const paciente = getPaciente(cita.pacienteId)
            const hora = new Date(cita.fechaInicio).toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
            })
            return (
              <div
                key={cita.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <span className="text-sm font-semibold text-primary">{hora}</span>
                <div>
                  <p className="font-medium">
                    {paciente?.nombres} {paciente?.apellidos}
                  </p>
                  <p className="text-sm text-muted-foreground">{cita.tratamiento}</p>
                </div>
              </div>
            )
          })
        )}
        <p className="text-xs text-muted-foreground">{formatDate(today)}</p>
      </CardContent>
    </Card>
  )
}
