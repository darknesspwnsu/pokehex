import type { PokemonEntry } from './types'
import { toBadgeHtml, toCssVariables, toHexList, toPaletteJson } from './exports'

const entry: PokemonEntry = {
  id: 25,
  name: 'pikachu',
  displayName: 'Pikachu',
  speciesId: 25,
  speciesName: 'pikachu',
  types: ['electric'],
  generation: 1,
  color: 'yellow',
  formTags: ['default'],
  isDefault: true,
  order: 1,
  formOrder: 1,
  images: {
    normal: 'https://example.com/normal.png',
    shiny: 'https://example.com/shiny.png',
  },
  palettes: {
    normal: {
      sourceUrl: 'https://example.com/normal.png',
      swatches: [
        { hex: '#FFE08A', rgb: [255, 224, 138], population: 10 },
        { hex: '#2B2D42', rgb: [43, 45, 66], population: 5 },
        { hex: '#F97316', rgb: [249, 115, 22], population: 2 },
      ],
    },
    shiny: {
      sourceUrl: 'https://example.com/shiny.png',
      swatches: [
        { hex: '#FFE08A', rgb: [255, 224, 138], population: 10 },
        { hex: '#2B2D42', rgb: [43, 45, 66], population: 5 },
        { hex: '#F97316', rgb: [249, 115, 22], population: 2 },
      ],
    },
  },
}

describe('export helpers', () => {
  it('formats swatch hex lists', () => {
    expect(toHexList(entry, 'normal')).toContain('#FFE08A')
  })

  it('builds css variable blocks', () => {
    expect(toCssVariables(entry, 'normal')).toContain('--pokemon-swatch-1')
  })

  it('serializes palette json', () => {
    const json = toPaletteJson(entry, 'normal')
    const parsed = JSON.parse(json) as { name: string }
    expect(parsed.name).toBe('Pikachu')
  })

  it('builds badge html snippets', () => {
    const badge = toBadgeHtml(entry, 'normal')
    expect(badge).toContain('img src')
    expect(badge).toContain('Pikachu')
  })
})
