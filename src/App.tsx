import { useEffect, useMemo, useState } from 'react'

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
import { useFilterState } from './hooks/useFilterState'
import { useHistoryList } from './hooks/useHistoryList'
import { usePaletteTheme } from './hooks/usePaletteTheme'
import { usePokemonIndex } from './hooks/usePokemonIndex'
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
    colorQuery,
    setColorQuery,
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

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
    }
  }

  return (
    <div
      className="app-shell app-root app-container flex min-h-screen flex-col gap-8 px-6 pb-16 pt-10 sm:px-10"
      style={pageStyle}
    >
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      <main className="main-shell app-main flex min-h-0 w-full flex-1 px-0">
        <div className="app-layout grid h-full min-h-0 grid-cols-[340px_1fr] gap-8 layout-shell">
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
            onClearFilters={clearFilters}
            onSelectName={setSelectedName}
          />

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

      <footer className="site-footer w-full text-xs uppercase tracking-[0.3em] text-[var(--page-ink-muted)]">
        © {new Date().getFullYear()} Poke Hexcolor. All Pokemon artwork and
        trademarks belong to their respective owners.
      </footer>

      <Toast toast={toast} />
    </div>
  )
}

export default App
