import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Toast } from './Toast'

describe('Toast', () => {
  it('renders when toast text is provided', () => {
    render(<Toast toast="Copied!" />)
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('renders nothing when toast is null', () => {
    const { container } = render(<Toast toast={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
