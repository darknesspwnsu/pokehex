import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SwatchCard } from './SwatchCard'

describe('SwatchCard', () => {
  it('copies the swatch hex', async () => {
    const onCopyHex = vi.fn()
    render(
      <SwatchCard
        entryName="pikachu"
        swatch={{ hex: '#ABCDEF', rgb: [171, 205, 239], population: 10 }}
        percentage={50}
        onCopyHex={onCopyHex}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /copy #abcdef/i }))
    expect(onCopyHex).toHaveBeenCalledWith('#ABCDEF')
  })
})
