import {
  colorDistance,
  hexToRgb,
  normalizeHex,
  relativeLuminance,
  rgbToHex,
} from './color'

describe('color utils', () => {
  it('parses 3 and 6 digit hex values', () => {
    expect(hexToRgb('#f80')).toEqual([255, 136, 0])
    expect(hexToRgb('ff8800')).toEqual([255, 136, 0])
  })

  it('normalizes hex values to uppercase', () => {
    expect(normalizeHex('#f80')).toBe('#FF8800')
  })

  it('converts RGB to hex', () => {
    expect(rgbToHex([8, 16, 32])).toBe('#081020')
  })

  it('calculates color distance', () => {
    expect(colorDistance([0, 0, 0], [0, 0, 0])).toBe(0)
    expect(colorDistance([0, 0, 0], [255, 0, 0])).toBeGreaterThan(0)
  })

  it('derives relative luminance values', () => {
    const light = relativeLuminance([255, 255, 255])
    const dark = relativeLuminance([0, 0, 0])
    expect(light).toBeGreaterThan(dark)
  })
})
