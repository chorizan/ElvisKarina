import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { revenueData } from '@/lib/mock-data'

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="mes" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value) => [`S/ ${Number(value).toLocaleString('es-PE')}`, '']}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }}
            />
            <Legend />
            <Bar dataKey="ingresos" name="Ingresos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
