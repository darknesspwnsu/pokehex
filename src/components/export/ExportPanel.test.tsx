import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { makeEntry } from '../../test/factories'
import { ExportPanel } from './ExportPanel'

describe('ExportPanel', () => {
  it('invokes copy handlers', async () => {
    const onCopy = vi.fn()
    render(<ExportPanel entry={makeEntry()} paletteMode="normal" onCopy={onCopy} />)

    await userEvent.click(screen.getByRole('button', { name: /copy hex/i }))
    expect(onCopy).toHaveBeenCalled()
  })
})
