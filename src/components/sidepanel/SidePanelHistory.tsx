import './SidePanel.css'
import type { CSSProperties } from 'react'

import type { PaletteMode, PokemonEntry } from '../../lib/types'
import { chipBase, panelCardBase } from '../styles'

type SidePanelHistoryProps = {
  historyEntries: PokemonEntry[]
  paletteMode: PaletteMode
  panelSwatchA: string
  chipStyle: (active: boolean, base: string) => CSSProperties
  onSelectName: (name: string) => void
}

export const SidePanelHistory = ({
  historyEntries,
  paletteMode,
  panelSwatchA,
  chipStyle,
  onSelectName,
}: SidePanelHistoryProps) => {
  return (
    <div className={`${panelCardBase} side-panel-section side-panel-history space-y-3`}>
      <h3 className="side-panel-section-heading text-sm font-semibold uppercase tracking-[0.1em]">
        Palette History
      </h3>
      {historyEntries.length === 0 ? (
        <p className="side-panel-empty text-sm text-[var(--panel-ink-muted)]">
          Pick a Pokemon to start building a quick-access strip.
        </p>
      ) : (
        <div className="side-panel-history-list flex flex-wrap gap-[2px]">
          {historyEntries.map((entry) => (
            <button
              key={`history-${entry.name}`}
              className={`${chipBase} side-panel-history-chip flex items-center gap-2 px-2 py-1.5 text-[10px] tracking-[0.18em]`}
              style={chipStyle(false, panelSwatchA)}
              onClick={() => onSelectName(entry.name)}
            >
              <span className="side-panel-history-swatches flex gap-[2px]">
              {entry.palettes[paletteMode].swatches.slice(0, 3).map((swatch) => (
                  <span
                    key={`${entry.name}-${swatch.hex}`}
                    className="side-panel-history-dot h-3 w-3 rounded-full"
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
  )
}
