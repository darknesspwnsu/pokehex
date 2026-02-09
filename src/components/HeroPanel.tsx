import { motion } from 'framer-motion'

import { TYPE_COLORS } from '../lib/constants'
import { formatDex, getContrastColor, toRgba } from '../lib/ui'
import type { PaletteMode, PokemonEntry } from '../lib/types'

type HeroPanelProps = {
  entry: PokemonEntry
  paletteMode: PaletteMode
  dominantHex: string
  dominantText: string
  dominantMuted: string
}

export const HeroPanel = ({
  entry,
  paletteMode,
  dominantHex,
  dominantText,
  dominantMuted,
}: HeroPanelProps) => {
  return (
    <motion.div
      key={entry.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="hero-panel hero-shell rounded-none shadow-float"
      style={{
        backgroundColor: dominantHex,
        color: dominantText,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2), transparent 60%)',
      }}
    >
      <div className="hero-content flex items-center justify-between gap-6 layout-hero">
        <div className="hero-info hero-copy flex-1 space-y-4">
          <p className="hero-kicker text-xs uppercase tracking-[0.35em]" style={{ color: dominantMuted }}>
            Dominant color
          </p>
          <h2 className="hero-title font-display text-4xl sm:text-5xl">{entry.displayName}</h2>
          <p className="hero-meta text-sm sm:text-base" style={{ color: dominantMuted }}>
            #{formatDex(entry.speciesId)} · Gen {entry.generation} · {paletteMode}
          </p>
          <div className="hero-types flex flex-wrap gap-2">
            {entry.types.map((type) => (
              <span
                key={`${entry.name}-${type}`}
                className="hero-type rounded-none px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]"
                style={{
                  backgroundColor: TYPE_COLORS[type] ?? '#64748B',
                  color: getContrastColor(TYPE_COLORS[type] ?? '#64748B'),
                }}
              >
                {type}
              </span>
            ))}
          </div>
          <div
            className="hero-chip mt-4 inline-flex items-center gap-3 rounded-none px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em]"
            style={{
              backgroundColor: toRgba(dominantText, 0.18),
              borderColor: toRgba(dominantText, 0.25),
            }}
          >
            <span className="hero-chip-hex">{dominantHex}</span>
            <span className="hero-chip-label" style={{ color: dominantMuted }}>
              dominant
            </span>
          </div>
        </div>
        <div className="hero-art flex flex-1 items-center justify-center">
          {entry.images[paletteMode] ? (
            <img
              src={entry.images[paletteMode]}
              alt={entry.displayName}
              className="hero-art-image w-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]"
              loading="lazy"
            />
          ) : (
            <div
              className="hero-art-placeholder flex h-64 w-64 items-center justify-center text-xs"
              style={{ color: dominantMuted }}
            >
              No official art
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
