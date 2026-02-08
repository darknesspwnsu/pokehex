import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the hero headline', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: /official-art palettes for every pokemon form/i,
      }),
    ).toBeInTheDocument()
  })
})
