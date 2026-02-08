import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { applyFilters } from './lib/filters'
import { hexToRgb, normalizeHex, relativeLuminance } from './lib/color'
import {
  toBadgeHtml,
  toCssVariables,
  toHexList,
  toPaletteJson,
} from './lib/exports'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { FormTag, PaletteMode, PokemonEntry, PokemonIndex } from './lib/types'

const FORM_FILTERS: { id: FormTag; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'mega', label: 'Mega' },
  { id: 'gmax', label: 'Gigantamax' },
  { id: 'regional', label: 'Regional' },
  { id: 'gendered', label: 'Gendered' },
  { id: 'primal', label: 'Primal' },
  { id: 'origin', label: 'Origin' },
  { id: 'totem', label: 'Totem' },
  { id: 'variant', label: 'Other' },
]

const TYPE_COLORS: Record<string, string> = {
  bug: '#84CC16',
  dark: '#334155',
  dragon: '#6366F1',
  electric: '#FACC15',
  fairy: '#F472B6',
  fighting: '#F97316',
  fire: '#FB7185',
  flying: '#38BDF8',
  ghost: '#8B5CF6',
  grass: '#22C55E',
  ground: '#EAB308',
  ice: '#22D3EE',
  normal: '#A8A29E',
  poison: '#C026D3',
  psychic: '#F43F5E',
  rock: '#A16207',
  steel: '#94A3B8',
  water: '#3B82F6',
}

const formatDex = (id: number) => id.toString().padStart(3, '0')

const getContrastColor = (hex: string) => {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return '#0B0D11'
  }

  return relativeLuminance(rgb) > 0.55 ? '#0B0D11' : '#F8F7F2'
}

const toggleValue = <T,>(value: T, list: T[]) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

const buildToast = (label: string) => `Copied ${label} to clipboard`

const buttonBase =
  'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30'

const cardBase = 'rounded-3xl border border-[var(--stroke)] bg-[var(--card)] shadow-glow'

