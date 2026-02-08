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

export const copyToClipboard = async (text: string) => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    // Fall through to legacy copy API.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch (error) {
    return false
  }
}
