import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  render: vi.fn(),
  createRoot: vi.fn(),
}))

vi.mock('react-dom/client', () => ({
  createRoot: mocks.createRoot,
}))

vi.mock('./App', () => ({
  default: () => null,
}))

describe('main entry', () => {
  it('mounts the React app', async () => {
    mocks.createRoot.mockReturnValue({ render: mocks.render })
    document.body.innerHTML = '<div id="root"></div>'

    await import('./main')

    expect(mocks.createRoot).toHaveBeenCalled()
    expect(mocks.render).toHaveBeenCalled()
  })
})
