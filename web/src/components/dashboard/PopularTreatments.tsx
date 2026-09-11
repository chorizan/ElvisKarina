import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { popularTreatments } from '@/lib/mock-data'

const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7']

export function PopularTreatments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tratamientos populares</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={popularTreatments}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {popularTreatments.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {popularTreatments.map((t, i) => (
            <div key={t.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                {t.name}
              </div>
              <span className="text-muted-foreground">{t.value} pacientes</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