function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('pokehex-theme', () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }

    return 'light'
  })

  const [index, setIndex] = useState<PokemonIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchMode, setSearchMode] = useState<'name' | 'color'>('name')
  const [query, setQuery] = useState('')
  const [colorQuery, setColorQuery] = useState('#F97316')
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('normal')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([])
  const [selectedForms, setSelectedForms] = useState<FormTag[]>([])
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [resultsLimit, setResultsLimit] = useState(60)
  const [toast, setToast] = useState<string | null>(null)

  const [history, setHistory] = useLocalStorage<string[]>('pokehex-history', [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    let active = true

    const loadIndex = async () => {
      try {
        const response = await fetch('/data/pokemon-index.json')
        if (!response.ok) {
          throw new Error('Failed to load Pokemon palette data.')
        }
        const data = (await response.json()) as PokemonIndex
        if (active) {
          setIndex(data)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load data.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadIndex()

    return () => {
      active = false
    }
  }, [])

  const entries = index?.entries ?? []
  const entryMap = useMemo(
    () => new Map(entries.map((entry) => [entry.name, entry])),
    [entries],
  )

  const filteredEntries = useMemo(
    () =>
      applyFilters(entries, {
        query,
        colorQuery,
        searchMode,
        selectedTypes,
        selectedGenerations,
        selectedForms,
        paletteMode,
      }),
    [
      entries,
      query,
      colorQuery,
      searchMode,
      selectedTypes,
      selectedGenerations,
      selectedForms,
      paletteMode,
    ],
  )

  useEffect(() => {
    setResultsLimit(60)
  }, [
    query,
    colorQuery,
    searchMode,
    selectedTypes,
    selectedGenerations,
    selectedForms,
    paletteMode,
  ])

  const activeEntry = useMemo(() => {
    if (filteredEntries.length === 0) {
      return null
    }

    if (selectedName) {
      const selected = entryMap.get(selectedName)
      if (selected && filteredEntries.some((entry) => entry.name === selected.name)) {
        return selected
      }
    }

    return filteredEntries[0]
  }, [filteredEntries, selectedName, entryMap])

  useEffect(() => {
    if (activeEntry && activeEntry.name !== selectedName) {
      setSelectedName(activeEntry.name)
    }
  }, [activeEntry, selectedName])

  useEffect(() => {
    if (!activeEntry) {
      return
    }

    setHistory((prev) => {
      const next = [activeEntry.name, ...prev.filter((name) => name !== activeEntry.name)]
      return next.slice(0, 10)
    })
  }, [activeEntry, setHistory])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(null), 1600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const historyEntries = useMemo(
    () => history.map((name) => entryMap.get(name)).filter(Boolean) as PokemonEntry[],
    [history, entryMap],
  )

  const typeOptions = useMemo(
    () => Array.from(new Set(entries.flatMap((entry) => entry.types))).sort(),
    [entries],
  )

  const generationOptions = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.generation))).sort(),
    [entries],
  )

  const visibleEntries = filteredEntries.slice(0, resultsLimit)
  const normalizedColor = normalizeHex(colorQuery) ?? '#F97316'

  const activeSwatches = activeEntry?.palettes[paletteMode].swatches ?? []
  const dominantHex = activeSwatches[0]?.hex ?? '#F6E6B4'
  const dominantText = getContrastColor(dominantHex)
  const dominantMuted =
    dominantText === '#0B0D11'
      ? 'rgba(11,13,17,0.65)'
      : 'rgba(248,247,242,0.7)'

  const totalPopulation = activeSwatches.reduce(
    (sum, swatch) => sum + swatch.population,
    0,
  )

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast(buildToast(label))
    } catch (error) {
      setToast('Unable to copy to clipboard.')
    }
  }

  const handleSurprise = () => {
    if (filteredEntries.length === 0) {
      return
    }

    const random = filteredEntries[Math.floor(Math.random() * filteredEntries.length)]
    if (random) {
      setSelectedName(random.name)
    }
  }

  return (
    <div className="min-h-screen px-6 pb-16 pt-10 sm:px-10">
      <header className="mx-auto flex max-w-6xl flex-row items-center justify-between gap-6 layout-header">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--ink-muted)]">
            Poke Hexcolor
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Official-art palettes for every Pokemon form.
          </h1>
          <p className="max-w-xl text-sm text-[var(--ink-muted)] sm:text-base">
            Search by name, number, or nearest color match to reveal dominant
            swatches. Filter by generation, type, and form, then export clean
            palette snippets.
          </p>
        </motion.div>
        <div className="flex items-center gap-3">
          <button
            className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)] shadow-glow`}
            onClick={() =>
              setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
            }
          >
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            className={`${buttonBase} border-transparent bg-[var(--ink)] text-[var(--bg)] shadow-glow`}
            href="https://github.com/pokehex/pokehex.github.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-6xl">
        <div className="grid grid-cols-[320px_1fr] gap-8 layout-shell">
          <aside className="space-y-6">
            <div className={`${cardBase} p-6`}>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--ink-muted)]">
                Selected Pokemon
              </p>
              <h2 className="mt-2 font-display text-3xl">
                {activeEntry?.displayName ?? 'Loading...'}
              </h2>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)]">
                {activeEntry
                  ? `#${formatDex(activeEntry.speciesId)} · Gen ${activeEntry.generation}`
                  : 'Fetching data'}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeEntry?.types.map((type) => (
                  <span
                    key={`${activeEntry.name}-${type}`}
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: TYPE_COLORS[type] ?? '#64748B',
                      color: getContrastColor(TYPE_COLORS[type] ?? '#64748B'),
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className={`${cardBase} p-6`}>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`${buttonBase} ${
                    searchMode === 'name'
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                  }`}
                  onClick={() => setSearchMode('name')}
                >
                  Name / Number
                </button>
                <button
                  className={`${buttonBase} ${
                    searchMode === 'color'
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                  }`}
                  onClick={() => setSearchMode('color')}
                >
                  Color Match
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Search
                </p>
                {searchMode === 'name' ? (
                  <input
                    className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] shadow-sm outline-none focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)]/20"
                    placeholder="Search by name or Pokedex number"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-white/80 px-4 py-3 shadow-sm">
                    <input
                      aria-label="Pick a color"
                      type="color"
                      value={normalizeHex(colorQuery) ?? '#F97316'}
                      onChange={(event) =>
                        setColorQuery(event.target.value.toUpperCase())
                      }
                      className="h-10 w-10 cursor-pointer rounded-full border-none bg-transparent"
                    />
                    <input
                      className="w-full bg-transparent text-sm uppercase tracking-[0.2em] text-[var(--ink)] outline-none"
                      value={colorQuery}
                      onChange={(event) =>
                        setColorQuery(event.target.value.toUpperCase())
                      }
                      onBlur={() => {
                        const normalized = normalizeHex(colorQuery)
                        if (normalized) {
                          setColorQuery(normalized)
                        }
                      }}
                      placeholder="#F97316"
                    />
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        backgroundColor: normalizedColor,
                        color: getContrastColor(normalizedColor),
                      }}
                    >
                      {normalizedColor}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                  onClick={handleSurprise}
                >
                  Surprise me
                </button>
                <button
                  className={`${buttonBase} ${
                    paletteMode === 'normal'
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                  }`}
                  onClick={() => setPaletteMode('normal')}
                >
                  Normal
                </button>
                <button
                  className={`${buttonBase} ${
                    paletteMode === 'shiny'
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                  }`}
                  onClick={() => setPaletteMode('shiny')}
                >
                  Shiny
                </button>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  {filteredEntries.length} results
                </span>
              </div>
            </div>

            <div className={`${cardBase} p-6`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Filters
                </h3>
                <button
                  className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]"
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedGenerations([])
                    setSelectedForms([])
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Generation
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {generationOptions.map((gen) => (
                      <button
                        key={`gen-${gen}`}
                        className={`${buttonBase} px-3 py-1 ${
                          selectedGenerations.includes(gen)
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                            : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                        }`}
                        onClick={() =>
                          setSelectedGenerations((prev) =>
                            toggleValue(gen, prev),
                          )
                        }
                      >
                        Gen {gen}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {typeOptions.map((type) => {
                      const isActive = selectedTypes.includes(type)
                      const color = TYPE_COLORS[type] ?? '#64748B'
                      return (
                        <button
                          key={type}
                          className={`${buttonBase} px-3 py-1`}
                          style={{
                            borderColor: isActive ? color : 'var(--stroke)',
                            backgroundColor: isActive ? color : 'transparent',
                            color: isActive
                              ? getContrastColor(color)
                              : 'var(--ink-muted)',
                          }}
                          onClick={() =>
                            setSelectedTypes((prev) => toggleValue(type, prev))
                          }
                        >
                          {type}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Forms
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FORM_FILTERS.map((form) => (
                      <button
                        key={form.id}
                        className={`${buttonBase} px-3 py-1 ${
                          selectedForms.includes(form.id)
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                            : 'border-[var(--stroke)] bg-[var(--card)] text-[var(--ink-muted)]'
                        }`}
                        onClick={() =>
                          setSelectedForms((prev) => toggleValue(form.id, prev))
                        }
                      >
                        {form.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardBase} p-6`}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                Palette History
              </h3>
              {historyEntries.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--ink-muted)]">
                  Pick a Pokemon to start building a quick-access strip.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {historyEntries.map((entry) => (
                    <button
                      key={`history-${entry.name}`}
                      className="flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--bg-muted)] px-3 py-2 text-xs font-semibold"
                      onClick={() => setSelectedName(entry.name)}
                    >
                      <span className="flex gap-1">
                        {entry.palettes[paletteMode].swatches.map((swatch) => (
                          <span
                            key={`${entry.name}-${swatch.hex}`}
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </span>
                      {entry.displayName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section className="space-y-6">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-[var(--stroke)] bg-[var(--bg-muted)] p-10 text-center text-sm text-[var(--ink-muted)]">
                Loading Poke Hexcolor data...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-dashed border-red-400 bg-red-50 p-10 text-center text-sm text-red-700">
                {error}
              </div>
            ) : activeEntry ? (
              <div className="space-y-6">
                <motion.div
                  key={activeEntry.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[32px] border border-[var(--stroke)] p-8 shadow-float"
                  style={{
                    backgroundColor: dominantHex,
                    color: dominantText,
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2), transparent 60%)',
                  }}
                >
                  <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 layout-hero">
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-[0.35em]" style={{ color: dominantMuted }}>
                        Dominant color
                      </p>
                      <h2 className="font-display text-4xl sm:text-5xl">
                        {activeEntry.displayName}
                      </h2>
                      <p className="text-sm sm:text-base" style={{ color: dominantMuted }}>
                        #{formatDex(activeEntry.speciesId)} · Gen {activeEntry.generation} · {paletteMode}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeEntry.types.map((type) => (
                          <span
                            key={`${activeEntry.name}-${type}`}
                            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{
                              backgroundColor: TYPE_COLORS[type] ?? '#64748B',
                              color: getContrastColor(TYPE_COLORS[type] ?? '#64748B'),
                            }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                        <span>{dominantHex}</span>
                        <span style={{ color: dominantMuted }}>dominant</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="rounded-[32px] border border-white/30 bg-white/20 p-6">
                        {activeEntry.images[paletteMode] ? (
                          <img
                            src={activeEntry.images[paletteMode]}
                            alt={activeEntry.displayName}
                            className="h-64 w-64 object-contain sm:h-80 sm:w-80"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-64 w-64 items-center justify-center text-xs" style={{ color: dominantMuted }}>
                            No official art
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-3 gap-4 layout-swatch">
                  {activeSwatches.map((swatch) => {
                    const percentage = totalPopulation
                      ? Math.round((swatch.population / totalPopulation) * 100)
                      : 0
                    return (
                      <div
                        key={`${activeEntry.name}-${swatch.hex}`}
                        className="rounded-3xl px-5 py-4 shadow-glow"
                        style={{
                          backgroundColor: swatch.hex,
                          color: getContrastColor(swatch.hex),
                        }}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                          <span>{swatch.hex}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.3em]">
                          Palette swatch
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className={`${cardBase} p-5`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Export Palette
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button
                      className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                      onClick={() =>
                        handleCopy('hex list', toHexList(activeEntry, paletteMode))
                      }
                    >
                      Copy HEX
                    </button>
                    <button
                      className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                      onClick={() =>
                        handleCopy(
                          'CSS variables',
                          toCssVariables(activeEntry, paletteMode),
                        )
                      }
                    >
                      Copy CSS
                    </button>
                    <button
                      className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                      onClick={() =>
                        handleCopy(
                          'JSON',
                          toPaletteJson(activeEntry, paletteMode),
                        )
                      }
                    >
                      Copy JSON
                    </button>
                    <button
                      className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                      onClick={() =>
                        handleCopy('badge HTML', toBadgeHtml(activeEntry, paletteMode))
                      }
                    >
                      Copy Badge
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={`${cardBase} p-6`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Results
                </h2>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Showing {visibleEntries.length} of {filteredEntries.length}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleEntries.map((entry) => {
                  const isActive = entry.name === activeEntry?.name
                  const swatches = entry.palettes[paletteMode].swatches

                  return (
                    <motion.button
                      key={entry.name}
                      layout
                      whileHover={{ y: -4 }}
                      className={`rounded-3xl border px-4 py-4 text-left shadow-glow transition ${
                        isActive
                          ? 'border-[var(--ink)] bg-[var(--bg-muted)]'
                          : 'border-[var(--stroke)] bg-[var(--card)]'
                      }`}
                      onClick={() => setSelectedName(entry.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[var(--bg-muted)]">
                          {entry.images[paletteMode] ? (
                            <img
                              src={entry.images[paletteMode]}
                              alt={entry.displayName}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--ink-muted)]">
                              No art
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {entry.displayName}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                            #{formatDex(entry.speciesId)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {swatches.map((swatch) => (
                          <span
                            key={`${entry.name}-${swatch.hex}`}
                            className="h-3 w-full rounded-full"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {visibleEntries.length < filteredEntries.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    className={`${buttonBase} border-[var(--stroke)] bg-[var(--card)] text-[var(--ink)]`}
                    onClick={() => setResultsLimit((prev) => prev + 60)}
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mx-auto mt-12 max-w-6xl text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">
        © {new Date().getFullYear()} Poke Hexcolor. All Pokemon artwork and
        trademarks belong to their respective owners.
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 rounded-full border border-[var(--stroke)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-glow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
