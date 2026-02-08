import type { CSSProperties } from 'react'

import { FORM_FILTERS, TYPE_COLORS } from '../lib/constants'
import { formatDex, getContrastColor, toRgba } from '../lib/ui'
import type { FormTag, PaletteMode, PokemonEntry } from '../lib/types'
import { chipBase, panelCardBase, searchFieldBase } from './styles'

type SidePanelProps = {
  panelStyle: CSSProperties
  activeEntry: PokemonEntry | null
  paletteMode: PaletteMode
  searchMode: 'name' | 'color'
  query: string
  colorQuery: string
  normalizedColor: string
  filteredCount: number
  generationOptions: number[]
  selectedGenerations: number[]
  typeOptions: string[]
  selectedTypes: string[]
  selectedForms: FormTag[]
  historyEntries: PokemonEntry[]
  panelSwatchA: string
  panelSwatchB: string
  panelSwatchC: string
  chipStyle: (active: boolean, base: string) => CSSProperties
  onSearchModeChange: (mode: 'name' | 'color') => void
  onQueryChange: (value: string) => void
  onColorChange: (value: string) => void
  onColorBlur: () => void
  onPaletteModeChange: (mode: PaletteMode) => void
  onSurprise: () => void
  onToggleGeneration: (gen: number) => void
  onToggleType: (type: string) => void
  onToggleForm: (form: FormTag) => void
  onClearFilters: () => void
  onSelectName: (name: string) => void
}

export const SidePanel = ({
  panelStyle,
  activeEntry,
  paletteMode,
  searchMode,
  query,
  colorQuery,
  normalizedColor,
  filteredCount,
  generationOptions,
  selectedGenerations,
  typeOptions,
  selectedTypes,
  selectedForms,
  historyEntries,
  panelSwatchA,
  panelSwatchB,
  panelSwatchC,
  chipStyle,
  onSearchModeChange,
  onQueryChange,
  onColorChange,
  onColorBlur,
  onPaletteModeChange,
  onSurprise,
  onToggleGeneration,
  onToggleType,
  onToggleForm,
  onClearFilters,
  onSelectName,
}: SidePanelProps) => {
  return (
    <aside className="side-panel space-y-8 rounded-none shadow-float backdrop-blur" style={panelStyle}>
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
            onClick={() => onSearchModeChange('name')}
          >
            Name / Number
          </button>
          <button
            className={chipBase}
            style={chipStyle(searchMode === 'color', panelSwatchB)}
            onClick={() => onSearchModeChange('color')}
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
                className="flex-1 border-none bg-transparent text-center text-base font-semibold tracking-[0.04em] text-black outline-none placeholder:text-black/40 focus:ring-0"
                placeholder="Search by name or Pokedex number"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
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
                value={normalizedColor}
                onChange={(event) => onColorChange(event.target.value.toUpperCase())}
                className="h-10 w-10 cursor-pointer rounded-full border-none bg-transparent focus:ring-0"
              />
              <input
                className="flex-1 border-none bg-transparent text-center text-base font-semibold uppercase tracking-[0.16em] text-black outline-none placeholder:text-black/40 focus:ring-0"
                value={colorQuery}
                onChange={(event) => onColorChange(event.target.value.toUpperCase())}
                onBlur={onColorBlur}
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
            onClick={onSurprise}
          >
            Surprise me
          </button>
          <button
            className={chipBase}
            style={chipStyle(paletteMode === 'normal', panelSwatchB)}
            onClick={() => onPaletteModeChange('normal')}
          >
            Normal
          </button>
          <button
            className={chipBase}
            style={chipStyle(paletteMode === 'shiny', panelSwatchC)}
            onClick={() => onPaletteModeChange('shiny')}
          >
            Shiny
          </button>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--panel-ink-muted)]">
            {filteredCount} results
          </span>
        </div>
      </div>

      <div className={`${panelCardBase} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
            Filters
          </h3>
          <button className={chipBase} style={chipStyle(false, panelSwatchA)} onClick={onClearFilters}>
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
                  onClick={() => onToggleGeneration(gen)}
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
                      borderColor: isActive ? toRgba(color, 0.5) : toRgba(color, 0.22),
                      backgroundColor: isActive ? color : toRgba(color, 0.2),
                      color: isActive ? getContrastColor(color) : 'var(--panel-ink)',
                      boxShadow: isActive ? `0 12px 24px ${toRgba(color, 0.35)}` : undefined,
                    }}
                    onClick={() => onToggleType(type)}
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
                  onClick={() => onToggleForm(form.id)}
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
                onClick={() => onSelectName(entry.name)}
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
  )
}
