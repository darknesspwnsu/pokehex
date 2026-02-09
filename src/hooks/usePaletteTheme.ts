import { useMemo, type CSSProperties } from 'react'

import { getContrastColor, mixHex, toRgba } from '../lib/ui'
import type { PaletteMode, PaletteSwatch, PokemonEntry } from '../lib/types'

type PaletteTheme = {
  activeSwatches: PaletteSwatch[]
  dominantHex: string
  dominantText: string
  dominantMuted: string
  panelSwatchA: string
  panelSwatchB: string
  panelSwatchC: string
  panelInk: string
  panelInkMuted: string
  pageStyle: CSSProperties
  panelStyle: CSSProperties
  totalPopulation: number
}

export const usePaletteTheme = (
  activeEntry: PokemonEntry | null,
  paletteMode: PaletteMode,
  theme: 'light' | 'dark',
): PaletteTheme => {
  return useMemo(() => {
    const activeSwatches = activeEntry?.palettes[paletteMode].swatches ?? []
    const dominantHex = activeSwatches[0]?.hex ?? '#F8F8F8'
    const dominantText = getContrastColor(dominantHex)
    const dominantMuted =
      dominantText === '#0B0D11'
        ? 'rgba(11,13,17,0.65)'
        : 'rgba(248,247,242,0.7)'

    const panelSwatchA = activeSwatches[0]?.hex ?? dominantHex
    const panelSwatchB = activeSwatches[1]?.hex ?? panelSwatchA
    const panelSwatchC = activeSwatches[2]?.hex ?? panelSwatchB

    const isDark = theme === 'dark'
    const themeBlend = isDark ? '#0B0D11' : '#FFFFFF'
    const themeMix = isDark ? 0.42 : 0.08
    const themeSwatchA = mixHex(panelSwatchA, themeBlend, themeMix)
    const themeSwatchB = mixHex(panelSwatchB, themeBlend, themeMix)
    const themeSwatchC = mixHex(panelSwatchC, themeBlend, themeMix)

    const panelBackground =
      `linear-gradient(160deg, ${themeSwatchA} 0%, ${themeSwatchB} 55%, ${themeSwatchC} 100%)`
    const panelInk = isDark ? '#F8F7F2' : dominantText
    const panelInkMuted = isDark ? 'rgba(248,247,242,0.72)' : dominantMuted
    const pageStroke = isDark ? 'rgba(248,247,242,0.14)' : 'rgba(11,13,17,0.08)'
    const pageSurface = toRgba(themeSwatchA, isDark ? 0.3 : 0.22)
    const pageSurfaceStrong = toRgba(themeSwatchB, isDark ? 0.42 : 0.32)
    const pageGlow = toRgba(themeSwatchB, isDark ? 0.6 : 0.45)
    const panelCard = toRgba(themeSwatchA, isDark ? 0.36 : 0.26)
    const panelCardStrong = toRgba(themeSwatchB, isDark ? 0.5 : 0.38)
    const panelChip = toRgba(themeSwatchA, isDark ? 0.3 : 0.24)
    const panelChipStrong = toRgba(themeSwatchB, isDark ? 0.46 : 0.4)
    const pageSoftA = toRgba(themeSwatchA, isDark ? 0.45 : 0.6)
    const pageSoftB = toRgba(themeSwatchB, isDark ? 0.45 : 0.58)
    const pageSoftC = toRgba(themeSwatchC, isDark ? 0.4 : 0.52)

    const pageStyle = {
      '--page-a': themeSwatchA,
      '--page-b': themeSwatchB,
      '--page-c': themeSwatchC,
      '--page-ink': panelInk,
      '--page-ink-muted': panelInkMuted,
      '--page-surface': pageSurface,
      '--page-surface-strong': pageSurfaceStrong,
      '--page-stroke': pageStroke,
      '--page-glow': pageGlow,
      '--page-soft-a': pageSoftA,
      '--page-soft-b': pageSoftB,
      '--page-soft-c': pageSoftC,
    } as CSSProperties

    const panelStyle = {
      backgroundColor: themeSwatchA,
      backgroundImage: panelBackground,
      '--panel-ink': panelInk,
      '--panel-ink-muted': panelInkMuted,
      '--panel-card': panelCard,
      '--panel-card-strong': panelCardStrong,
      '--panel-chip': panelChip,
      '--panel-chip-strong': panelChipStrong,
      '--panel-stroke': pageStroke,
    } as CSSProperties

    const totalPopulation = activeSwatches.reduce(
      (sum, swatch) => sum + swatch.population,
      0,
    )

    return {
      activeSwatches,
      dominantHex,
      dominantText,
      dominantMuted,
      panelSwatchA,
      panelSwatchB,
      panelSwatchC,
      panelInk,
      panelInkMuted,
      pageStyle,
      panelStyle,
      totalPopulation,
    }
  }, [activeEntry, paletteMode, theme])
}
