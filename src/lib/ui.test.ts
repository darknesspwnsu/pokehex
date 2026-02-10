import { describe, expect, it } from 'vitest'

import { getExportSizing } from './ui'

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
