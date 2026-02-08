import { rgbToHex } from './color'
import type { PaletteSwatch, RGB } from './types'

type Bucket = {
  count: number
  rSum: number
  gSum: number
  bSum: number
}

export const extractDominantSwatches = (
  pixels: RGB[],
  swatchCount = 3,
  bucketSize = 16,
): PaletteSwatch[] => {
  if (pixels.length === 0) {
    return []
  }

  const buckets = new Map<string, Bucket>()

  for (const [r, g, b] of pixels) {
    const rKey = Math.floor(r / bucketSize)
    const gKey = Math.floor(g / bucketSize)
    const bKey = Math.floor(b / bucketSize)
    const key = `${rKey}-${gKey}-${bKey}`
    const existing = buckets.get(key)

    if (existing) {
      existing.count += 1
      existing.rSum += r
      existing.gSum += g
      existing.bSum += b
      continue
    }

    buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b })
  }

  const sortedBuckets = Array.from(buckets.values()).sort(
    (a, b) => b.count - a.count,
  )

  return sortedBuckets.slice(0, swatchCount).map((bucket) => {
    const r = Math.round(bucket.rSum / bucket.count)
    const g = Math.round(bucket.gSum / bucket.count)
    const b = Math.round(bucket.bSum / bucket.count)
    const rgb: RGB = [r, g, b]

    return {
      rgb,
      hex: rgbToHex(rgb),
      population: bucket.count,
    }
  })
}
