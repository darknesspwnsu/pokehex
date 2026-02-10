import type { PokemonEntry } from './types'
import { applyFilters, type FilterState } from './filters'

const makeEntry = (overrides: Partial<PokemonEntry>): PokemonEntry => ({
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
        { hex: '#FF0000', rgb: [255, 0, 0], population: 10 },
        { hex: '#00FF00', rgb: [0, 255, 0], population: 5 },
        { hex: '#0000FF', rgb: [0, 0, 255], population: 2 },
      ],
    },
    shiny: {
      sourceUrl: 'https://example.com/shiny.png',
      swatches: [
        { hex: '#0000FF', rgb: [0, 0, 255], population: 10 },
        { hex: '#00FF00', rgb: [0, 255, 0], population: 5 },
        { hex: '#FF0000', rgb: [255, 0, 0], population: 2 },
      ],
    },
  },
  baseStats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    total: 320,
  },
  ...overrides,
})

const baseFilters: FilterState = {
  query: '',
  colorQuery: '#FF0000',
  searchMode: 'name',
  selectedTypes: [],
  selectedGenerations: [],
  selectedForms: [],
  paletteMode: 'normal',
}

describe('applyFilters', () => {
  it('filters by name query and numeric dex ids', () => {
    const entries = [
      makeEntry({ name: 'pikachu', speciesId: 25, displayName: 'Pikachu' }),
      makeEntry({ name: 'eevee', speciesId: 133, displayName: 'Eevee' }),
    ]

    expect(
      applyFilters(entries, { ...baseFilters, query: 'Eevee' }),
    ).toHaveLength(1)

    expect(
      applyFilters(entries, { ...baseFilters, query: '25' })[0]?.name,
    ).toBe('pikachu')
  })

  it('applies type and generation filters', () => {
    const entries = [
      makeEntry({ types: ['electric'], generation: 1 }),
      makeEntry({ types: ['water'], generation: 2, name: 'totodile' }),
    ]

    const filtered = applyFilters(entries, {
      ...baseFilters,
      selectedTypes: ['water'],
      selectedGenerations: [2],
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.name).toBe('totodile')
  })

  it('sorts by palette distance when in color mode', () => {
    const entries = [
      makeEntry({ name: 'redmon' }),
      makeEntry({
        name: 'bluemon',
        palettes: {
          normal: {
            sourceUrl: 'x',
            swatches: [
              { hex: '#0000FF', rgb: [0, 0, 255], population: 5 },
              { hex: '#00FF00', rgb: [0, 255, 0], population: 3 },
              { hex: '#FF0000', rgb: [255, 0, 0], population: 1 },
            ],
          },
          shiny: {
            sourceUrl: 'y',
            swatches: [
              { hex: '#0000FF', rgb: [0, 0, 255], population: 5 },
              { hex: '#00FF00', rgb: [0, 255, 0], population: 3 },
              { hex: '#FF0000', rgb: [255, 0, 0], population: 1 },
            ],
          },
        },
      }),
    ]

    const sorted = applyFilters(entries, {
      ...baseFilters,
      searchMode: 'color',
      colorQuery: '#FF0000',
    })

    expect(sorted[0]?.name).toBe('redmon')
  })
})
