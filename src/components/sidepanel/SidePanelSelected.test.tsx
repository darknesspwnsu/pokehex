import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { makeEntry } from '../../test/factories'
import { SidePanelSelected } from './SidePanelSelected'

describe('SidePanelSelected', () => {
  it('renders the selected pokemon name', () => {
    const entry = makeEntry({ displayName: 'Eevee' })
    render(<SidePanelSelected activeEntry={entry} paletteMode="normal" />)

    expect(screen.getByText('Eevee')).toBeInTheDocument()
  })
})
