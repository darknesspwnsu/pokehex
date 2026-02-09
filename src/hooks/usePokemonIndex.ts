import { useEffect, useMemo, useState } from 'react'

import type { PokemonEntry, PokemonIndex } from '../lib/types'

type UsePokemonIndexResult = {
  index: PokemonIndex | null
  entries: PokemonEntry[]
  entryMap: Map<string, PokemonEntry>
  loading: boolean
  error: string | null
}

export const usePokemonIndex = (): UsePokemonIndexResult => {
  const [index, setIndex] = useState<PokemonIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadIndex = async () => {
      try {
        const url = new URL('data/pokemon-index.json', import.meta.env.BASE_URL)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to load Pokemon palette data.')
        }
        const data = (await response.json()) as PokemonIndex
        if (active) {
          setIndex(data)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load data.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadIndex()

    return () => {
      active = false
    }
  }, [])

  const entries = index?.entries ?? []
  const entryMap = useMemo(() => new Map(entries.map((entry) => [entry.name, entry])), [
    entries,
  ])

  return { index, entries, entryMap, loading, error }
}
