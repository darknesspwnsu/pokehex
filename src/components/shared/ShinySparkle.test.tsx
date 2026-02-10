import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ShinySparkle } from './ShinySparkle'

describe('ShinySparkle', () => {
  it('renders sparkle icon element', () => {
    render(<ShinySparkle />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
