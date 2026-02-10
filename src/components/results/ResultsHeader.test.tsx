import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResultsHeader } from './ResultsHeader'

describe('ResultsHeader', () => {
  it('shows counts', () => {
    render(<ResultsHeader count={12} totalCount={130} />)
    expect(screen.getByText(/explore/i)).toBeInTheDocument()
    expect(screen.getByText(/showing 12 of 130/i)).toBeInTheDocument()
  })
})
