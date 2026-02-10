import type { BaseStats, PaletteSet, PaletteSwatch, PokemonEntry } from '../lib/types'

export const makeSwatches = (count = 3): PaletteSwatch[] =>
  Array.from({ length: count }).map((_, index) => {
    const value = 40 + index * 40
    return {
      hex: `#${value.toString(16).padStart(2, '0').repeat(3)}`.toUpperCase(),
      rgb: [value, value, value],
      population: 10 - index,
    }
  })

export const makePalette = (swatches: PaletteSwatch[] = makeSwatches()): PaletteSet => ({
  sourceUrl: 'https://example.com/palette.png',
  swatches,
})

export const makeBaseStats = (overrides: Partial<BaseStats> = {}): BaseStats => ({
  hp: 60,
  attack: 55,
  defense: 50,
  specialAttack: 45,
  specialDefense: 65,
  speed: 70,
  total: 345,
  ...overrides,
})

export const makeEntry = (overrides: Partial<PokemonEntry> = {}): PokemonEntry => ({
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
    normal: makePalette(),
    shiny: makePalette(),
  },
  baseStats: makeBaseStats(),
  ...overrides,
})

