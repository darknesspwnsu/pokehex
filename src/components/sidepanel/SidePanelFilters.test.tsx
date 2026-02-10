import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SidePanelFilters } from './SidePanelFilters'

describe('SidePanelFilters', () => {
  it('invokes filter handlers', async () => {
    const onToggleGeneration = vi.fn()
    const onClearFilters = vi.fn()

    render(
      <SidePanelFilters
        generationOptions={[1, 2]}
        selectedGenerations={[]}
        typeOptions={['electric']}
        selectedTypes={[]}
        selectedForms={[]}
        panelSwatchA="#123456"
        panelSwatchB="#654321"
        chipStyle={() => ({})}
        onToggleGeneration={onToggleGeneration}
        onToggleType={vi.fn()}
        onToggleForm={vi.fn()}
        onClearFilters={onClearFilters}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /gen 1/i }))
    expect(onToggleGeneration).toHaveBeenCalledWith(1)

    await userEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(onClearFilters).toHaveBeenCalled()
  })
})
