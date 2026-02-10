import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeEntry } from '../test/factories'
import { useHistoryList } from './useHistoryList'

describe('useHistoryList', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('keeps a deduped, capped history list', () => {
    const entries = Array.from({ length: 12 }).map((_, index) =>
      makeEntry({ name: `entry-${index}`, displayName: `Entry ${index}` }),
    )
    const entryMap = new Map(entries.map((entry) => [entry.name, entry]))
    const { result, rerender } = renderHook(
      ({ active }) => useHistoryList(active, entryMap),
      { initialProps: { active: entries[0] } },
    )

    entries.forEach((entry) => rerender({ active: entry }))

    expect(result.current.historyEntries).toHaveLength(10)
    expect(result.current.historyEntries[0]?.name).toBe('entry-11')
  })
})
