import { useState, type Dispatch, type SetStateAction } from 'react'

import type { FormTag, PaletteMode } from '../lib/types'

type FilterState = {
  searchMode: 'name' | 'color'
  setSearchMode: Dispatch<SetStateAction<'name' | 'color'>>
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  clearQuery: () => void
  colorQuery: string
  setColorQuery: Dispatch<SetStateAction<string>>
  resetColorQuery: () => void
  paletteMode: PaletteMode
  setPaletteMode: Dispatch<SetStateAction<PaletteMode>>
  selectedTypes: string[]
  setSelectedTypes: Dispatch<SetStateAction<string[]>>
  selectedGenerations: number[]
  setSelectedGenerations: Dispatch<SetStateAction<number[]>>
  selectedForms: FormTag[]
  setSelectedForms: Dispatch<SetStateAction<FormTag[]>>
  clearFilters: () => void
}

export const useFilterState = (): FilterState => {
  const defaultColor = '#F97316'
  const [searchMode, setSearchMode] = useState<'name' | 'color'>('name')
  const [query, setQuery] = useState('')
  const [colorQuery, setColorQuery] = useState(defaultColor)
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('normal')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([])
  const [selectedForms, setSelectedForms] = useState<FormTag[]>([])

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedGenerations([])
    setSelectedForms([])
  }

  const clearQuery = () => {
    setQuery('')
  }

  const resetColorQuery = () => {
    setColorQuery(defaultColor)
  }

  return {
    searchMode,
    setSearchMode,
    query,
    setQuery,
    clearQuery,
    colorQuery,
    setColorQuery,
    resetColorQuery,
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
