import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { catalogo } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export function CatalogPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Catálogo de precios</h2>
        <p className="text-muted-foreground">Tratamientos y tarifas de la clínica</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Código</th>
                <th className="px-4 py-3 text-left font-medium">Tratamiento</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-right font-medium">Precio</th>
                <th className="px-4 py-3 text-center font-medium">Duración</th>
              </tr>
            </thead>
            <tbody>
              {catalogo.map((t) => (
                <tr key={t.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{t.codigo}</td>
                  <td className="px-4 py-3 font-medium">{t.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.categoria}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {formatCurrency(t.precioBase)}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {t.duracionMin ? `${t.duracionMin} min` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
