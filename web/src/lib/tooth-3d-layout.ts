import { LOWER_LEFT, LOWER_RIGHT, UPPER_LEFT, UPPER_RIGHT } from '@/lib/fdi'
import { getToothAnatomy, getToothType, isUpperTooth, type ToothType } from '@/lib/tooth-anatomy'

export { getToothType, isUpperTooth }
export type { ToothType }

export const UPPER_ARCH = [...UPPER_RIGHT, ...UPPER_LEFT] as const
export const LOWER_ARCH = [...LOWER_LEFT, ...LOWER_RIGHT] as const
export const ALL_ARCH = [...UPPER_ARCH, ...LOWER_ARCH] as const

export interface ToothTransform {
  /** Posicion del cuello dentario (union corona-raiz) */
  position: [number, number, number]
  /** Giro alrededor del arco: alinea la cara vestibular hacia afuera */
  rotationY: number
  /** Inclinacion axial vestibulo-lingual (curva de Wilson) */
  tiltX: number
  isUpper: boolean
  type: ToothType
}

/** Separacion interproximal */
const CONTACT_GAP = 0.004
/** Profundidad de la curva de Spee */
const SPEE = 0.03
/** Separacion entre arcada superior e inferior (~6 mm) */
const INTERARCH_GAP = 0.22

const UPPER_TILT: Record<number, number> = {
  1: -0.16,
  2: -0.15,
  3: -0.11,
  4: -0.05,
  5: -0.04,
  6: -0.06,
  7: -0.08,
  8: -0.09,
}

const LOWER_TILT: Record<number, number> = {
  1: 0.05,
  2: 0.05,
  3: 0.03,
  4: -0.03,
  5: -0.05,
  6: -0.09,
  7: -0.12,
  8: -0.14,
}

function occlusalCurve(position: number) {
  const t = (position - 1) / 7
  return SPEE * t * t
}

interface ArchGeometry {
  semiX: number
  semiZ: number
  phi: number
  zCenter: number
  sampleXs: number[]
  sampleZs: number[]
  cumulative: number[]
  scale: number
}

const SAMPLES = 720

function buildArchCurve(order: readonly number[], isUpper: boolean): ArchGeometry {
  const totalWidth = order.reduce((sum, p) => sum + getToothAnatomy(p).md + CONTACT_GAP, 0)

  const baseX = 1
  const baseZ = isUpper ? 0.93 : 0.9
  const phi = Math.PI * (isUpper ? 0.6 : 0.58)

  const sampleXs: number[] = []
  const sampleZs: number[] = []
  const cumulative: number[] = [0]

  for (let i = 0; i <= SAMPLES; i++) {
    const th = -phi + 2 * phi * (i / SAMPLES)
    sampleXs.push(baseX * Math.sin(th))
    sampleZs.push(baseZ * Math.cos(th))
    if (i > 0) {
      cumulative.push(
        cumulative[i - 1] +
          Math.hypot(sampleXs[i] - sampleXs[i - 1], sampleZs[i] - sampleZs[i - 1]),
      )
    }
  }

  // La arcada inferior es algo menor para dar resalte (overjet)
  const scale = (totalWidth / cumulative[SAMPLES]) * (isUpper ? 1 : 0.94)
  const front = baseZ * scale
  const back = baseZ * Math.cos(phi) * scale
  const zCenter = -(front + back) / 2 + (isUpper ? 0 : -0.05)

  return {
    semiX: baseX * scale,
    semiZ: baseZ * scale,
    phi,
    zCenter,
    sampleXs,
    sampleZs,
    cumulative,
    scale,
  }
}

function pointAtArcLength(arch: ArchGeometry, distance: number) {
  const target = Math.min(Math.max(distance / arch.scale, 0), arch.cumulative[SAMPLES])

  let lo = 1
  let hi = SAMPLES
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arch.cumulative[mid] < target) lo = mid + 1
    else hi = mid
  }

  const i = lo
  const span = Math.max(1e-9, arch.cumulative[i] - arch.cumulative[i - 1])
  const t = (target - arch.cumulative[i - 1]) / span
  const th = -arch.phi + 2 * arch.phi * ((i - 1 + t) / SAMPLES)

  return {
    x: arch.semiX * Math.sin(th),
    z: arch.semiZ * Math.cos(th) + arch.zCenter,
    th,
  }
}

function layoutArch(order: readonly number[], isUpper: boolean) {
  const arch = buildArchCurve(order, isUpper)
  const result = new Map<number, ToothTransform>()

  let travelled = 0
  for (const pieza of order) {
    const anat = getToothAnatomy(pieza)
    const width = anat.md + CONTACT_GAP
    const { x, z, th } = pointAtArcLength(arch, travelled + width / 2)
    travelled += width

    // Normal exterior de la elipse: define hacia donde mira la cara vestibular
    const normalX = arch.semiZ * Math.sin(th)
    const normalZ = arch.semiX * Math.cos(th)

    // Boca entreabierta: cada arcada se aleja media separacion del plano oclusal
    const base = occlusalCurve(anat.position)
    const tipY = base + (isUpper ? INTERARCH_GAP / 2 : -INTERARCH_GAP / 2)
    const neckY = isUpper ? tipY + anat.crownH : tipY - anat.crownH

    result.set(pieza, {
      position: [x, neckY, z],
      rotationY: Math.atan2(normalX, normalZ),
      tiltX: (isUpper ? UPPER_TILT : LOWER_TILT)[anat.position] ?? 0,
      isUpper,
      type: anat.type,
    })
  }

  return result
}

const TRANSFORMS = new Map<number, ToothTransform>([
  ...layoutArch(UPPER_ARCH, true),
  ...layoutArch(LOWER_ARCH, false),
])

export function getToothTransform(pieza: number): ToothTransform | null {
  return TRANSFORMS.get(pieza) ?? null
}
