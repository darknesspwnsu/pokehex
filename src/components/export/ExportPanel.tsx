import './ExportPanel.css'
import { toBadgeHtml, toCssVariables, toHexList, toPaletteJson } from '../../lib/exports'
import type { PaletteMode, PokemonEntry } from '../../lib/types'
import { actionButton, cardBase } from '../styles'

type ExportPanelProps = {
  entry: PokemonEntry
  paletteMode: PaletteMode
  onCopy: (label: string, text: string) => void
}

export const ExportPanel = ({ entry, paletteMode, onCopy }: ExportPanelProps) => {
  return (
    <div className={`${cardBase} export-panel p-6`}>
      <p className="export-label text-xs font-semibold uppercase tracking-[0.1em] text-[var(--page-ink-muted)]">
        Export Palette
      </p>
      <div className="export-actions mt-4 flex flex-wrap gap-3">
        <button
          className={`${actionButton} export-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
          onClick={() => onCopy('hex list', toHexList(entry, paletteMode))}
        >
          Copy HEX
        </button>
        <button
          className={`${actionButton} export-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
          onClick={() => onCopy('CSS variables', toCssVariables(entry, paletteMode))}
        >
          Copy CSS
        </button>
        <button
          className={`${actionButton} export-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
          onClick={() => onCopy('JSON', toPaletteJson(entry, paletteMode))}
        >
          Copy JSON
        </button>
        <button
          className={`${actionButton} export-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] flex-1 min-w-[140px]`}
          onClick={() => onCopy('badge HTML', toBadgeHtml(entry, paletteMode))}
        >
          Copy Badge
        </button>
      </div>
    </div>
  )
}
