import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { Header } from './components/Header'
import { HeroPanel } from './components/HeroPanel'
import { SidePanel } from './components/SidePanel'
import { SwatchGrid } from './components/SwatchGrid'
import { ExportPanel } from './components/ExportPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { Toast } from './components/Toast'
import { applyFilters } from './lib/filters'
import { normalizeHex } from './lib/color'
import { useLocalStorage } from './hooks/useLocalStorage'
import { getContrastColor, toRgba, toggleValue } from './lib/ui'
import type { FormTag, PaletteMode, PokemonEntry, PokemonIndex } from './lib/types'

const buildToast = (label: string) => `Copied ${label} to clipboard`

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
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      <main className="mx-auto mt-8 max-w-7xl">
        <div className="grid grid-cols-[340px_1fr] gap-8 layout-shell">
          <SidePanel
            panelStyle={panelStyle}
            activeEntry={activeEntry}
            paletteMode={paletteMode}
            searchMode={searchMode}
            query={query}
            colorQuery={colorQuery}
            normalizedColor={normalizedColor}
            filteredCount={filteredEntries.length}
            generationOptions={generationOptions}
            selectedGenerations={selectedGenerations}
            typeOptions={typeOptions}
            selectedTypes={selectedTypes}
            selectedForms={selectedForms}
            historyEntries={historyEntries}
            panelSwatchA={panelSwatchA}
            panelSwatchB={panelSwatchB}
            panelSwatchC={panelSwatchC}
            chipStyle={chipStyle}
            onSearchModeChange={setSearchMode}
            onQueryChange={setQuery}
            onColorChange={setColorQuery}
            onColorBlur={() => {
              const normalized = normalizeHex(colorQuery)
              if (normalized) {
                setColorQuery(normalized)
              }
            }}
            onPaletteModeChange={setPaletteMode}
            onSurprise={handleSurprise}
            onToggleGeneration={(gen) =>
              setSelectedGenerations((prev) => toggleValue(gen, prev))
            }
            onToggleType={(type) =>
              setSelectedTypes((prev) => toggleValue(type, prev))
            }
            onToggleForm={(form) =>
              setSelectedForms((prev) => toggleValue(form, prev))
            }
            onClearFilters={() => {
              setSelectedTypes([])
              setSelectedGenerations([])
              setSelectedForms([])
            }}
            onSelectName={setSelectedName}
          />

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
                <HeroPanel
                  entry={activeEntry}
                  paletteMode={paletteMode}
                  dominantHex={dominantHex}
                  dominantText={dominantText}
                  dominantMuted={dominantMuted}
                />
                <SwatchGrid
                  entryName={activeEntry.name}
                  swatches={activeSwatches}
                  totalPopulation={totalPopulation}
                  onCopyHex={(hex) => handleCopy('hex', hex)}
                />
                <ExportPanel
                  entry={activeEntry}
                  paletteMode={paletteMode}
                  onCopy={handleCopy}
                />
              </div>
            ) : null}

            <ResultsPanel
              entries={visibleEntries}
              totalCount={filteredEntries.length}
              activeEntryName={activeEntry?.name ?? null}
              paletteMode={paletteMode}
              dominantHex={dominantHex}
              canLoadMore={visibleEntries.length < filteredEntries.length}
              onSelect={setSelectedName}
              onLoadMore={() => setResultsLimit((prev) => prev + 60)}
            />
          </section>
        </div>
      </main>

      <footer className="mx-auto mt-12 max-w-7xl text-xs uppercase tracking-[0.3em] text-[var(--page-ink-muted)]">
        © {new Date().getFullYear()} Poke Hexcolor. All Pokemon artwork and
        trademarks belong to their respective owners.
      </footer>

      <Toast toast={toast} />
    </div>
  )
}

export default App
