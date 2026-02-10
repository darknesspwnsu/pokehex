import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Header } from './Header'

describe('Header', () => {
  it('renders brand and github link', () => {
    render(<Header isMobileNavOpen={false} onToggleMobileNav={vi.fn()} />)

    expect(screen.getAllByAltText(/poke hexcolor/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /view repository on github/i })).toHaveAttribute(
      'href',
      'https://github.com/darknesspwnsu/pokehex',
    )
  })

  it('toggles the mobile nav button', async () => {
    const onToggleMobileNav = vi.fn()
    render(<Header isMobileNavOpen={false} onToggleMobileNav={onToggleMobileNav} />)

    await userEvent.click(screen.getByRole('button', { name: /open filters/i }))
    expect(onToggleMobileNav).toHaveBeenCalled()
  })
})
