import type { RGB } from './types'

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const clampChannel = (value: number) => Math.max(0, Math.min(255, value))

export const hexToRgb = (hex: string): RGB | null => {
  const match = HEX_RE.exec(hex.trim())
  if (!match) {
    return null
  }

  let value = match[1]
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }

  const intValue = parseInt(value, 16)
  const r = (intValue >> 16) & 255
  const g = (intValue >> 8) & 255
  const b = intValue & 255
  return [r, g, b]
}

export const rgbToHex = (rgb: RGB) => {
  return (
    '#' +
    rgb
      .map((channel) => clampChannel(channel).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
}

export const normalizeHex = (hex: string) => {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHex(rgb) : null
}

export const colorDistance = (a: RGB, b: RGB) => {
  const [ar, ag, ab] = a
  const [br, bg, bb] = b
  return Math.sqrt(
    Math.pow(ar - br, 2) + Math.pow(ag - bg, 2) + Math.pow(ab - bb, 2),
  )
}

export const relativeLuminance = (rgb: RGB) => {
  const toLinear = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }

  const [r, g, b] = rgb.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
