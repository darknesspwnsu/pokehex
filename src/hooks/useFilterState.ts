import { useState } from 'react'

import type { FormTag, PaletteMode } from '../lib/types'

type FilterState = {
  searchMode: 'name' | 'color'
  setSearchMode: (mode: 'name' | 'color') => void
  query: string
  setQuery: (value: string) => void
  colorQuery: string
  setColorQuery: (value: string) => void
  paletteMode: PaletteMode
  setPaletteMode: (mode: PaletteMode) => void
  selectedTypes: string[]
  setSelectedTypes: (types: string[]) => void
  selectedGenerations: number[]
  setSelectedGenerations: (gens: number[]) => void
  selectedForms: FormTag[]
  setSelectedForms: (forms: FormTag[]) => void
  clearFilters: () => void
}

export const useFilterState = (): FilterState => {
  const [searchMode, setSearchMode] = useState<'name' | 'color'>('name')
  const [query, setQuery] = useState('')
  const [colorQuery, setColorQuery] = useState('#F97316')
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('normal')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([])
  const [selectedForms, setSelectedForms] = useState<FormTag[]>([])

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedGenerations([])
    setSelectedForms([])
  }

  return {
    searchMode,
    setSearchMode,
    query,
    setQuery,
    colorQuery,
    setColorQuery,
    paletteMode,
    setPaletteMode,
    selectedTypes,
    setSelectedTypes,
    selectedGenerations,
    setSelectedGenerations,
    selectedForms,
    setSelectedForms,
    clearFilters,
  }
}
