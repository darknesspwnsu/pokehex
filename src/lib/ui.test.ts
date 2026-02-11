import { describe, expect, it, vi } from 'vitest'

import { fetchImageDataUrl, getExportSizing } from './ui'

describe('getExportSizing', () => {
  it('scales down when wider than target', () => {
    expect(getExportSizing(1000, 500, 750)).toEqual({
      scale: 0.75,
      width: 750,
      height: 375,
    })
  })

  it('keeps size when within target', () => {
    expect(getExportSizing(600, 400, 750)).toEqual({
      scale: 1,
      width: 600,
      height: 400,
    })
  })

  it('guards against zero sizes', () => {
    expect(getExportSizing(0, 0, 750)).toEqual({
      scale: 1,
      width: 1,
      height: 1,
    })
  })
})

describe('fetchImageDataUrl', () => {
  it('returns data url for a successful fetch', async () => {
    const blob = new Blob(['hello'], { type: 'image/png' })
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      blob: async () => blob,
    } as Response)

    const result = await fetchImageDataUrl('https://example.com/image.png')

    expect(result).toMatch(/^data:image\/png;base64,/)
    fetchSpy.mockRestore()
  })

  it('returns empty string for failed fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response)

    const result = await fetchImageDataUrl('https://example.com/image.png')

    expect(result).toBe('')
    fetchSpy.mockRestore()
  })
})
