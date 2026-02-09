import './SidePanel.css'
import { TYPE_COLORS } from '../../lib/constants'
import { formatDex, getContrastColor } from '../../lib/ui'
import type { PokemonEntry } from '../../lib/types'
import { panelCardBase } from '../styles'

type SidePanelSelectedProps = {
  activeEntry: PokemonEntry | null
}

export const SidePanelSelected = ({ activeEntry }: SidePanelSelectedProps) => {
  return (
    <div className={`${panelCardBase} side-panel-section side-panel-selected space-y-3`}>
      <p className="side-panel-label text-xs uppercase tracking-[0.35em] text-[var(--panel-ink-muted)]">
        Selected Pokemon
      </p>
      <h2 className="side-panel-title font-display text-3xl">
        {activeEntry?.displayName ?? 'Loading...'}
      </h2>
      <div className="side-panel-meta text-xs uppercase tracking-[0.25em] text-[var(--panel-ink-muted)]">
        {activeEntry
          ? `#${formatDex(activeEntry.speciesId)} · Gen ${activeEntry.generation}`
          : 'Fetching data'}
      </div>
      <div className="side-panel-types flex flex-wrap gap-[2px]">
        {activeEntry?.types.map((type) => (
          <span
            key={`${activeEntry.name}-${type}`}
            className="side-panel-type rounded-none px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]"
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
  )
}
