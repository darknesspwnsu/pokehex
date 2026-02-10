import './ResultsPanel.css'
import { cardBase } from '../styles'
import type { PaletteMode, PokemonEntry } from '../../lib/types'
import { ResultCard } from './ResultCard'
import { ResultsHeader } from './ResultsHeader'
import { ResultsLoadMore } from './ResultsLoadMore'

type ResultsPanelProps = {
  entries: PokemonEntry[]
  totalCount: number
  activeEntryName: string | null
  paletteMode: PaletteMode
  canLoadMore: boolean
  onSelect: (name: string) => void
  onLoadMore: () => void
}

export const ResultsPanel = ({
  entries,
  totalCount,
  activeEntryName,
  paletteMode,
  canLoadMore,
  onSelect,
  onLoadMore,
}: ResultsPanelProps) => {
  return (
    <div className={`${cardBase} results-panel results-shell flex min-h-0 flex-1 flex-col p-3`}>
      <ResultsHeader count={entries.length} totalCount={totalCount} />

      <div className="results-scroll results-scrollable mt-3 flex min-h-0 flex-1 flex-col gap-3">
        <div className="results-grid grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {entries.map((entry) => (
            <ResultCard
              key={entry.name}
              entry={entry}
              paletteMode={paletteMode}
              isActive={entry.name === activeEntryName}
              onSelect={onSelect}
            />
          ))}
        </div>

        {canLoadMore && <ResultsLoadMore onLoadMore={onLoadMore} />}
      </div>
    </div>
  )
}
