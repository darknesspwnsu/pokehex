import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePokemonIndex } from './usePokemonIndex'

describe('usePokemonIndex', () => {
  it('loads entries and builds a map', async () => {
    const { result } = renderHook(() => usePokemonIndex())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.entries.length).toBeGreaterThan(0)
    expect(result.current.entryMap.size).toBe(result.current.entries.length)
  })

  it('sets error when fetch fails', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => usePokemonIndex())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load Pokemon palette data.')

    fetchSpy.mockRestore()
  })
})
