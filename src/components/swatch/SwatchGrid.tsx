import './SwatchGrid.css'
import type { PaletteSwatch } from '../../lib/types'
import { SwatchCard } from './SwatchCard'

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
    <div className="swatch-grid swatch-grid-shell grid grid-cols-3 gap-0 layout-swatch">
      {swatches.map((swatch) => {
        const percentage = totalPopulation
          ? Math.round((swatch.population / totalPopulation) * 100)
          : 0
        return (
          <SwatchCard
            key={`${entryName}-${swatch.hex}`}
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
