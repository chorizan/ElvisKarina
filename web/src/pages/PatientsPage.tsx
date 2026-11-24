import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePacientesStore } from '@/stores/pacientesStore'
import { formatDate } from '@/lib/utils'
import { useState, type FormEvent } from 'react'

export function PatientsPage() {
  const pacientes = usePacientesStore((s) => s.pacientes)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = pacientes.filter(
    (p) =>
      `${p.nombres} ${p.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
      p.dni?.includes(search) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pacientes</h2>
          <p className="text-muted-foreground">{pacientes.length} pacientes registrados</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, DNI o código..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Paciente</th>
                  <th className="px-4 py-3 text-left font-medium">DNI</th>
                  <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                  <th className="px-4 py-3 text-left font-medium">Última visita</th>
                  <th className="px-4 py-3 text-left font-medium">Alertas</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {p.nombres.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {p.nombres} {p.apellidos}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.codigo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.dni ?? '—'}</td>
                    <td className="px-4 py-3">{p.telefono ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.ultimaVisita ? formatDate(p.ultimaVisita) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.alergias && <Badge variant="danger">Alergia</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/pacientes/${p.id}`}>Ver perfil</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <NuevoPacienteDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  )
}

const vacio = {
  nombres: '',
  apellidos: '',
  dni: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  direccion: '',
  alergias: '',
  antecedentes: '',
}

function NuevoPacienteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const addPaciente = usePacientesStore((s) => s.addPaciente)
  const [f, setF] = useState(vacio)
  const [error, setError] = useState('')
  const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const cerrar = (o: boolean) => {
    if (!o) {
      setF(vacio)
      setError('')
    }
    onOpenChange(o)
  }

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    if (!f.nombres.trim() || !f.apellidos.trim()) {
      setError('Nombres y apellidos son obligatorios.')
      return
    }
    if (f.dni && !/^\d{8}$/.test(f.dni)) {
      setError('El DNI debe tener 8 dígitos.')
      return
    }
    const clean = Object.fromEntries(
      Object.entries(f).map(([k, v]) => [k, v.trim() || undefined]),
    ) as Omit<typeof vacio, never>
    addPaciente({ ...clean, nombres: f.nombres.trim(), apellidos: f.apellidos.trim() })
    cerrar(false)
  }

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={guardar} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nombres *</Label>
              <Input value={f.nombres} onChange={set('nombres')} />
            </div>
            <div>
              <Label>Apellidos *</Label>
              <Input value={f.apellidos} onChange={set('apellidos')} />
            </div>
            <div>
              <Label>DNI</Label>
              <Input inputMode="numeric" maxLength={8} value={f.dni} onChange={set('dni')} />
            </div>
            <div>
              <Label>Fecha de nacimiento</Label>
              <Input type="date" value={f.fechaNacimiento} onChange={set('fechaNacimiento')} />
            </div>
            <div>
              <Label>Género</Label>
              <Select value={f.genero} onChange={set('genero')}>
                <option value="">Seleccionar...</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </Select>
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={f.telefono} onChange={set('telefono')} />
            </div>
            <div className="sm:col-span-2">
              <Label>Email</Label>
              <Input type="email" value={f.email} onChange={set('email')} />
            </div>
            <div className="sm:col-span-2">
              <Label>Dirección</Label>
              <Input value={f.direccion} onChange={set('direccion')} />
            </div>
            <div>
              <Label>Alergias</Label>
              <Textarea value={f.alergias} onChange={set('alergias')} />
            </div>
            <div>
              <Label>Antecedentes</Label>
              <Textarea value={f.antecedentes} onChange={set('antecedentes')} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => cerrar(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar paciente</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
