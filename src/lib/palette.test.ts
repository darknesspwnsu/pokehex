import { extractDominantSwatches } from './palette'

const repeat = (rgb: [number, number, number], count: number) =>
  Array.from({ length: count }, () => rgb)

describe('extractDominantSwatches', () => {
  it('returns the most common colors first', () => {
    const pixels = [
      ...repeat([255, 0, 0], 12),
      ...repeat([0, 0, 255], 7),
      ...repeat([0, 255, 0], 3),
    ]

    const swatches = extractDominantSwatches(pixels, 3, 8)

    expect(swatches[0].hex).toBe('#FF0000')
    expect(swatches[1].hex).toBe('#0000FF')
    expect(swatches[2].hex).toBe('#00FF00')
  })

  it('returns empty when pixels are missing', () => {
    expect(extractDominantSwatches([], 3)).toEqual([])
  })
})
