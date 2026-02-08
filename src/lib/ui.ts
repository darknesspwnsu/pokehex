import { hexToRgb, relativeLuminance } from './color'

export const formatDex = (id: number) => id.toString().padStart(3, '0')

export const getContrastColor = (hex: string) => {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return '#0B0D11'
  }

  return relativeLuminance(rgb) > 0.55 ? '#0B0D11' : '#F8F7F2'
}

export const toggleValue = <T,>(value: T, list: T[]) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

export const toRgba = (hex: string, alpha: number, fallback = 'rgba(0,0,0,0)') => {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return fallback
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}
