import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Header } from './components/header/Header'
import { ThemeToggle } from './components/header/ThemeToggle'
import { HeroPanel } from './components/hero/HeroPanel'
import { SidePanel } from './components/sidepanel/SidePanel'
import { SwatchGrid } from './components/swatch/SwatchGrid'
import { ExportPanel } from './components/export/ExportPanel'
import { ResultsPanel } from './components/results/ResultsPanel'
import { Toast } from './components/toast/Toast'
import { filterByCriteria, filterByQuery, sortByColorDistance } from './lib/filters'
import { normalizeHex } from './lib/color'
import { buildPokemonSlug } from './lib/pokemon'
import type { PokemonEntry } from './lib/types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useFilterState } from './hooks/useFilterState'
import { useHistoryList } from './hooks/useHistoryList'
import { usePaletteTheme } from './hooks/usePaletteTheme'
import { usePokemonIndex } from './hooks/usePokemonIndex'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { toPng } from 'html-to-image'

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
  const [isExporting, setIsExporting] = useState(false)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [hasSeededSelection, setHasSeededSelection] = useState(false)
  const hasRandomizedSelection = useRef(false)
  const skipNextAutoSelect = useRef(false)
  const urlSync = useRef({ initialized: false, skipNext: false, ignoreHashChange: false })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const getCurrentSlug = useCallback(() => {
    if (typeof window === 'undefined') {
      return null
    }
    const hash = window.location.hash
    if (hash.startsWith('#')) {
      const slug = hash.slice(1).replace(/^\/+|\/+$/g, '')
      return slug || null
    }
    const base = import.meta.env.BASE_URL ?? '/'
    const normalizedBase = base.endsWith('/') ? base : `${base}/`
    let path = window.location.pathname
    if (normalizedBase !== '/' && path.startsWith(normalizedBase)) {
      path = path.slice(normalizedBase.length)
    }
    const slug = path.replace(/^\/+|\/+$/g, '')
    return slug || null
  }, [])

  const parseSlug = useCallback((raw: string | null) => {
    if (!raw) {
      return null
    }
    const normalized = raw.toLowerCase()
    if (normalized.endsWith('-shiny')) {
      return { slug: normalized.slice(0, -6), paletteMode: 'shiny' as const }
    }
    return { slug: normalized, paletteMode: 'normal' as const }
  }, [])

  const entrySlugMap = useMemo(() => {
    const map = new Map<string, PokemonEntry>()
    entries.forEach((entry) => {
      map.set(buildPokemonSlug(entry), entry)
      map.set(entry.name, entry)
    })
    return map
  }, [entries])

  useEffect(() => {
    if (hasRandomizedSelection.current || entries.length === 0) {
      return
    }

    const parsed = parseSlug(getCurrentSlug())
    if (parsed?.slug) {
      const match = entrySlugMap.get(parsed.slug)
      if (match) {
        skipNextAutoSelect.current = true
        hasRandomizedSelection.current = true
        urlSync.current.initialized = true
        urlSync.current.skipNext = true
        setSelectedName(match.name)
        setHasSeededSelection(true)
        setPaletteMode(parsed.paletteMode)
        return
      }
    }

    const random = entries[Math.floor(Math.random() * entries.length)]
    if (random) {
      skipNextAutoSelect.current = true
      hasRandomizedSelection.current = true
      setSelectedName(random.name)
      setHasSeededSelection(true)
      setPaletteMode(Math.random() < 0.2 ? 'shiny' : 'normal')
    }
  }, [entries, entrySlugMap, getCurrentSlug, parseSlug, setPaletteMode])

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

  useEffect(() => {
    const handlePopState = () => {
      if (urlSync.current.ignoreHashChange) {
        urlSync.current.ignoreHashChange = false
        return
      }
      const parsed = parseSlug(getCurrentSlug())
      if (!parsed?.slug) {
        return
      }
      const match = entrySlugMap.get(parsed.slug)
      if (match) {
        urlSync.current.skipNext = true
        setSelectedName(match.name)
        setPaletteMode(parsed.paletteMode)
        setHasSeededSelection(true)
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [entrySlugMap, getCurrentSlug, parseSlug, setPaletteMode])

  const debouncedQuery = useDebouncedValue(query, 250)
  const debouncedColorQuery = useDebouncedValue(colorQuery, 250)

  const baseEntries = useMemo(
    () =>
      filterByCriteria(entries, {
        selectedTypes,
        selectedGenerations,
        selectedForms,
      }),
    [entries, selectedTypes, selectedGenerations, selectedForms],
  )

  const filteredEntries = useMemo(() => {
    if (searchMode === 'color') {
      return sortByColorDistance(baseEntries, debouncedColorQuery, paletteMode)
    }

    if (!debouncedQuery.trim()) {
      return baseEntries
    }

    return filterByQuery(baseEntries, debouncedQuery)
  }, [baseEntries, debouncedColorQuery, debouncedQuery, paletteMode, searchMode])

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

  const visibleEntries = useMemo(
    () => filteredEntries.slice(0, resultsLimit),
    [filteredEntries, resultsLimit],
  )
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

  const shareUrl = useMemo(() => {
    if (!activeEntry) {
      return ''
    }
    const slug = buildPokemonSlug(activeEntry)
    const slugWithMode = paletteMode === 'shiny' ? `${slug}-shiny` : slug
    const base = import.meta.env.BASE_URL ?? '/'
    const normalizedBase = base.endsWith('/') ? base : `${base}/`
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}${normalizedBase}#${slugWithMode}`
  }, [activeEntry, paletteMode])

  const handleCopy = async (label: string, text: string) => {
    const success = await copyToClipboard(text)
    setToast(success ? buildToast(label) : 'Unable to copy to clipboard.')
  }

  const handleShare = useCallback(
    async (url: string) => {
      if (!url) {
        return
      }
      await handleCopy('share link', url)
    },
    [handleCopy],
  )

  const handleExportHero = useCallback(async () => {
    if (!activeEntry || isExporting) {
      return
    }

    const node = document.querySelector('[data-hero-export]') as HTMLElement | null
    if (!node) {
      return
    }

    const slug = buildPokemonSlug(activeEntry)
    const slugWithMode = paletteMode === 'shiny' ? `${slug}-shiny` : slug

    setIsExporting(true)
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (element) => {
          if (!(element instanceof HTMLElement)) {
            return true
          }
          return !element.classList.contains('hero-actions')
        },
      })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${slugWithMode}.png`
      link.click()
      setToast('Downloaded hero panel.')
    } catch (error) {
      setToast('Unable to export image.')
    } finally {
      setIsExporting(false)
    }
  }, [activeEntry, isExporting, paletteMode])

  const handleSurprise = useCallback(() => {
    if (filteredEntries.length === 0) {
      return
    }

    const random = filteredEntries[Math.floor(Math.random() * filteredEntries.length)]
    if (random) {
      setSelectedName(random.name)
      setMobileNavOpen(false)
      setHasSeededSelection(true)
    }
  }, [filteredEntries])

  const handleSelectName = useCallback((name: string) => {
    setSelectedName(name)
    setMobileNavOpen(false)
    setHasSeededSelection(true)
  }, [])

  const handleLoadMore = useCallback(() => {
    setResultsLimit((prev) => Math.min(prev + 60, filteredEntries.length))
  }, [filteredEntries.length])

  const isReady = !loading && !error && Boolean(activeEntry)

  useEffect(() => {
    if (!hasSeededSelection || !selectedName) {
      return
    }
    const selected = entryMap.get(selectedName)
    if (!selected) {
      return
    }
    const slug = buildPokemonSlug(selected)
    const slugWithMode = paletteMode === 'shiny' ? `${slug}-shiny` : slug
    const current = getCurrentSlug()
    if (urlSync.current.skipNext) {
      urlSync.current.skipNext = false
      if (current === slugWithMode) {
        return
      }
    }
    if (current === slugWithMode) {
      return
    }

    const nextHash = `#${slugWithMode}`
    if (window.location.hash !== nextHash) {
      urlSync.current.ignoreHashChange = true
      window.location.hash = nextHash
    }
    urlSync.current.initialized = true
  }, [entryMap, getCurrentSlug, hasSeededSelection, paletteMode, selectedName])

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
            {error ? (
              <div className="app-state app-error rounded-none border border-dashed border-red-400 bg-red-50 p-10 text-center text-sm text-red-700">
                {error}
              </div>
            ) : (
              <div className="app-hero-stack space-y-6">
                {isReady && activeEntry ? (
                  <HeroPanel
                    entry={activeEntry}
                    paletteMode={paletteMode}
                    dominantHex={dominantHex}
                    dominantText={dominantText}
                    dominantMuted={dominantMuted}
                    shareUrl={shareUrl}
                    onShare={handleShare}
                    onExport={handleExportHero}
                    isExporting={isExporting}
                  />
                ) : (
                  <div className="hero-panel hero-skeleton skeleton-block" />
                )}
                {isReady && activeEntry ? (
                  <SwatchGrid
                    entryName={activeEntry.name}
                    swatches={activeSwatches}
                    totalPopulation={totalPopulation}
                    isArtAvailable={Boolean(activeEntry.images[paletteMode])}
                    onCopyHex={(hex) => handleCopy('hex', hex)}
                  />
                ) : (
                  <div className="swatch-grid swatch-skeleton layout-swatch grid grid-cols-3 gap-0">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`swatch-skeleton-${index}`} className="swatch-skeleton-item skeleton-block" />
                    ))}
                  </div>
                )}
                {isReady && activeEntry ? (
                  <ExportPanel
                    entry={activeEntry}
                    paletteMode={paletteMode}
                    onCopy={handleCopy}
                  />
                ) : (
                  <div className="export-panel export-skeleton skeleton-block" />
                )}
              </div>
            )}

            {!error && (
              <div className={`results-fade ${isReady ? 'is-ready' : ''}`}>
                <ResultsPanel
                  entries={visibleEntries}
                  totalCount={filteredEntries.length}
                  activeEntryName={activeEntry?.name ?? null}
                  paletteMode={paletteMode}
                  canLoadMore={visibleEntries.length < filteredEntries.length}
                  onSelect={handleSelectName}
                  onLoadMore={handleLoadMore}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="site-footer w-full text-[10px] uppercase tracking-[0.2em] text-[var(--page-ink-muted)]">
        <span>
          © 2026 Poke Hexcolor by Darkness AKA Shiva. All Pokemon artwork and
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
