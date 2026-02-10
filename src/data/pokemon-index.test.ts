import fs from 'node:fs/promises'
import path from 'node:path'

import type { PokemonEntry } from '../lib/types'

describe('pokemon index dataset', () => {
  it('contains palette entries for every pokemon form', async () => {
    const dataPath = path.resolve('public/data/pokemon-index.json')
    const raw = await fs.readFile(dataPath, 'utf8')
    const data = JSON.parse(raw) as { entries: PokemonEntry[]; count: number }

    expect(data.entries.length).toBeGreaterThan(1000)
    expect(data.entries.length).toBe(data.count)

    const sample = data.entries.find(
      (entry) => entry.palettes?.normal?.swatches?.length === 3,
    )

    expect(sample).toBeTruthy()
    expect(sample?.baseStats?.total).toBeGreaterThan(0)
  })
})
