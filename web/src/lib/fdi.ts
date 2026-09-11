export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11] as const
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28] as const
export const LOWER_LEFT = [48, 47, 46, 45, 44, 43, 42, 41] as const
export const LOWER_RIGHT = [31, 32, 33, 34, 35, 36, 37, 38] as const

export const ALL_TEETH = [
  ...UPPER_RIGHT,
  ...UPPER_LEFT,
  ...LOWER_LEFT,
  ...LOWER_RIGHT,
] as const

export type ToothNumber = (typeof ALL_TEETH)[number]

export const SURFACES = ['D', 'O', 'M', 'V', 'P'] as const
export type Surface = (typeof SURFACES)[number]

export function isValidTooth(n: number): n is ToothNumber {
  return (ALL_TEETH as readonly number[]).includes(n)
}
