import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeEntry } from '../test/factories'
import { usePaletteTheme } from './usePaletteTheme'

describe('usePaletteTheme', () => {
  it('derives dominant swatch data', () => {
    const entry = makeEntry({
      palettes: {
        normal: {
          sourceUrl: 'x',
          swatches: [
            { hex: '#112233', rgb: [17, 34, 51], population: 6 },
            { hex: '#445566', rgb: [68, 85, 102], population: 4 },
            { hex: '#778899', rgb: [119, 136, 153], population: 2 },
          ],
        },
        shiny: {
          sourceUrl: 'y',
          swatches: [
            { hex: '#112233', rgb: [17, 34, 51], population: 6 },
            { hex: '#445566', rgb: [68, 85, 102], population: 4 },
            { hex: '#778899', rgb: [119, 136, 153], population: 2 },
          ],
        },
      },
    })

    const { result } = renderHook(() => usePaletteTheme(entry, 'normal', 'light'))

    expect(result.current.dominantHex).toBe('#112233')
    expect(result.current.panelSwatchC).toBe('#778899')
    expect(result.current.totalPopulation).toBe(12)
    expect(result.current.pageStyle).toHaveProperty('--page-a')
  })
})
