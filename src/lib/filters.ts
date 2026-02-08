import { colorDistance, hexToRgb } from './color'
import type { FormTag, PaletteMode, PokemonEntry } from './types'

export type SearchMode = 'name' | 'color'

export type FilterState = {
  query: string
  colorQuery: string
  searchMode: SearchMode
  selectedTypes: string[]
  selectedGenerations: number[]
  selectedForms: FormTag[]
  paletteMode: PaletteMode
}

const matchesQuery = (entry: PokemonEntry, query: string) => {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return true
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed)
    return entry.speciesId === numeric || entry.id === numeric
  }

  return (
    entry.displayName.toLowerCase().includes(trimmed) ||
    entry.name.includes(trimmed) ||
    entry.speciesName.includes(trimmed)
  )
}

const matchesFilters = (entry: PokemonEntry, filters: FilterState) => {
  const matchesGeneration =
    filters.selectedGenerations.length === 0 ||
    filters.selectedGenerations.includes(entry.generation)

  const matchesType =
    filters.selectedTypes.length === 0 ||
    filters.selectedTypes.some((type) => entry.types.includes(type))

  const matchesForm =
    filters.selectedForms.length === 0 ||
    filters.selectedForms.some((tag) => entry.formTags.includes(tag))

  return matchesGeneration && matchesType && matchesForm
}

const sortByColorDistance = (
  entries: PokemonEntry[],
  colorHex: string,
  mode: PaletteMode,
) => {
  const target = hexToRgb(colorHex)
  if (!target) {
    return entries
  }

  return entries
    .map((entry) => {
      const swatches = entry.palettes[mode].swatches
      const distance = Math.min(
        ...swatches.map((swatch) => colorDistance(swatch.rgb, target)),
      )
      return { entry, distance }
    })
    .sort((a, b) => a.distance - b.distance)
    .map(({ entry }) => entry)
}

export const applyFilters = (entries: PokemonEntry[], filters: FilterState) => {
  const base = entries.filter((entry) => matchesFilters(entry, filters))

  if (filters.searchMode === 'color') {
    return sortByColorDistance(base, filters.colorQuery, filters.paletteMode)
  }

  return base.filter((entry) => matchesQuery(entry, filters.query))
}
