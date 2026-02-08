import { motion } from 'framer-motion'

import { buttonBase, cardBase } from './styles'
import type { PaletteMode, PokemonEntry } from '../lib/types'
import { formatDex, getContrastColor, toRgba } from '../lib/ui'

type ResultsPanelProps = {
  entries: PokemonEntry[]
  totalCount: number
  activeEntryName: string | null
  paletteMode: PaletteMode
  dominantHex: string
  canLoadMore: boolean
  onSelect: (name: string) => void
  onLoadMore: () => void
}

export const ResultsPanel = ({
  entries,
  totalCount,
  activeEntryName,
  paletteMode,
  dominantHex,
  canLoadMore,
  onSelect,
  onLoadMore,
}: ResultsPanelProps) => {
  return (
    <div className={`${cardBase} results-panel p-3`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
          Results
        </h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--page-ink-muted)]">
          Showing {entries.length} of {totalCount}
        </span>
      </div>

      <div className="results-grid mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {entries.map((entry) => {
          const isActive = entry.name === activeEntryName
          const swatches = entry.palettes[paletteMode].swatches
          const cardSwatchA = swatches[0]?.hex ?? dominantHex
          const cardSwatchB = swatches[1]?.hex ?? cardSwatchA
          const cardSwatchC = swatches[2]?.hex ?? cardSwatchB
          const cardText = getContrastColor(cardSwatchA)
          const cardMuted =
            cardText === '#0B0D11'
              ? 'rgba(11,13,17,0.78)'
              : 'rgba(248,247,242,0.88)'
          const baseShadow = `0 12px 26px ${toRgba(cardSwatchA, 0.22)}`
          const labelBackdrop = toRgba(
            cardText === '#0B0D11' ? '#ffffff' : '#0B0D11',
            0.2,
          )
          const labelShadow =
            cardText === '#0B0D11'
              ? '0 1px 6px rgba(255,255,255,0.35)'
              : '0 1px 6px rgba(0,0,0,0.45)'
          const cardStyle = {
            backgroundImage: `linear-gradient(140deg, ${toRgba(cardSwatchA, 0.95)} 0%, ${toRgba(cardSwatchB, 0.88)} 55%, ${toRgba(cardSwatchC, 0.85)} 100%)`,
            color: cardText,
            boxShadow: isActive
              ? `0 0 0 2px ${toRgba(cardSwatchA, 0.7)}, 0 20px 40px ${toRgba(cardSwatchB, 0.35)}`
              : baseShadow,
          }

          return (
            <motion.button
              key={entry.name}
              layout
              whileHover={{ y: -4 }}
              className="result-card relative overflow-hidden rounded-lg text-left transition"
              style={cardStyle}
              onClick={() => onSelect(entry.name)}
            >
              <div
                className="result-card-image flex-shrink-0 overflow-hidden rounded-sm"
                style={{ backgroundColor: toRgba(cardSwatchA, 0.2) }}
              >
                {entry.images[paletteMode] ? (
                  <img
                    src={entry.images[paletteMode]}
                    alt={entry.displayName}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-[10px]"
                    style={{ color: cardMuted }}
                  >
                    No art
                  </div>
                )}
                <div
                  className="result-card-label rounded-none px-2 py-1"
                  style={{ backgroundColor: labelBackdrop, textShadow: labelShadow }}
                >
                  <p className="text-[11px] font-semibold leading-tight">
                    {entry.displayName}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-[0.16em]"
                    style={{ color: cardMuted }}
                  >
                    #{formatDex(entry.speciesId)}
                  </p>
                </div>
              </div>
              <div className="result-card-swatches flex gap-1.5">
                {swatches.map((swatch) => (
                  <span
                    key={`${entry.name}-${swatch.hex}`}
                    className="h-2 w-full rounded-full"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            className={`${buttonBase} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
            onClick={onLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
