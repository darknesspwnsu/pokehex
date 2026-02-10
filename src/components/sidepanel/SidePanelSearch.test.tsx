import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SidePanelSearch } from './SidePanelSearch'

describe('SidePanelSearch', () => {
  it('calls clear handler for query search', async () => {
    const onClearQuery = vi.fn()
    render(
      <SidePanelSearch
        searchMode="name"
        query="pikachu"
        colorQuery="#123456"
        normalizedColor="#123456"
        filteredCount={10}
        paletteMode="normal"
        panelSwatchB="#123456"
        panelSwatchC="#654321"
        chipStyle={() => ({})}
        onSearchModeChange={vi.fn()}
        onQueryChange={vi.fn()}
        onClearQuery={onClearQuery}
        onColorChange={vi.fn()}
        onResetColor={vi.fn()}
        onColorBlur={vi.fn()}
        onPaletteModeChange={vi.fn()}
        onSurprise={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /clear search/i }))
    expect(onClearQuery).toHaveBeenCalled()
  })
})
