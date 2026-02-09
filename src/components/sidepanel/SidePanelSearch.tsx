import type { CSSProperties } from 'react'

import { getContrastColor } from '../../lib/ui'
import type { PaletteMode } from '../../lib/types'
import { chipBase, panelCardBase, searchFieldBase } from '../styles'

type SidePanelSearchProps = {
  searchMode: 'name' | 'color'
  query: string
  colorQuery: string
  normalizedColor: string
  filteredCount: number
  paletteMode: PaletteMode
  panelSwatchB: string
  panelSwatchC: string
  chipStyle: (active: boolean, base: string) => CSSProperties
  onSearchModeChange: (mode: 'name' | 'color') => void
  onQueryChange: (value: string) => void
  onClearQuery: () => void
  onColorChange: (value: string) => void
  onResetColor: () => void
  onColorBlur: () => void
  onPaletteModeChange: (mode: PaletteMode) => void
  onSurprise: () => void
}

export const SidePanelSearch = ({
  searchMode,
  query,
  colorQuery,
  normalizedColor,
  filteredCount,
  paletteMode,
  panelSwatchB,
  panelSwatchC,
  chipStyle,
  onSearchModeChange,
  onQueryChange,
  onClearQuery,
  onColorChange,
  onResetColor,
  onColorBlur,
  onPaletteModeChange,
  onSurprise,
}: SidePanelSearchProps) => {
  return (
    <div className={`${panelCardBase} side-panel-section side-panel-search space-y-4`}>
      <div className="side-panel-toggle flex flex-wrap gap-[2px]">
        <button
          className={`${chipBase} side-panel-toggle-button`}
          style={chipStyle(searchMode === 'name', panelSwatchB)}
          onClick={() => onSearchModeChange('name')}
        >
          Name / Number
        </button>
        <button
          className={`${chipBase} side-panel-toggle-button`}
          style={chipStyle(searchMode === 'color', panelSwatchB)}
          onClick={() => onSearchModeChange('color')}
        >
          Color Match
        </button>
      </div>

      <div className="side-panel-search-field">
        <p className="side-panel-section-title text-xs font-semibold uppercase tracking-[0.1em] text-[var(--panel-ink-muted)]">
          Search
        </p>
        {searchMode === 'name' ? (
          <div className={`${searchFieldBase} search-field side-panel-search-input`}>
            <input
              className="search-field-input flex-1 border-none bg-transparent text-center text-base font-semibold tracking-[0.04em] outline-none focus:ring-0"
              placeholder="Search by name or Pokedex number"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={onClearQuery}
                className="search-field-clear flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-semibold"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <span className="search-field-icon flex h-8 w-8 items-center justify-center rounded-full">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
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
          <div className={`${searchFieldBase} search-field side-panel-search-input`}>
            <input
              aria-label="Pick a color"
              type="color"
              value={normalizedColor}
              onChange={(event) => onColorChange(event.target.value.toUpperCase())}
              className="search-field-color h-10 w-10 cursor-pointer rounded-full border-none bg-transparent focus:ring-0"
            />
            <input
              className="search-field-input flex-1 border-none bg-transparent text-center text-base font-semibold uppercase tracking-[0.16em] outline-none focus:ring-0"
              value={colorQuery}
              onChange={(event) => onColorChange(event.target.value.toUpperCase())}
              onBlur={onColorBlur}
              placeholder="#F97316"
            />
            <button
              type="button"
              onClick={onResetColor}
              className="search-field-clear flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-semibold"
              aria-label="Reset color"
            >
              ×
            </button>
            <span
              className="search-field-chip rounded-full border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]"
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

      <div className="side-panel-actions flex flex-wrap items-center justify-center gap-[2px]">
        <button
          className={`${chipBase} side-panel-action`}
          style={chipStyle(true, panelSwatchC)}
          onClick={onSurprise}
        >
          Surprise me
        </button>
        <button
          className={`${chipBase} side-panel-action`}
          style={chipStyle(paletteMode === 'normal', panelSwatchB)}
          onClick={() => onPaletteModeChange('normal')}
        >
          Normal
        </button>
        <button
          className={`${chipBase} side-panel-action`}
          style={chipStyle(paletteMode === 'shiny', panelSwatchC)}
          onClick={() => onPaletteModeChange('shiny')}
        >
          Shiny
        </button>
        <span className="side-panel-count text-xs uppercase tracking-[0.1em] text-[var(--panel-ink-muted)]">
          {filteredCount} results
        </span>
      </div>
    </div>
  )
}
