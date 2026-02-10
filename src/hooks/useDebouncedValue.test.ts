import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the latest value after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'alpha' },
    })

    expect(result.current).toBe('alpha')
    rerender({ value: 'beta' })
    expect(result.current).toBe('alpha')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('beta')
  })
})
