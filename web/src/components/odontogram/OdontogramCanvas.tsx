import { useMemo } from 'react'
import {
  LOWER_LEFT,
  LOWER_RIGHT,
  SURFACES,
  UPPER_LEFT,
  UPPER_RIGHT,
  type Surface,
} from '@/lib/fdi'
import { TOOTH_STATES, type ToothStateKey } from '@/lib/tooth-states'
import type { OdontogramaEntrada } from '@/types/consultation'
import { cn } from '@/lib/utils'

const TOOTH_W = 72
const TOOTH_H = 120
const TOOTH_GAP = 8
const ARCH_W = 16 * (TOOTH_W + TOOTH_GAP)

interface OdontogramCanvasProps {
  entries: OdontogramaEntrada[]
  selectedTooth?: number | null
  onToothSelect: (pieza: number) => void
  className?: string
  fullSize?: boolean
}

function getDominantState(
  pieza: number,
  entries: OdontogramaEntrada[],
): ToothStateKey {
  const toothEntries = entries.filter((e) => e.pieza === pieza)
  if (toothEntries.length === 0) return 'sin_registro'
  return toothEntries[toothEntries.length - 1].diagnostico
}

function ToothUnit({
  pieza,
  entries,
  selected,
  onSelect,
}: {
  pieza: number
  entries: OdontogramaEntrada[]
  selected: boolean
  onSelect: (pieza: number) => void
}) {
  const state = getDominantState(pieza, entries)
  const color = TOOTH_STATES[state].color
  const toothEntries = entries.filter((e) => e.pieza === pieza)

  const surfaceColors = useMemo(() => {
    const map: Partial<Record<Surface, string>> = {}
    for (const e of toothEntries) {
      if (e.superficie) map[e.superficie] = TOOTH_STATES[e.diagnostico].color
    }
    return map
  }, [toothEntries])

  const cx = TOOTH_W / 2

  return (
    <g
      className="cursor-pointer transition-opacity hover:opacity-80"
      onClick={() => onSelect(pieza)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(pieza)}
    >
      <rect
        x={0}
        y={0}
        width={TOOTH_W}
        height={TOOTH_H}
        rx={8}
        fill="transparent"
        stroke={selected ? '#0ea5e9' : 'transparent'}
        strokeWidth={3}
      />
      <text
        x={cx}
        y={16}
        textAnchor="middle"
        className="fill-foreground text-[13px] font-bold"
      >
        {pieza}
      </text>
      <path
        d={`M${cx} 24 C${cx - 12} 24, ${cx - 16} 36, ${cx - 16} 48 C${cx - 16} 60, ${cx - 10} 66, ${cx} 66 C${cx + 10} 66, ${cx + 16} 60, ${cx + 16} 48 C${cx + 16} 36, ${cx + 12} 24, ${cx} 24 Z M${cx - 6} 66 L${cx - 6} 88 C${cx - 6} 94, ${cx - 2} 96, ${cx} 96 C${cx + 2} 96, ${cx + 6} 94, ${cx + 6} 88 L${cx + 6} 66`}
        fill={color}
        fillOpacity={0.35}
        stroke={color}
        strokeWidth={2}
      />
      <g transform={`translate(${cx - 22}, 72)`}>
        {SURFACES.map((s, i) => (
          <circle
            key={s}
            cx={i * 11 + 5}
            cy={10}
            r={5}
            fill={surfaceColors[s] ?? '#e2e8f0'}
            stroke="#94a3b8"
            strokeWidth={0.75}
          />
        ))}
        <text x={22} y={30} textAnchor="middle" className="fill-muted-foreground text-[8px]">
          D O M V P
        </text>
      </g>
    </g>
  )
}

function ArchRow({
  teeth,
  entries,
  selectedTooth,
  onToothSelect,
  label,
  fullSize,
}: {
  teeth: readonly number[]
  entries: OdontogramaEntrada[]
  selectedTooth?: number | null
  onToothSelect: (pieza: number) => void
  label: string
  fullSize?: boolean
}) {
  return (
    <div className={cn('flex flex-col', fullSize && 'min-h-0 flex-1')}>
      <p className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className={cn('flex min-h-0 flex-1 items-center justify-center', fullSize && 'w-full')}>
        <svg
          viewBox={`0 0 ${ARCH_W} ${TOOTH_H}`}
          className={cn(fullSize ? 'h-full w-full max-h-none' : 'w-full')}
          preserveAspectRatio="xMidYMid meet"
        >
          {teeth.map((pieza, i) => (
            <g key={pieza} transform={`translate(${i * (TOOTH_W + TOOTH_GAP)}, 0)`}>
              <ToothUnit
                pieza={pieza}
                entries={entries}
                selected={selectedTooth === pieza}
                onSelect={onToothSelect}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export function OdontogramCanvas({
  entries,
  selectedTooth,
  onToothSelect,
  className,
  fullSize = false,
}: OdontogramCanvasProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-border bg-card',
        fullSize ? 'h-full p-4' : 'p-6',
        className,
      )}
    >
      <div className={cn('flex flex-col', fullSize ? 'min-h-0 flex-1 gap-2' : 'gap-4')}>
        <ArchRow
          label="Arcada superior"
          teeth={[...UPPER_RIGHT, ...UPPER_LEFT]}
          entries={entries}
          selectedTooth={selectedTooth}
          onToothSelect={onToothSelect}
          fullSize={fullSize}
        />
        <div className="shrink-0 border-t border-dashed border-border" />
        <ArchRow
          label="Arcada inferior"
          teeth={[...LOWER_LEFT, ...LOWER_RIGHT]}
          entries={entries}
          selectedTooth={selectedTooth}
          onToothSelect={onToothSelect}
          fullSize={fullSize}
        />
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3">
        {Object.entries(TOOTH_STATES).map(([key, { color, label }]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
