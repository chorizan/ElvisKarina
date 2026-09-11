import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  subtitle?: string
}

export function StatCard({ title, value, trend, subtitle }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {trend !== undefined && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-xs font-medium',
                isPositive ? 'text-green-600' : 'text-red-600',
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}
              {trend}%
            </div>
          )}
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function StatCardCurrency({ title, value, trend }: { title: string; value: number; trend?: number }) {
  return <StatCard title={title} value={formatCurrency(value)} trend={trend} />
}
