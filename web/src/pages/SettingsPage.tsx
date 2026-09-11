import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setNombre(clinica.nombre)
    setDireccion(clinica.direccion)
    setTelefono(clinica.telefono)
  }, [clinica])

  const handleSave = () => {
    updateClinica({ nombre, direccion, telefono })
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
                <Button onClick={handleSave} disabled={!hasChanges}>
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
                Gestión de usuarios disponible en fase backend (NestJS + SQLite).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">
                Exporta e importa backups de la base de datos local.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Exportar backup</Button>
                <Button variant="outline">Restaurar backup</Button>
              </div>
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
