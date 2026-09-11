/**
 * Medidas dentales promedio (mm) segun anatomia dental humana adulta.
 * md = mesiodistal, bl = bucolingual, crownH = altura coronal, rootL = longitud radicular.
 */

export type ToothType = 'molar' | 'premolar' | 'canine' | 'incisor'

export interface ToothAnatomy {
  type: ToothType
  md: number
  bl: number
  crownH: number
  rootL: number
  roots: number
  isUpper: boolean
  position: number
}

/** 1 unidad de escena = ~27.8 mm */
export const MM = 0.036

interface RawAnatomy {
  md: number
  bl: number
  crownH: number
  rootL: number
  roots: number
}

const UPPER: Record<number, RawAnatomy> = {
  1: { md: 8.5, bl: 7.1, crownH: 10.5, rootL: 13.0, roots: 1 },
  2: { md: 6.6, bl: 6.2, crownH: 9.0, rootL: 13.0, roots: 1 },
  3: { md: 7.6, bl: 8.1, crownH: 10.0, rootL: 16.5, roots: 1 },
  4: { md: 7.1, bl: 9.2, crownH: 8.5, rootL: 13.5, roots: 2 },
  5: { md: 6.6, bl: 9.0, crownH: 8.5, rootL: 14.0, roots: 1 },
  6: { md: 10.0, bl: 11.0, crownH: 7.5, rootL: 13.0, roots: 3 },
  7: { md: 9.0, bl: 11.0, crownH: 7.0, rootL: 12.5, roots: 3 },
  8: { md: 8.5, bl: 10.0, crownH: 6.5, rootL: 11.0, roots: 3 },
}

const LOWER: Record<number, RawAnatomy> = {
  1: { md: 5.3, bl: 6.0, crownH: 9.0, rootL: 12.5, roots: 1 },
  2: { md: 5.7, bl: 6.5, crownH: 9.5, rootL: 14.0, roots: 1 },
  3: { md: 6.9, bl: 7.5, crownH: 11.0, rootL: 15.5, roots: 1 },
  4: { md: 7.1, bl: 7.5, crownH: 8.5, rootL: 14.0, roots: 1 },
  5: { md: 7.1, bl: 8.0, crownH: 8.0, rootL: 14.5, roots: 1 },
  6: { md: 11.0, bl: 10.5, crownH: 7.5, rootL: 14.0, roots: 2 },
  7: { md: 10.5, bl: 10.0, crownH: 7.0, rootL: 13.0, roots: 2 },
  8: { md: 10.0, bl: 9.5, crownH: 7.0, rootL: 11.0, roots: 2 },
}

export function getToothType(pieza: number): ToothType {
  const pos = pieza % 10
  if (pos >= 6) return 'molar'
  if (pos >= 4) return 'premolar'
  if (pos === 3) return 'canine'
  return 'incisor'
}

export function isUpperTooth(pieza: number): boolean {
  const quadrant = Math.floor(pieza / 10)
  return quadrant === 1 || quadrant === 2
}

/** Devuelve las medidas en unidades de escena (ya escaladas). */
export function getToothAnatomy(pieza: number): ToothAnatomy {
  const position = pieza % 10
  const isUpper = isUpperTooth(pieza)
  const raw = (isUpper ? UPPER : LOWER)[position] ?? UPPER[1]

  return {
    type: getToothType(pieza),
    md: raw.md * MM,
    bl: raw.bl * MM,
    crownH: raw.crownH * MM,
    rootL: raw.rootL * MM,
    roots: raw.roots,
    isUpper,
    position,
  }
}

export interface RootSpec {
  /** Desplazamiento del cuello radicular (x = mesiodistal, z = bucolingual) */
  start: [number, number]
  /** Desviacion del apice respecto al cuello */
  bend: [number, number]
  rx: number
  rz: number
  length: number
}

/**
 * Distribucion radicular real: molares superiores trirradiculares (2 vestibulares
 * + 1 palatina), molares inferiores birradiculares (mesial + distal),
 * primer premolar superior birradicular (vestibular + palatina).
 */
export function getRootSpecs(pieza: number): RootSpec[] {
  const { md, bl, rootL, roots, type } = getToothAnatomy(pieza)

  if (roots === 3) {
    return [
      {
        start: [-md * 0.16, bl * 0.14],
        bend: [-md * 0.16, bl * 0.12],
        rx: md * 0.19,
        rz: bl * 0.19,
        length: rootL,
      },
      {
        start: [md * 0.17, bl * 0.13],
        bend: [md * 0.18, bl * 0.1],
        rx: md * 0.18,
        rz: bl * 0.18,
        length: rootL * 0.94,
      },
      {
        start: [0, -bl * 0.18],
        bend: [0, -bl * 0.22],
        rx: md * 0.22,
        rz: bl * 0.22,
        length: rootL * 1.05,
      },
    ]
  }

  if (roots === 2 && type === 'molar') {
    return [
      {
        start: [-md * 0.24, 0],
        bend: [-md * 0.1, 0],
        rx: md * 0.19,
        rz: bl * 0.34,
        length: rootL,
      },
      {
        start: [md * 0.24, 0],
        bend: [md * 0.12, 0],
        rx: md * 0.18,
        rz: bl * 0.31,
        length: rootL * 0.92,
      },
    ]
  }

  if (roots === 2) {
    return [
      {
        start: [0, bl * 0.16],
        bend: [0, bl * 0.13],
        rx: md * 0.3,
        rz: bl * 0.17,
        length: rootL,
      },
      {
        start: [0, -bl * 0.16],
        bend: [0, -bl * 0.14],
        rx: md * 0.29,
        rz: bl * 0.16,
        length: rootL * 0.97,
      },
    ]
  }

  const bendZ = type === 'incisor' || type === 'canine' ? -bl * 0.1 : 0
  return [
    {
      start: [0, 0],
      bend: [md * 0.05, bendZ],
      rx: md * 0.34,
      rz: bl * 0.38,
      length: rootL,
    },
  ]
}
