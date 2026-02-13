import { useEffect, useState } from 'react'

type Initializer<T> = T | (() => T)

const resolveInitial = <T,>(initial: Initializer<T>) =>
  typeof initial === 'function' ? (initial as () => T)() : initial

export const useLocalStorage = <T,>(key: string, initial: Initializer<T>) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return resolveInitial(initial)
    }

    const stored = window.localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored) as T
      } catch {
        return resolveInitial(initial)
      }
    }

    return resolveInitial(initial)
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
