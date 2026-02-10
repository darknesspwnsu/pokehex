import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { SidePanelHistory } from './SidePanelHistory'

describe('SidePanelHistory', () => {
  it('renders history chips and handles clicks', async () => {
    const onSelectName = vi.fn()
    const entry = makeEntry({ name: 'bulbasaur', displayName: 'Bulbasaur' })

    render(
      <SidePanelHistory
        historyEntries={[entry]}
        paletteMode="normal"
        panelSwatchA="#123456"
        chipStyle={() => ({})}
        onSelectName={onSelectName}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /bulbasaur/i }))
    expect(onSelectName).toHaveBeenCalledWith('bulbasaur')
  })
})
