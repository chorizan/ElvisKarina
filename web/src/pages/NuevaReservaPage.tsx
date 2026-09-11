import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Select } from '@/components/ui/input'
import { pacientes, usuarioActual } from '@/lib/mock-data'

export function NuevaReservaPage() {
  const navigate = useNavigate()

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
            <Select>
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
            <Select>
              <option>Consultorio 1</option>
              <option>Consultorio 2</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" />
            </div>
          </div>
          <div>
            <Label>Duración (min)</Label>
            <Select defaultValue="60">
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </Select>
          </div>
          <div>
            <Label>Motivo / Tratamiento</Label>
            <Input placeholder="Ej. Endodoncia, Evaluación..." />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link to="/agenda">Cancelar</Link>
            </Button>
            <Button onClick={() => navigate('/agenda')}>Guardar cita</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
