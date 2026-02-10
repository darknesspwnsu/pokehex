import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ResultsLoadMore } from './ResultsLoadMore'

describe('ResultsLoadMore', () => {
  it('triggers load more', async () => {
    const onLoadMore = vi.fn()
    render(<ResultsLoadMore onLoadMore={onLoadMore} />)

    await userEvent.click(screen.getByRole('button', { name: /load more/i }))
    expect(onLoadMore).toHaveBeenCalled()
  })
})
