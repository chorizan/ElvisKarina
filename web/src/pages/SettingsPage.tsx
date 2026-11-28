import { motion } from 'framer-motion'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUIStore } from '@/stores/uiStore'

export function SettingsPage() {
  const { darkMode, toggleDarkMode } = useUIStore()
  const { clinica, updateClinica } = useSettingsStore()

  const [nombre, setNombre] = useState(clinica.nombre)
  const [direccion, setDireccion] = useState(clinica.direccion)
  const [telefono, setTelefono] = useState(clinica.telefono)
  const [saved, setSaved] = useState(false)

  const [backupMsg, setBackupMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Claves de localStorage donde la app guarda sus datos
  const BACKUP_KEYS = ['dental-pacientes', 'dental-citas', 'dental-consultas', 'dental-settings', 'dental-ui']

  const exportarBackup = () => {
    const data: Record<string, unknown> = { version: 1, fecha: new Date().toISOString() }
    for (const k of BACKUP_KEYS) {
      const v = localStorage.getItem(k)
      if (v) data[k] = JSON.parse(v)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dental-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setBackupMsg('Backup exportado.')
  }

  const restaurarBackup = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown>
      const keys = BACKUP_KEYS.filter((k) => k in data)
      if (keys.length === 0) throw new Error('vacío')
      if (!window.confirm('Esto reemplazará los datos actuales por los del backup. ¿Continuar?')) return
      for (const k of keys) localStorage.setItem(k, JSON.stringify(data[k]))
      window.location.reload()
    } catch {
      setBackupMsg('El archivo no es un backup válido.')
    }
  }

  const handleSave = () => {
    updateClinica({ nombre: nombre.trim(), direccion: direccion.trim(), telefono: telefono.trim() })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  const hasChanges =
    nombre !== clinica.nombre ||
    direccion !== clinica.direccion ||
    telefono !== clinica.telefono

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground">Ajustes de la clínica y del sistema</p>
      </div>

      <Tabs defaultValue="clinica">
        <TabsList>
          <TabsTrigger value="clinica">Clínica</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="clinica">
          <Card>
            <CardHeader>
              <CardTitle>Datos de la clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clinica-nombre">Nombre</Label>
                <Input
                  id="clinica-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clinica-direccion">Dirección</Label>
                <Input
                  id="clinica-direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clinica-telefono">Teléfono</Label>
                <Input
                  id="clinica-telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleSave} disabled={!hasChanges || !nombre.trim()}>
                  Guardar cambios
                </Button>
                {saved && (
                  <p className="text-sm font-medium text-emerald-600">Cambios guardados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Gestión de usuarios disponible cuando se conecte el backend.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">
                Los datos se guardan en este navegador. Exporta un backup (pacientes, citas,
                consultas y configuración) para no perderlos o llevarlos a otro equipo.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportarBackup}>
                  Exportar backup
                </Button>
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  Restaurar backup
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={restaurarBackup}
                />
              </div>
              {backupMsg && <p className="text-sm text-muted-foreground">{backupMsg}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo oscuro</p>
                  <p className="text-sm text-muted-foreground">Cambiar tema de la interfaz</p>
                </div>
                <Button variant="outline" onClick={toggleDarkMode}>
                  {darkMode ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
