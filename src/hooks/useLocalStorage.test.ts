import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('hydrates from localStorage and persists updates', () => {
    window.localStorage.setItem('pokehex-test', JSON.stringify(['stored']))
    const { result } = renderHook(() => useLocalStorage('pokehex-test', ['initial']))

    expect(result.current[0]).toEqual(['stored'])

    act(() => {
      result.current[1](['next'])
    })

    expect(JSON.parse(window.localStorage.getItem('pokehex-test') ?? '[]')).toEqual([
      'next',
    ])
  })
})
