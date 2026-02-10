import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useFilterState } from './useFilterState'

describe('useFilterState', () => {
  it('manages filter state helpers', () => {
    const { result } = renderHook(() => useFilterState())

    act(() => {
      result.current.setQuery('pikachu')
      result.current.setSearchMode('color')
      result.current.setColorQuery('#123456')
      result.current.setPaletteMode('shiny')
      result.current.setSelectedTypes(['electric'])
      result.current.setSelectedGenerations([1])
      result.current.setSelectedForms(['mega'])
    })

    expect(result.current.query).toBe('pikachu')
    expect(result.current.searchMode).toBe('color')
    expect(result.current.colorQuery).toBe('#123456')
    expect(result.current.paletteMode).toBe('shiny')
    expect(result.current.selectedTypes).toEqual(['electric'])

    act(() => {
      result.current.clearFilters()
      result.current.clearQuery()
      result.current.resetColorQuery()
    })

    expect(result.current.query).toBe('')
    expect(result.current.selectedTypes).toEqual([])
    expect(result.current.selectedGenerations).toEqual([])
    expect(result.current.selectedForms).toEqual([])
    expect(result.current.colorQuery).toBe('#F97316')
  })
})
