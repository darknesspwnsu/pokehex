import { act, render, screen, waitFor } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it(
    'renders the hero headline',
    async () => {
      render(<App />)
      expect(
        await screen.findByRole('heading', {
          name: /pokemon hex colors from official art for every form/i,
        }),
      ).toBeInTheDocument()
    },
    15000,
  )

  it(
    'updates the query string when selecting a result',
    async () => {
      render(<App />)

      await screen.findByRole('heading', {
        name: /pokemon hex colors from official art for every form/i,
      })

      await waitFor(() => {
        expect(document.querySelector('.result-card')).toBeTruthy()
      })

      const card = document.querySelector('.result-card') as HTMLButtonElement
      act(() => {
        card.click()
      })

      await waitFor(
        () => {
          expect(window.location.search).toMatch(/^\?pokemon=[a-z0-9-]+/)
        },
        { timeout: 10000 },
      )
    },
    15000,
  )
})
