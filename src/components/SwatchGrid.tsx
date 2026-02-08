import type { PaletteSwatch } from '../lib/types'
import { getContrastColor } from '../lib/ui'

type SwatchGridProps = {
  entryName: string
  swatches: PaletteSwatch[]
  totalPopulation: number
  onCopyHex: (hex: string) => void
}

export const SwatchGrid = ({
  entryName,
  swatches,
  totalPopulation,
  onCopyHex,
}: SwatchGridProps) => {
  return (
    <div className="swatch-grid swatch-grid-shell grid grid-cols-3 gap-4 layout-swatch">
      {swatches.map((swatch) => {
        const percentage = totalPopulation
          ? Math.round((swatch.population / totalPopulation) * 100)
          : 0
        return (
          <button
            key={`${entryName}-${swatch.hex}`}
            type="button"
            aria-label={`Copy ${swatch.hex}`}
            onClick={() => onCopyHex(swatch.hex)}
            className="swatch-button swatch-card group relative flex cursor-pointer flex-col justify-between rounded-sm border px-5 py-4 text-left shadow-glow transition hover:-translate-y-1 hover:brightness-105 hover:shadow-[0_0_0_2px_var(--page-glow),0_18px_36px_rgba(0,0,0,0.2)] active:scale-[0.98] active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--page-glow)]/60"
            style={{
              backgroundColor: swatch.hex,
              color: getContrastColor(swatch.hex),
              borderColor: swatch.hex,
            }}
          >
            <div className="swatch-card-header flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em]">
              <span className="swatch-card-hex">{swatch.hex}</span>
              <span className="swatch-card-percent">{percentage}%</span>
            </div>
            <div className="swatch-card-label mt-2 text-[11px] uppercase tracking-[0.1em] opacity-80">
              Swatch
            </div>
          </button>
        )
      })}
    </div>
  )
}
