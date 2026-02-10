import './SwatchGrid.css'
import type { PaletteSwatch } from '../../lib/types'
import { SwatchCard } from './SwatchCard'

type SwatchGridProps = {
  entryName: string
  swatches: PaletteSwatch[]
  totalPopulation: number
  isArtAvailable: boolean
  onCopyHex: (hex: string) => void
}

export const SwatchGrid = ({
  entryName,
  swatches,
  totalPopulation,
  isArtAvailable,
  onCopyHex,
}: SwatchGridProps) => {
  const visibleSwatches = swatches.slice(0, 3)
  if (!isArtAvailable) {
    return (
      <div className="swatch-grid swatch-grid-shell grid grid-cols-3 gap-0 layout-swatch">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`${entryName}-missing-${index}`}
            className="swatch-card-disabled"
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }
  return (
    <div className="swatch-grid swatch-grid-shell grid grid-cols-3 gap-0 layout-swatch">
      {visibleSwatches.map((swatch, index) => {
        const percentage = totalPopulation
          ? Math.round((swatch.population / totalPopulation) * 100)
          : 0
        return (
          <SwatchCard
            key={`${entryName}-${swatch.hex}-${index}`}
            entryName={entryName}
            swatch={swatch}
            percentage={percentage}
            onCopyHex={onCopyHex}
          />
        )
      })}
    </div>
  )
}
