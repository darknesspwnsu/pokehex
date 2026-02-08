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
    <div className={`${cardBase} results-panel results-shell flex min-h-0 flex-1 flex-col p-3`}>
      <div className="results-header flex items-center justify-between">
        <h2 className="results-title text-sm font-semibold uppercase tracking-[0.1em]">
          Results
        </h2>
        <span className="results-count text-xs uppercase tracking-[0.1em] text-[var(--page-ink-muted)]">
          Showing {entries.length} of {totalCount}
        </span>
      </div>

      <div className="results-scroll results-scrollable mt-3 flex min-h-0 flex-1 flex-col gap-3">
        <div className="results-grid grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
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
            const taperOverlay = `linear-gradient(90deg, ${toRgba(
              cardSwatchA,
              0,
            )} 0%, ${toRgba(cardSwatchB, 0.16)} 45%, ${toRgba(
              cardSwatchC,
              0.38,
            )} 100%)`
            const borderTone = toRgba(cardSwatchB, isActive ? 0.75 : 0.5)
            const cardStyle = {
              backgroundImage: `linear-gradient(140deg, ${toRgba(cardSwatchA, 0.95)} 0%, ${toRgba(cardSwatchB, 0.88)} 55%, ${toRgba(cardSwatchC, 0.85)} 100%)`,
              color: cardText,
              borderColor: borderTone,
              boxShadow: isActive
                ? `0 0 0 2px ${toRgba(cardSwatchB, 0.6)}, 0 20px 40px ${toRgba(cardSwatchB, 0.35)}`
                : baseShadow,
            }

            return (
              <motion.button
                key={entry.name}
                layout
                whileHover={{ y: -4 }}
                className="result-card result-card-button group relative flex items-center gap-3 overflow-hidden rounded-md border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--page-glow)]/60"
                style={cardStyle}
                onClick={() => onSelect(entry.name)}
              >
                <div
                  className="result-card-taper"
                  style={{ backgroundImage: taperOverlay }}
                />
                <div
                  className="result-card-image flex-shrink-0 overflow-hidden rounded-sm"
                  style={{ backgroundColor: toRgba(cardSwatchA, 0.2) }}
                >
                  {entry.images[paletteMode] ? (
                    <img
                      src={entry.images[paletteMode]}
                      alt={entry.displayName}
                      className="result-card-image-asset h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="result-card-placeholder flex h-full w-full items-center justify-center text-[10px]"
                      style={{ color: cardMuted }}
                    >
                      No art
                    </div>
                  )}
                </div>
                <div className="result-card-body">
                  <div className="result-card-copy">
                    <p className="result-card-name text-[13px] font-semibold leading-tight">
                      {entry.displayName}
                    </p>
                    <p
                      className="result-card-dex text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: cardMuted }}
                    >
                      #{formatDex(entry.speciesId)}
                    </p>
                  </div>
                  <div className="result-card-swatches flex gap-1.5">
                    {swatches.map((swatch) => (
                      <span
                        key={`${entry.name}-${swatch.hex}`}
                        className="result-card-swatch h-2 w-full rounded-full"
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {canLoadMore && (
          <div className="results-load flex justify-center pb-2">
            <button
              className={`${buttonBase} results-load-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
              onClick={onLoadMore}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
