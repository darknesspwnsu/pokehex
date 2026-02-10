import './ShinySparkle.css'
import type { CSSProperties } from 'react'
import sparkleUrl from '../../assets/shiny-sparkle.png'

type ShinySparkleProps = {
  className?: string
  label?: string
}

export const ShinySparkle = ({ className, label = 'Shiny' }: ShinySparkleProps) => {
  return (
    <span
      className={`shiny-sparkle${className ? ` ${className}` : ''}`}
      aria-label={label}
      role="img"
      style={{ '--sparkle-url': `url(${sparkleUrl})` } as CSSProperties}
    />
  )
}
