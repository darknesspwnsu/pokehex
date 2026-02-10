import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { ResultsPanel } from './ResultsPanel'

describe('ResultsPanel', () => {
  it('renders result cards and load more', () => {
    const entries = [
      makeEntry({ name: 'bulbasaur', displayName: 'Bulbasaur' }),
      makeEntry({ name: 'ivysaur', displayName: 'Ivysaur' }),
    ]
    render(
      <ResultsPanel
        entries={entries}
        totalCount={20}
        activeEntryName="bulbasaur"
        paletteMode="normal"
        canLoadMore
        onSelect={vi.fn()}
        onLoadMore={vi.fn()}
      />,
    )

    expect(screen.getByText(/explore/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
  })
})
