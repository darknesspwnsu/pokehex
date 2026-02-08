import type { CSSProperties } from 'react'

import type { FormTag, PaletteMode, PokemonEntry } from '../lib/types'
import { SidePanelFilters } from './sidepanel/SidePanelFilters'
import { SidePanelHistory } from './sidepanel/SidePanelHistory'
import { SidePanelSearch } from './sidepanel/SidePanelSearch'
import { SidePanelSelected } from './sidepanel/SidePanelSelected'

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
    <aside className="side-panel rounded-none shadow-float backdrop-blur" style={panelStyle}>
      <div className="side-panel-content space-y-8">
        <SidePanelSelected activeEntry={activeEntry} />
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
          onColorChange={onColorChange}
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
