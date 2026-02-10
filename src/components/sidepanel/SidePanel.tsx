import './SidePanel.css'
import type { CSSProperties } from 'react'

import type { FormTag, PaletteMode, PokemonEntry } from '../../lib/types'
import { SidePanelFilters } from './SidePanelFilters'
import { SidePanelHistory } from './SidePanelHistory'
import { SidePanelSearch } from './SidePanelSearch'
import { SidePanelSelected } from './SidePanelSelected'

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
  onClearQuery: () => void
  onColorChange: (value: string) => void
  onResetColor: () => void
  onColorBlur: () => void
  onPaletteModeChange: (mode: PaletteMode) => void
  onSurprise: () => void
  onToggleGeneration: (gen: number) => void
  onToggleType: (type: string) => void
  onToggleForm: (form: FormTag) => void
  onClearFilters: () => void
  onSelectName: (name: string) => void
  onClose?: () => void
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
  onClearQuery,
  onColorChange,
  onResetColor,
  onColorBlur,
  onPaletteModeChange,
  onSurprise,
  onToggleGeneration,
  onToggleType,
  onToggleForm,
  onClearFilters,
  onSelectName,
  onClose,
}: SidePanelProps) => {
  return (
    <aside
      id="side-panel-drawer"
      className="side-panel rounded-none shadow-float backdrop-blur"
      style={panelStyle}
    >
      <div className="side-panel-content space-y-8">
        {onClose ? (
          <div className="side-panel-mobile-header">
            <span className="side-panel-mobile-title">Filters</span>
            <button
              type="button"
              className="side-panel-close"
              onClick={onClose}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>
        ) : null}
        <SidePanelSelected activeEntry={activeEntry} paletteMode={paletteMode} />
        <SidePanelSearch
          searchMode={searchMode}
          query={query}
          colorQuery={colorQuery}
          normalizedColor={normalizedColor}
          filteredCount={filteredCount}
          paletteMode={paletteMode}
          panelSwatchB={panelSwatchB}
          panelSwatchC={panelSwatchC}
          chipStyle={chipStyle}
          onSearchModeChange={onSearchModeChange}
          onQueryChange={onQueryChange}
          onClearQuery={onClearQuery}
          onColorChange={onColorChange}
          onResetColor={onResetColor}
          onColorBlur={onColorBlur}
          onPaletteModeChange={onPaletteModeChange}
          onSurprise={onSurprise}
        />
        <SidePanelFilters
          generationOptions={generationOptions}
          selectedGenerations={selectedGenerations}
          typeOptions={typeOptions}
          selectedTypes={selectedTypes}
          selectedForms={selectedForms}
          panelSwatchA={panelSwatchA}
          panelSwatchB={panelSwatchB}
          chipStyle={chipStyle}
          onToggleGeneration={onToggleGeneration}
          onToggleType={onToggleType}
          onToggleForm={onToggleForm}
          onClearFilters={onClearFilters}
        />
        <SidePanelHistory
          historyEntries={historyEntries}
          paletteMode={paletteMode}
          panelSwatchA={panelSwatchA}
          chipStyle={chipStyle}
          onSelectName={onSelectName}
        />
      </div>
    </aside>
  )
}
