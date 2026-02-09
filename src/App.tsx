import { useEffect, useMemo, useRef, useState } from 'react'

import { Header } from './components/Header'
import { ThemeToggle } from './components/header/ThemeToggle'
import { HeroPanel } from './components/HeroPanel'
import { SidePanel } from './components/SidePanel'
import { SwatchGrid } from './components/SwatchGrid'
import { ExportPanel } from './components/ExportPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { Toast } from './components/Toast'
import { applyFilters } from './lib/filters'
import { normalizeHex } from './lib/color'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useFilterState } from './hooks/useFilterState'
import { useHistoryList } from './hooks/useHistoryList'
import { usePaletteTheme } from './hooks/usePaletteTheme'
import { usePokemonIndex } from './hooks/usePokemonIndex'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { copyToClipboard, getContrastColor, toRgba, toggleValue } from './lib/ui'

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

  const { entries, entryMap, loading, error } = usePokemonIndex()
  const {
    searchMode,
    setSearchMode,
    query,
    setQuery,
    clearQuery,
    colorQuery,
    setColorQuery,
    resetColorQuery,
    paletteMode,
    setPaletteMode,
    selectedTypes,
    setSelectedTypes,
    selectedGenerations,
    setSelectedGenerations,
    selectedForms,
    setSelectedForms,
    clearFilters,
  } = useFilterState()
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [resultsLimit, setResultsLimit] = useState(60)
  const [toast, setToast] = useState<string | null>(null)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [hasSeededSelection, setHasSeededSelection] = useState(false)
  const hasRandomizedSelection = useRef(false)
  const skipNextAutoSelect = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (hasRandomizedSelection.current || entries.length === 0) {
      return
    }

    const random = entries[Math.floor(Math.random() * entries.length)]
    if (random) {
      skipNextAutoSelect.current = true
      hasRandomizedSelection.current = true
      setSelectedName(random.name)
      setHasSeededSelection(true)
      setPaletteMode(Math.random() < 0.2 ? 'shiny' : 'normal')
    }
  }, [entries, setPaletteMode])

  useEffect(() => {
    if (!isMobileNavOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileNavOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobileNavOpen) {
      return
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isMobileNavOpen])

  const debouncedQuery = useDebouncedValue(query, 250)
  const debouncedColorQuery = useDebouncedValue(colorQuery, 250)

  const filteredEntries = useMemo(
    () =>
      applyFilters(entries, {
        query: debouncedQuery,
        colorQuery: debouncedColorQuery,
        searchMode,
        selectedTypes,
        selectedGenerations,
        selectedForms,
        paletteMode,
      }),
    [
      entries,
      debouncedQuery,
      debouncedColorQuery,
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
    if (filteredEntries.length === 0 || !hasSeededSelection) {
      return null
    }

    if (selectedName) {
      const selected = entryMap.get(selectedName)
      if (selected && filteredEntries.some((entry) => entry.name === selected.name)) {
        return selected
      }
    }

    return filteredEntries[0]
  }, [filteredEntries, selectedName, entryMap, hasSeededSelection])

  useEffect(() => {
    if (!activeEntry) {
      return
    }

    if (skipNextAutoSelect.current) {
      skipNextAutoSelect.current = false
      return
    }

    if (activeEntry.name !== selectedName) {
      setSelectedName(activeEntry.name)
    }
  }, [activeEntry, selectedName])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(null), 1600)
    return () => window.clearTimeout(timer)
  }, [toast])

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

  const {
    activeSwatches,
    dominantHex,
    dominantText,
    dominantMuted,
    panelSwatchA,
    panelSwatchB,
    panelSwatchC,
    panelInk,
    pageStyle,
    panelStyle,
    totalPopulation,
  } = usePaletteTheme(activeEntry, paletteMode, theme)
  const chipStyle = (active: boolean, base: string) => ({
    backgroundColor: active ? base : toRgba(base, 0.2),
    color: active ? getContrastColor(base) : panelInk,
    borderColor: active ? toRgba(base, 0.5) : toRgba(base, 0.22),
    boxShadow: active ? `0 12px 24px ${toRgba(base, 0.35)}` : undefined,
  })

  const { historyEntries } = useHistoryList(activeEntry, entryMap)

  const handleCopy = async (label: string, text: string) => {
    const success = await copyToClipboard(text)
    setToast(success ? buildToast(label) : 'Unable to copy to clipboard.')
  }

  const handleSurprise = () => {
    if (filteredEntries.length === 0) {
      return
    }

    const random = filteredEntries[Math.floor(Math.random() * filteredEntries.length)]
    if (random) {
      setSelectedName(random.name)
      setMobileNavOpen(false)
      setHasSeededSelection(true)
    }
  }

  const handleSelectName = (name: string) => {
    setSelectedName(name)
    setMobileNavOpen(false)
    setHasSeededSelection(true)
  }

  return (
    <div
      className="app-shell app-root app-container flex min-h-screen flex-col gap-8 px-6 pb-16 pt-10 sm:px-10"
      style={pageStyle}
    >
      <Header
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
      />

      <section className="intro-banner mx-auto w-full max-w-7xl space-y-2 px-0">
        <h1 className="intro-title m-0 font-display text-4xl leading-tight text-[var(--page-ink)] sm:text-5xl">
          Official-art palettes for every Pokemon form.
        </h1>
        <p className="intro-subtitle max-w-3xl text-sm text-[var(--page-ink-muted)] sm:text-base">
          <span className="intro-subtitle-text">
            Search by name, number, or nearest color match to reveal dominant swatches. Filter by generation, type, and form, then export clean palette snippets.
          </span>
          <span className="intro-tooltip">
            <button type="button" className="intro-tooltip-button" aria-label="About this experience">
              i
            </button>
            <span className="intro-tooltip-text">
              Search by name, number, or nearest color match to reveal dominant swatches. Filter by generation, type, and form, then export clean palette snippets.
            </span>
          </span>
        </p>
      </section>

      <main className="main-shell app-main flex min-h-0 w-full flex-1 px-0">
        <div className="app-layout grid h-full min-h-0 grid-cols-[340px_1fr] gap-8 layout-shell">
          <div className={`side-panel-wrapper ${isMobileNavOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="side-panel-overlay"
              aria-hidden={!isMobileNavOpen}
              onClick={() => setMobileNavOpen(false)}
            />
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
              onClearQuery={clearQuery}
              onColorChange={setColorQuery}
              onResetColor={resetColorQuery}
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
              onClearFilters={clearFilters}
              onSelectName={handleSelectName}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>

          <section className="content-column app-content flex min-h-0 flex-1 flex-col gap-7">
            {loading ? (
              <div className="app-state rounded-none bg-[var(--page-surface)] p-10 text-center text-sm text-[var(--page-ink-muted)] shadow-glow">
                Loading Poke Hexcolor data...
              </div>
            ) : error ? (
              <div className="app-state app-error rounded-none border border-dashed border-red-400 bg-red-50 p-10 text-center text-sm text-red-700">
                {error}
              </div>
            ) : activeEntry ? (
              <div className="app-hero-stack space-y-6">
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
              onLoadMore={() =>
                setResultsLimit((prev) =>
                  Math.min(prev + 60, filteredEntries.length),
                )
              }
            />
          </section>
        </div>
      </main>

      <footer className="site-footer w-full text-[10px] uppercase tracking-[0.2em] text-[var(--page-ink-muted)]">
        <span>
          © {new Date().getFullYear()} Poke Hexcolor. All Pokemon artwork and
          trademarks belong to their respective owners.
        </span>
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
      </footer>

      <Toast toast={toast} />
    </div>
  )
}

export default App
