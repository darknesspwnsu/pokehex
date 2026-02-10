import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { makeSwatches } from '../../test/factories'
import { SwatchGrid } from './SwatchGrid'

describe('SwatchGrid', () => {
  it('renders three swatches when art is available', () => {
    render(
      <SwatchGrid
        entryName="pikachu"
        swatches={makeSwatches(3)}
        totalPopulation={30}
        isArtAvailable
        onCopyHex={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('renders disabled placeholders when art is missing', () => {
    const { container } = render(
      <SwatchGrid
        entryName="pikachu"
        swatches={makeSwatches(3)}
        totalPopulation={30}
        isArtAvailable={false}
        onCopyHex={vi.fn()}
      />,
    )

    expect(container.querySelectorAll('.swatch-card-disabled')).toHaveLength(3)
  })
})
