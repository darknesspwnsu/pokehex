import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

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

const toRgba = (hex: string, alpha: number, fallback = 'rgba(0,0,0,0)') => {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return fallback
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

const buttonBase =
  'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_0_0_2px_var(--page-glow),0_16px_32px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45'
const chipBase = `${buttonBase} px-3 py-2 text-[11px] tracking-[0.2em]`
const actionButton = `${buttonBase} px-4 py-3 text-[11px] tracking-[0.22em]`
const searchFieldBase = 'mt-3 flex items-center gap-3 px-4 py-2.5'

const cardBase =
  'rounded-none bg-[var(--page-surface)] shadow-glow backdrop-blur'
const panelCardBase =
  'rounded-none bg-[var(--panel-card)] p-6 text-[var(--panel-ink)] shadow-sm backdrop-blur'

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

  const panelSwatchA = activeSwatches[0]?.hex ?? dominantHex
  const panelSwatchB = activeSwatches[1]?.hex ?? panelSwatchA
  const panelSwatchC = activeSwatches[2]?.hex ?? panelSwatchB
  const panelBackground =
    `linear-gradient(160deg, ${panelSwatchA} 0%, ${panelSwatchB} 55%, ${panelSwatchC} 100%)`
  const panelOverlay =
    'radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 55%)'
  const panelInk = dominantText
  const panelInkMuted =
    dominantText === '#0B0D11'
      ? 'rgba(11,13,17,0.72)'
      : 'rgba(248,247,242,0.86)'
  const pageStroke =
    dominantText === '#0B0D11'
      ? 'rgba(11,13,17,0.08)'
      : 'rgba(248,247,242,0.16)'
  const pageSurface = toRgba(panelSwatchA, 0.22)
  const pageSurfaceStrong = toRgba(panelSwatchB, 0.32)
  const pageGlow = toRgba(panelSwatchB, 0.45)
  const panelCard = toRgba(panelSwatchA, 0.26)
  const panelCardStrong = toRgba(panelSwatchB, 0.38)
  const panelChip = toRgba(panelSwatchA, 0.24)
  const panelChipStrong = toRgba(panelSwatchB, 0.4)
  const pageSoftA = toRgba(panelSwatchA, 0.6)
  const pageSoftB = toRgba(panelSwatchB, 0.58)
  const pageSoftC = toRgba(panelSwatchC, 0.52)
  const pageStyle = {
    '--page-a': panelSwatchA,
    '--page-b': panelSwatchB,
    '--page-c': panelSwatchC,
    '--page-ink': dominantText,
    '--page-ink-muted': panelInkMuted,
    '--page-surface': pageSurface,
    '--page-surface-strong': pageSurfaceStrong,
    '--page-stroke': pageStroke,
    '--page-glow': pageGlow,
    '--page-soft-a': pageSoftA,
    '--page-soft-b': pageSoftB,
    '--page-soft-c': pageSoftC,
  } as CSSProperties
  const panelStyle = {
    backgroundImage: `${panelOverlay}, ${panelBackground}`,
    '--panel-ink': panelInk,
    '--panel-ink-muted': panelInkMuted,
    '--panel-card': panelCard,
    '--panel-card-strong': panelCardStrong,
    '--panel-chip': panelChip,
    '--panel-chip-strong': panelChipStrong,
    '--panel-stroke': pageStroke,
  } as CSSProperties
  const chipStyle = (active: boolean, base: string) => ({
    backgroundColor: active ? base : toRgba(base, 0.2),
    color: active ? getContrastColor(base) : panelInk,
    borderColor: active ? toRgba(base, 0.5) : toRgba(base, 0.22),
    boxShadow: active ? `0 12px 24px ${toRgba(base, 0.35)}` : undefined,
  })

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
    <div className="app-shell app-root min-h-screen px-6 pb-16 pt-10 sm:px-10" style={pageStyle}>
      <header className="site-header mx-auto flex max-w-7xl flex-col gap-5 rounded-none bg-[var(--page-surface-strong)] p-5 shadow-float backdrop-blur layout-header sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.32em] text-[var(--page-ink-muted)]">
              <span>Poke Hexcolor</span>
              <span className="rounded-none bg-[var(--page-surface)] px-3 py-1 text-[10px] tracking-[0.3em] text-[var(--page-ink)] shadow-[0_10px_20px_rgba(0,0,0,0.12)]">
                Gen 1-9
              </span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--page-ink)] sm:text-5xl">
              Official-art palettes for every Pokemon form.
            </h1>
            <p className="max-w-2xl text-sm text-[var(--page-ink-muted)] sm:text-base">
              Search by name, number, or nearest color match to reveal dominant
              swatches. Filter by generation, type, and form, then export clean
              palette snippets.
            </p>
          </motion.div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`${buttonBase} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
              onClick={() =>
                setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
              }
            >
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <a
              className={`${buttonBase} border-transparent bg-[var(--page-ink)] text-[var(--page-a)]`}
              href="https://github.com/pokehex/pokehex.github.io"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl">
        <div className="grid grid-cols-[340px_1fr] gap-8 layout-shell">
          <aside
            className="side-panel space-y-8 rounded-none shadow-float backdrop-blur"
            style={panelStyle}
          >
            <div className={`${panelCardBase} space-y-3`}>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--panel-ink-muted)]">
                Selected Pokemon
              </p>
              <h2 className="font-display text-3xl">
                {activeEntry?.displayName ?? 'Loading...'}
              </h2>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--panel-ink-muted)]">
                {activeEntry
                  ? `#${formatDex(activeEntry.speciesId)} · Gen ${activeEntry.generation}`
                  : 'Fetching data'}
              </div>
              <div className="flex flex-wrap gap-[2px]">
                {activeEntry?.types.map((type) => (
                  <span
                    key={`${activeEntry.name}-${type}`}
                    className="rounded-none px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
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

            <div className={`${panelCardBase} panel-card space-y-4`}>
              <div className="flex flex-wrap gap-[2px]">
                <button
                  className={chipBase}
                  style={chipStyle(searchMode === 'name', panelSwatchB)}
                  onClick={() => setSearchMode('name')}
                >
                  Name / Number
                </button>
                <button
                  className={chipBase}
                  style={chipStyle(searchMode === 'color', panelSwatchB)}
                  onClick={() => setSearchMode('color')}
                >
                  Color Match
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
                  Search
                </p>
                {searchMode === 'name' ? (
                  <div className={`${searchFieldBase} search-field`}>
                    <input
                      className="flex-1 bg-transparent text-center text-base font-semibold tracking-[0.04em] text-black outline-none placeholder:text-black/40"
                      placeholder="Search by name or Pokedex number"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/40 bg-white shadow-[0_6px_12px_rgba(0,0,0,0.16)]">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 text-black/70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
                      </svg>
                    </span>
                  </div>
                ) : (
                  <div className={`${searchFieldBase} search-field`}>
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
                      className="flex-1 bg-transparent text-center text-base font-semibold uppercase tracking-[0.16em] text-black outline-none placeholder:text-black/40"
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
                      className="rounded-full border border-black/50 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
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

              <div className="flex flex-wrap items-center gap-[2px]">
                <button
                  className={chipBase}
                  style={chipStyle(true, panelSwatchC)}
                  onClick={handleSurprise}
                >
                  Surprise me
                </button>
                <button
                  className={chipBase}
                  style={chipStyle(paletteMode === 'normal', panelSwatchB)}
                  onClick={() => setPaletteMode('normal')}
                >
                  Normal
                </button>
                <button
                  className={chipBase}
                  style={chipStyle(paletteMode === 'shiny', panelSwatchC)}
                  onClick={() => setPaletteMode('shiny')}
                >
                  Shiny
                </button>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
                  {filteredEntries.length} results
                </span>
              </div>
            </div>

            <div className={`${panelCardBase} space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Filters
                </h3>
                <button
                  className={chipBase}
                  style={chipStyle(false, panelSwatchA)}
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedGenerations([])
                    setSelectedForms([])
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
                    Generation
                  </p>
                  <div className="mt-2 flex flex-wrap gap-[2px]">
                    {generationOptions.map((gen) => (
                      <button
                        key={`gen-${gen}`}
                        className={chipBase}
                        style={chipStyle(selectedGenerations.includes(gen), panelSwatchB)}
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
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
                    Type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-[2px]">
                    {typeOptions.map((type) => {
                      const isActive = selectedTypes.includes(type)
                      const color = TYPE_COLORS[type] ?? '#64748B'
                      return (
                        <button
                          key={type}
                          className={chipBase}
                          style={{
                            borderColor: isActive
                              ? toRgba(color, 0.7)
                              : toRgba(color, 0.35),
                            backgroundColor: isActive
                              ? color
                              : toRgba(color, 0.18),
                            color: isActive
                              ? getContrastColor(color)
                              : panelInk,
                            boxShadow: isActive
                              ? `0 12px 24px ${toRgba(color, 0.35)}`
                              : undefined,
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
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
                    Forms
                  </p>
                  <div className="mt-2 flex flex-wrap gap-[2px]">
                    {FORM_FILTERS.map((form) => (
                      <button
                        key={form.id}
                        className={chipBase}
                        style={chipStyle(selectedForms.includes(form.id), panelSwatchA)}
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

            <div className={`${panelCardBase} space-y-3`}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                Palette History
              </h3>
              {historyEntries.length === 0 ? (
                <p className="text-sm text-[var(--panel-ink-muted)]">
                  Pick a Pokemon to start building a quick-access strip.
                </p>
              ) : (
                <div className="flex flex-wrap gap-[2px]">
                  {historyEntries.map((entry) => (
                    <button
                      key={`history-${entry.name}`}
                      className={`${chipBase} flex items-center gap-2 px-2 py-1.5 text-[10px] tracking-[0.18em]`}
                      style={chipStyle(false, panelSwatchA)}
                      onClick={() => setSelectedName(entry.name)}
                    >
                      <span className="flex gap-[2px]">
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

          <section className="space-y-7">
            {loading ? (
              <div className="rounded-none bg-[var(--page-surface)] p-10 text-center text-sm text-[var(--page-ink-muted)] shadow-glow">
                Loading Poke Hexcolor data...
              </div>
            ) : error ? (
              <div className="rounded-none border border-dashed border-red-400 bg-red-50 p-10 text-center text-sm text-red-700">
                {error}
              </div>
            ) : activeEntry ? (
              <div className="space-y-6">
                <motion.div
                  key={activeEntry.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="hero-panel rounded-none shadow-float"
                  style={{
                    backgroundColor: dominantHex,
                    color: dominantText,
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2), transparent 60%)',
                  }}
                >
                  <div className="hero-content flex items-center justify-between gap-6 layout-hero">
                    <div className="hero-info flex-1 space-y-4">
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
                            className="rounded-none px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{
                              backgroundColor: TYPE_COLORS[type] ?? '#64748B',
                              color: getContrastColor(TYPE_COLORS[type] ?? '#64748B'),
                            }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      <div
                        className="mt-4 inline-flex items-center gap-3 rounded-none px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                        style={{
                          backgroundColor: toRgba(dominantText, 0.18),
                          borderColor: toRgba(dominantText, 0.25),
                        }}
                      >
                        <span>{dominantHex}</span>
                        <span style={{ color: dominantMuted }}>dominant</span>
                      </div>
                    </div>
                    <div className="hero-art flex flex-1 items-center justify-center">
                      {activeEntry.images[paletteMode] ? (
                        <img
                          src={activeEntry.images[paletteMode]}
                          alt={activeEntry.displayName}
                          className="max-h-[42vh] w-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-64 w-64 items-center justify-center text-xs" style={{ color: dominantMuted }}>
                          No official art
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <div className="swatch-grid grid grid-cols-3 gap-4 layout-swatch">
                  {activeSwatches.map((swatch) => {
                    const percentage = totalPopulation
                      ? Math.round((swatch.population / totalPopulation) * 100)
                      : 0
                    return (
                      <button
                        key={`${activeEntry.name}-${swatch.hex}`}
                        type="button"
                        aria-label={`Copy ${swatch.hex}`}
                        onClick={() => handleCopy('hex', swatch.hex)}
                        className="swatch-button group relative flex cursor-pointer flex-col justify-between rounded-sm border px-5 py-4 text-left shadow-glow transition hover:-translate-y-1 hover:brightness-105 hover:shadow-[0_0_0_2px_var(--page-glow),0_18px_36px_rgba(0,0,0,0.2)] active:scale-[0.98] active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--page-glow)]/60"
                        style={{
                          backgroundColor: swatch.hex,
                          color: getContrastColor(swatch.hex),
                          borderColor: swatch.hex,
                        }}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                          <span>{swatch.hex}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.2em] opacity-80">
                          Swatch
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className={`${cardBase} p-6`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--page-ink-muted)]">
                    Export Palette
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      className={`${actionButton} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
                      onClick={() =>
                        handleCopy('hex list', toHexList(activeEntry, paletteMode))
                      }
                    >
                      Copy HEX
                    </button>
                    <button
                      className={`${actionButton} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
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
                      className={`${actionButton} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
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
                      className={`${actionButton} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
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

            <div className={`${cardBase} results-panel p-3`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Results
                </h2>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--page-ink-muted)]">
                  Showing {visibleEntries.length} of {filteredEntries.length}
                </span>
              </div>

              <div className="results-grid mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {visibleEntries.map((entry) => {
                  const isActive = entry.name === activeEntry?.name
                  const swatches = entry.palettes[paletteMode].swatches
                  const cardSwatchA = swatches[0]?.hex ?? dominantHex
                  const cardSwatchB = swatches[1]?.hex ?? cardSwatchA
                  const cardSwatchC = swatches[2]?.hex ?? cardSwatchB
                  const cardText = getContrastColor(cardSwatchA)
                  const cardMuted =
                    cardText === '#0B0D11'
                      ? 'rgba(11,13,17,0.78)'
                      : 'rgba(248,247,242,0.88)'
                  const baseShadow = `0 12px 26px ${toRgba(cardSwatchA, 0.22)}`
                  const labelBackdrop = toRgba(
                    cardText === '#0B0D11' ? '#ffffff' : '#0B0D11',
                    0.2,
                  )
                  const labelShadow =
                    cardText === '#0B0D11'
                      ? '0 1px 6px rgba(255,255,255,0.35)'
                      : '0 1px 6px rgba(0,0,0,0.45)'
                  const cardStyle = {
                    backgroundImage: `linear-gradient(140deg, ${toRgba(cardSwatchA, 0.95)} 0%, ${toRgba(cardSwatchB, 0.88)} 55%, ${toRgba(cardSwatchC, 0.85)} 100%)`,
                    color: cardText,
                    boxShadow: isActive
                      ? `0 0 0 2px ${toRgba(cardSwatchA, 0.7)}, 0 20px 40px ${toRgba(cardSwatchB, 0.35)}`
                      : baseShadow,
                  }

                  return (
                    <motion.button
                      key={entry.name}
                      layout
                      whileHover={{ y: -4 }}
                      className="result-card relative overflow-hidden rounded-lg text-left transition"
                      style={cardStyle}
                      onClick={() => setSelectedName(entry.name)}
                    >
                      <div className="result-card-image flex-shrink-0 overflow-hidden rounded-sm" style={{ backgroundColor: toRgba(cardSwatchA, 0.2) }}>
                        {entry.images[paletteMode] ? (
                          <img
                            src={entry.images[paletteMode]}
                            alt={entry.displayName}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px]" style={{ color: cardMuted }}>
                            No art
                          </div>
                        )}
                        <div
                          className="result-card-label rounded-none px-2 py-1"
                          style={{ backgroundColor: labelBackdrop, textShadow: labelShadow }}
                        >
                          <p className="text-[11px] font-semibold leading-tight">
                            {entry.displayName}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: cardMuted }}>
                            #{formatDex(entry.speciesId)}
                          </p>
                        </div>
                      </div>
                      <div className="result-card-swatches flex gap-1.5">
                        {swatches.map((swatch) => (
                          <span
                            key={`${entry.name}-${swatch.hex}`}
                            className="h-2 w-full rounded-full"
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
                    className={`${buttonBase} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
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

      <footer className="mx-auto mt-12 max-w-7xl text-xs uppercase tracking-[0.3em] text-[var(--page-ink-muted)]">
        © {new Date().getFullYear()} Poke Hexcolor. All Pokemon artwork and
        trademarks belong to their respective owners.
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 rounded-none bg-[var(--page-surface-strong)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--page-ink)] shadow-glow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
