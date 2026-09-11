import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { pacientes } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

export function PatientsPage() {
  const [search, setSearch] = useState('')

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
        <Button asChild>
          <Link to="/pacientes/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo paciente
          </Link>
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
    </motion.div>
  )
}
