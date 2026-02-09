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

export type FilterCriteria = Pick<
  FilterState,
  'selectedTypes' | 'selectedGenerations' | 'selectedForms'
>

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

const matchesCriteria = (entry: PokemonEntry, criteria: FilterCriteria) => {
  const matchesGeneration =
    criteria.selectedGenerations.length === 0 ||
    criteria.selectedGenerations.includes(entry.generation)

  const matchesType =
    criteria.selectedTypes.length === 0 ||
    criteria.selectedTypes.some((type) => entry.types.includes(type))

  const matchesForm =
    criteria.selectedForms.length === 0 ||
    criteria.selectedForms.some((tag) => entry.formTags.includes(tag))

  return matchesGeneration && matchesType && matchesForm
}

export const sortByColorDistance = (
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

export const filterByCriteria = (entries: PokemonEntry[], criteria: FilterCriteria) =>
  entries.filter((entry) => matchesCriteria(entry, criteria))

export const filterByQuery = (entries: PokemonEntry[], query: string) =>
  entries.filter((entry) => matchesQuery(entry, query))

export const applyFilters = (entries: PokemonEntry[], filters: FilterState) => {
  const base = filterByCriteria(entries, filters)

  if (filters.searchMode === 'color') {
    return sortByColorDistance(base, filters.colorQuery, filters.paletteMode)
  }

  if (!filters.query.trim()) {
    return base
  }

  return filterByQuery(base, filters.query)
}
