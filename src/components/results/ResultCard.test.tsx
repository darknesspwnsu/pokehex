import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { ResultCard } from './ResultCard'

describe('ResultCard', () => {
  it('renders and triggers selection', async () => {
    const entry = makeEntry({ displayName: 'Bulbasaur', name: 'bulbasaur' })
    const onSelect = vi.fn()
    render(
      <ResultCard
        entry={entry}
        paletteMode="normal"
        isActive={false}
        onSelect={onSelect}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /bulbasaur/i }))
    expect(onSelect).toHaveBeenCalledWith('bulbasaur')
  })
})
