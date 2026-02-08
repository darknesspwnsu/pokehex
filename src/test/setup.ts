import '@testing-library/jest-dom/vitest'
import { beforeAll, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

beforeAll(async () => {
  const dataPath = path.resolve('public/data/pokemon-index.json')
  const raw = await fs.readFile(dataPath, 'utf8')
  const payload = JSON.parse(raw)

  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/data/pokemon-index.json')) {
        return {
          ok: true,
          json: async () => payload,
        } as Response
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response
    }),
  )
})
