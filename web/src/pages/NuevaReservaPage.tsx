import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Select } from '@/components/ui/input'
import { usuarioActual } from '@/lib/mock-data'
import { usePacientesStore } from '@/stores/pacientesStore'
import { useCitasStore } from '@/stores/citasStore'

export function NuevaReservaPage() {
  const navigate = useNavigate()
  const pacientes = usePacientesStore((s) => s.pacientes)
  const addCita = useCitasStore((s) => s.addCita)
  const [pacienteId, setPacienteId] = useState('')
  const [consultorio, setConsultorio] = useState('Consultorio 1')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [duracion, setDuracion] = useState('60')
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  const guardar = () => {
    if (!pacienteId || !fecha || !hora) {
      setError('Selecciona paciente, fecha y hora.')
      return
    }
    const inicio = new Date(`${fecha}T${hora}`)
    const fin = new Date(inicio.getTime() + Number(duracion) * 60000)
    addCita({
      pacienteId,
      odontologoId: usuarioActual.id,
      consultorio,
      fechaInicio: inicio.toISOString(),
      fechaFin: fin.toISOString(),
      tratamiento: motivo.trim() || 'Consulta',
      motivo: motivo.trim() || undefined,
      estado: 'programada',
    })
    navigate('/agenda')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nueva reserva</h2>
        <p className="text-muted-foreground">Programar cita para un paciente</p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>Paciente</Label>
            <Select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
              <option value="">Seleccionar paciente...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombres} {p.apellidos}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Odontólogo</Label>
            <Input defaultValue={usuarioActual.nombre} readOnly />
          </div>
          <div>
            <Label>Consultorio</Label>
            <Select value={consultorio} onChange={(e) => setConsultorio(e.target.value)}>
              <option>Consultorio 1</option>
              <option>Consultorio 2</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Duración (min)</Label>
            <Select value={duracion} onChange={(e) => setDuracion(e.target.value)}>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </Select>
          </div>
          <div>
            <Label>Motivo / Tratamiento</Label>
            <Input
              placeholder="Ej. Endodoncia, Evaluación..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link to="/agenda">Cancelar</Link>
            </Button>
            <Button onClick={guardar}>Guardar cita</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
