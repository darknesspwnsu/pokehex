import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { SidePanel } from './SidePanel'

describe('SidePanel', () => {
  it('renders the selected pokemon section', () => {
    const entry = makeEntry()
    render(
      <SidePanel
        panelStyle={{}}
        activeEntry={entry}
        paletteMode="normal"
        searchMode="name"
        query=""
        colorQuery="#123456"
        normalizedColor="#123456"
        filteredCount={10}
        generationOptions={[1]}
        selectedGenerations={[]}
        typeOptions={['electric']}
        selectedTypes={[]}
        selectedForms={[]}
        historyEntries={[entry]}
        panelSwatchA="#123456"
        panelSwatchB="#654321"
        panelSwatchC="#999999"
        chipStyle={() => ({})}
        onSearchModeChange={vi.fn()}
        onQueryChange={vi.fn()}
        onClearQuery={vi.fn()}
        onColorChange={vi.fn()}
        onResetColor={vi.fn()}
        onColorBlur={vi.fn()}
        onPaletteModeChange={vi.fn()}
        onSurprise={vi.fn()}
        onToggleGeneration={vi.fn()}
        onToggleType={vi.fn()}
        onToggleForm={vi.fn()}
        onClearFilters={vi.fn()}
        onSelectName={vi.fn()}
      />,
    )

    expect(screen.getByText(/selected pokemon/i)).toBeInTheDocument()
  })
})
