import * as THREE from 'three'
import { getRootSpecs, getToothAnatomy, type ToothType } from '@/lib/tooth-anatomy'

type Key = readonly [number, number]

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x
}

function smoothstep(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/** Interpolacion suave entre puntos de control [v, valor] */
function profileAt(v: number, keys: readonly Key[]): number {
  if (v <= keys[0][0]) return keys[0][1]
  const last = keys[keys.length - 1]
  if (v >= last[0]) return last[1]
  for (let i = 0; i < keys.length - 1; i++) {
    const [v0, a] = keys[i]
    const [v1, b] = keys[i + 1]
    if (v >= v0 && v <= v1) return a + (b - a) * smoothstep((v - v0) / (v1 - v0))
  }
  return last[1]
}

function bump(du: number, dw: number, sigma: number) {
  return Math.exp(-(du * du + dw * dw) / (2 * sigma * sigma))
}

/**
 * Relieve oclusal/incisal en fraccion de la altura coronal.
 * u = eje mesiodistal normalizado, w = eje bucolingual normalizado (+ vestibular).
 */
type OcclusalFn = (u: number, w: number) => number

const molarOcclusal: OcclusalFn = (u, w) => {
  // 4 cuspides: mesiovestibular, distovestibular, mesiolingual, distolingual
  let h =
    0.2 * bump(u + 0.5, w - 0.52, 0.44) +
    0.17 * bump(u - 0.5, w - 0.5, 0.44) +
    0.19 * bump(u + 0.48, w + 0.52, 0.44) +
    0.14 * bump(u - 0.5, w + 0.5, 0.42)
  // fosa central
  h -= 0.15 * bump(u, w, 0.38)
  // surco central mesiodistal
  h -= 0.06 * Math.exp(-(w * w) / 0.036) * Math.max(0, 1 - u * u)
  // surco vestibular
  h -= 0.04 * Math.exp(-(u * u) / 0.036) * Math.max(0, 1 - w * w)
  return h - 0.03
}

const premolarOcclusal: OcclusalFn = (u, w) => {
  let h = 0.3 * bump(u, w - 0.48, 0.5) + 0.21 * bump(u, w + 0.46, 0.46)
  h -= 0.11 * Math.exp(-(w * w) / 0.05) * Math.max(0, 1 - u * u * 0.8)
  h -= 0.05 * bump(u, w, 0.34)
  return h - 0.02
}

const canineOcclusal: OcclusalFn = (u, w) => {
  // cuspide unica ligeramente mesial + rebordes marginales
  let h = 0.24 * bump(u + 0.06, w - 0.08, 0.44)
  h -= 0.05 * bump(u, w + 0.65, 0.3)
  return h - 0.02
}

const incisorOcclusal: OcclusalFn = (u, w) => {
  // borde incisal recto con angulos redondeados y mamelones tenues
  const corners = -0.11 * Math.pow(Math.abs(u), 3.4)
  const mamelons = 0.02 * Math.max(0, Math.cos(3 * Math.PI * u)) * Math.exp(-(w * w) / 0.5)
  const lingualSlope = -0.05 * Math.max(0, -w)
  return corners + mamelons + lingualSlope
}

interface CrownShape {
  /** 2 = elipse, >2 = seccion mas cuadrada */
  squareness: number
  /** perfil mesiodistal a lo largo del eje cervico-oclusal */
  sx: readonly Key[]
  /** perfil bucolingual */
  sz: readonly Key[]
  /** abultamiento del cingulo lingual (0 = sin cingulo) */
  cingulum: number
  /** convexidad vestibular extra en el tercio cervical */
  buccalRidge: number
  occlusal: OcclusalFn
}

const SHAPES: Record<ToothType, CrownShape> = {
  molar: {
    squareness: 3.0,
    sx: [
      [0, 0.84],
      [0.35, 1],
      [0.72, 0.99],
      [1, 0.9],
    ],
    sz: [
      [0, 0.82],
      [0.35, 1],
      [0.72, 0.98],
      [1, 0.88],
    ],
    cingulum: 0,
    buccalRidge: 0.05,
    occlusal: molarOcclusal,
  },
  premolar: {
    squareness: 2.5,
    sx: [
      [0, 0.8],
      [0.42, 1],
      [1, 0.85],
    ],
    sz: [
      [0, 0.78],
      [0.4, 1],
      [1, 0.9],
    ],
    cingulum: 0.06,
    buccalRidge: 0.08,
    occlusal: premolarOcclusal,
  },
  canine: {
    squareness: 2.2,
    sx: [
      [0, 0.6],
      [0.45, 1],
      [0.8, 0.85],
      [1, 0.46],
    ],
    sz: [
      [0, 0.72],
      [0.35, 1],
      [0.8, 0.78],
      [1, 0.42],
    ],
    cingulum: 0.26,
    buccalRidge: 0.12,
    occlusal: canineOcclusal,
  },
  incisor: {
    squareness: 2.5,
    sx: [
      [0, 0.6],
      [0.55, 1],
      [1, 0.93],
    ],
    sz: [
      [0, 0.78],
      [0.3, 1],
      [0.72, 0.7],
      [1, 0.32],
    ],
    cingulum: 0.3,
    buccalRidge: 0.06,
    occlusal: incisorOcclusal,
  },
}

/** Esmalte: cervical mas saturado, incisal mas translucido */
const CERVICAL_TINT = new THREE.Color('#eadbb8')
const BODY_TINT = new THREE.Color('#f7f0e2')
const INCISAL_TINT = new THREE.Color('#eff1f0')

function crownColorAt(v: number, target: THREE.Color) {
  if (v < 0.55) {
    target.copy(CERVICAL_TINT).lerp(BODY_TINT, smoothstep(v / 0.55))
  } else {
    target.copy(BODY_TINT).lerp(INCISAL_TINT, smoothstep((v - 0.55) / 0.45))
  }
}

const ROOT_NECK = new THREE.Color('#e7d7b6')
const ROOT_APEX = new THREE.Color('#c0a780')

const RADIAL = 40
const LEVELS = 24
const CAP_RINGS = 6

/**
 * Corona generada por loft: secciones superelipticas apiladas desde el cuello
 * hasta la cara oclusal, con relieve cuspideo real.
 */
function buildCrownGeometry(type: ToothType, width: number, depth: number, height: number) {
  const shape = SHAPES[type]
  const halfW = width / 2
  const halfD = depth / 2
  const exponent = 2 / shape.squareness

  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const color = new THREE.Color()

  const contour = (v: number, theta: number): [number, number] => {
    const a = halfW * profileAt(v, shape.sx)
    const b = halfD * profileAt(v, shape.sz)
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), exponent)
    let z = b * Math.sign(s) * Math.pow(Math.abs(s), exponent)

    if (shape.cingulum > 0 && z < 0) {
      const lingual = Math.min(1, -z / b)
      const cervical = Math.exp(-Math.pow((v - 0.22) / 0.18, 2))
      z -= b * shape.cingulum * cervical * lingual
    }
    if (shape.buccalRidge > 0 && z > 0) {
      const buccal = Math.min(1, z / b)
      const cervical = Math.exp(-Math.pow((v - 0.3) / 0.26, 2))
      z += b * shape.buccalRidge * cervical * buccal
    }
    return [x, z]
  }

  const heightAt = (x: number, z: number, v: number) => {
    const blend = smoothstep((v - 0.68) / 0.32)
    return height * v + height * shape.occlusal(x / halfW, z / halfD) * blend
  }

  // Pared lateral
  for (let i = 0; i <= LEVELS; i++) {
    const v = i / LEVELS
    crownColorAt(v, color)
    for (let j = 0; j <= RADIAL; j++) {
      const theta = (j / RADIAL) * Math.PI * 2
      const [x, z] = contour(v, theta)
      positions.push(x, heightAt(x, z, v), z)
      colors.push(color.r, color.g, color.b)
    }
  }

  const row = RADIAL + 1
  for (let i = 0; i < LEVELS; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * row + j
      const b = a + 1
      const c = a + row
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  // Cara oclusal / borde incisal
  const rim: [number, number][] = []
  for (let j = 0; j <= RADIAL; j++) rim.push(contour(1, (j / RADIAL) * Math.PI * 2))

  crownColorAt(1, color)
  let outerStart = LEVELS * row
  for (let k = 1; k < CAP_RINGS; k++) {
    const f = 1 - k / CAP_RINGS
    const ringStart = positions.length / 3
    for (let j = 0; j <= RADIAL; j++) {
      const x = rim[j][0] * f
      const z = rim[j][1] * f
      positions.push(x, heightAt(x, z, 1), z)
      colors.push(color.r, color.g, color.b)
    }
    for (let j = 0; j < RADIAL; j++) {
      const o = outerStart + j
      const inner = ringStart + j
      indices.push(o, inner, o + 1, o + 1, inner, inner + 1)
    }
    outerStart = ringStart
  }
  const topCenter = positions.length / 3
  positions.push(0, heightAt(0, 0, 1), 0)
  colors.push(color.r, color.g, color.b)
  for (let j = 0; j < RADIAL; j++) {
    indices.push(outerStart + j, topCenter, outerStart + j + 1)
  }

  // Cierre cervical (queda oculto por la raiz)
  const neck: [number, number][] = []
  for (let j = 0; j <= RADIAL; j++) neck.push(contour(0, (j / RADIAL) * Math.PI * 2))

  crownColorAt(0, color)
  let neckOuter = 0
  for (let k = 1; k < CAP_RINGS; k++) {
    const f = 1 - k / CAP_RINGS
    const ringStart = positions.length / 3
    for (let j = 0; j <= RADIAL; j++) {
      positions.push(neck[j][0] * f, -height * 0.05 * (1 - f * f), neck[j][1] * f)
      colors.push(color.r, color.g, color.b)
    }
    for (let j = 0; j < RADIAL; j++) {
      const o = neckOuter + j
      const inner = ringStart + j
      indices.push(o, o + 1, inner, o + 1, inner + 1, inner)
    }
    neckOuter = ringStart
  }
  const bottomCenter = positions.length / 3
  positions.push(0, -height * 0.05, 0)
  colors.push(color.r, color.g, color.b)
  for (let j = 0; j < RADIAL; j++) {
    indices.push(neckOuter + j, neckOuter + j + 1, bottomCenter)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

const ROOT_TAPER: readonly Key[] = [
  [0, 1],
  [0.12, 0.98],
  [0.45, 0.82],
  [0.75, 0.56],
  [0.92, 0.29],
  [1, 0.03],
]

const ROOT_RADIAL = 22
const ROOT_LEVELS = 18

/** Raiz conica curvada hacia apical, con estrechamiento progresivo. */
function buildRootGeometry(
  length: number,
  rx: number,
  rz: number,
  bendX: number,
  bendZ: number,
  grooved: boolean,
) {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const color = new THREE.Color()

  for (let i = 0; i <= ROOT_LEVELS; i++) {
    const t = i / ROOT_LEVELS
    const taper = profileAt(t, ROOT_TAPER)
    const cx = bendX * t * t
    const cz = bendZ * t * t
    const y = -length * t
    color.copy(ROOT_NECK).lerp(ROOT_APEX, smoothstep(t * 1.1))

    for (let j = 0; j <= ROOT_RADIAL; j++) {
      const theta = (j / ROOT_RADIAL) * Math.PI * 2
      // surco radicular longitudinal en raices anchas
      const groove = grooved ? 1 - 0.16 * Math.pow(Math.abs(Math.sin(theta)), 6) : 1
      positions.push(
        cx + rx * taper * groove * Math.cos(theta),
        y,
        cz + rz * taper * groove * Math.sin(theta),
      )
      colors.push(color.r, color.g, color.b)
    }
  }

  const row = ROOT_RADIAL + 1
  for (let i = 0; i < ROOT_LEVELS; i++) {
    for (let j = 0; j < ROOT_RADIAL; j++) {
      const a = i * row + j
      const b = a + 1
      const c = a + row
      const d = c + 1
      indices.push(a, b, c, b, d, c)
    }
  }

  const apex = positions.length / 3
  positions.push(bendX, -length * 1.02, bendZ)
  colors.push(ROOT_APEX.r, ROOT_APEX.g, ROOT_APEX.b)
  const lastRow = ROOT_LEVELS * row
  for (let j = 0; j < ROOT_RADIAL; j++) {
    indices.push(lastRow + j, lastRow + j + 1, apex)
  }

  const neck = positions.length / 3
  positions.push(0, 0, 0)
  colors.push(ROOT_NECK.r, ROOT_NECK.g, ROOT_NECK.b)
  for (let j = 0; j < ROOT_RADIAL; j++) {
    indices.push(j + 1, j, neck)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export interface ToothGeometrySet {
  crown: THREE.BufferGeometry
  roots: { geometry: THREE.BufferGeometry; offset: [number, number, number] }[]
}

const cache = new Map<number, ToothGeometrySet>()

/** Geometrias cacheadas por pieza FDI (32 juegos como maximo). */
export function getToothGeometry(pieza: number): ToothGeometrySet {
  const cached = cache.get(pieza)
  if (cached) return cached

  const { type, md, bl, crownH } = getToothAnatomy(pieza)
  const crown = buildCrownGeometry(type, md, bl, crownH)
  const roots = getRootSpecs(pieza).map((spec) => ({
    geometry: buildRootGeometry(
      spec.length,
      spec.rx,
      spec.rz,
      spec.bend[0],
      spec.bend[1],
      type === 'molar' || type === 'premolar',
    ),
    offset: [spec.start[0], 0, spec.start[1]] as [number, number, number],
  }))

  const set: ToothGeometrySet = { crown, roots }
  cache.set(pieza, set)
  return set
}
