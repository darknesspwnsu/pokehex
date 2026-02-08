import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the hero headline', async () => {
    render(<App />)
    expect(
      await screen.findByRole('heading', {
        name: /poke hexcolor/i,
      }),
    ).toBeInTheDocument()
  })
})
