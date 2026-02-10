import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { HeroPanel } from './HeroPanel'

describe('HeroPanel', () => {
  it('renders name and stats', () => {
    const entry = makeEntry()
    render(
      <HeroPanel
        entry={entry}
        paletteMode="normal"
        dominantHex="#123456"
        dominantText="#ffffff"
        dominantMuted="rgba(255,255,255,0.6)"
      />,
    )

    expect(screen.getByText(entry.displayName)).toBeInTheDocument()
    expect(screen.getByText('HP')).toBeInTheDocument()
  })

  it('shows missing art caption when no official art', () => {
    const entry = makeEntry({ images: { normal: '', shiny: '' } })
    render(
      <HeroPanel
        entry={entry}
        paletteMode="normal"
        dominantHex="#808080"
        dominantText="#ffffff"
        dominantMuted="rgba(255,255,255,0.6)"
      />,
    )

    expect(screen.getByText(/\(no official artwork\)/i)).toBeInTheDocument()
    expect(screen.queryByText(/dominant color/i)).not.toBeInTheDocument()
  })

  it('fires share action', async () => {
    const entry = makeEntry()
    const onShare = vi.fn()
    render(
      <HeroPanel
        entry={entry}
        paletteMode="normal"
        dominantHex="#123456"
        dominantText="#ffffff"
        dominantMuted="rgba(255,255,255,0.6)"
        shareUrl="https://example.com/#pikachu"
        onShare={onShare}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /copy share link/i }))
    expect(onShare).toHaveBeenCalledWith('https://example.com/#pikachu')
  })
})
