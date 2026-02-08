import { useEffect, useMemo } from 'react'

import type { PokemonEntry } from '../lib/types'
import { useLocalStorage } from './useLocalStorage'

type HistoryList = {
  historyEntries: PokemonEntry[]
}

export const useHistoryList = (
  activeEntry: PokemonEntry | null,
  entryMap: Map<string, PokemonEntry>,
): HistoryList => {
  const [history, setHistory] = useLocalStorage<string[]>('pokehex-history', [])

  useEffect(() => {
    if (!activeEntry) {
      return
    }

    setHistory((prev) => {
      const next = [activeEntry.name, ...prev.filter((name) => name !== activeEntry.name)]
      return next.slice(0, 10)
    })
  }, [activeEntry, setHistory])

  const historyEntries = useMemo(
    () => history.map((name) => entryMap.get(name)).filter(Boolean) as PokemonEntry[],
    [history, entryMap],
  )

  return { historyEntries }
}
