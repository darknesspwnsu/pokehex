import './ResultsPanel.css'
import { memo } from 'react'

type ResultsHeaderProps = {
  count: number
  totalCount: number
}

const ResultsHeaderComponent = ({ count, totalCount }: ResultsHeaderProps) => {
  return (
    <div className="results-header flex items-center justify-between">
      <h2 className="results-title text-sm font-semibold uppercase tracking-[0.1em]">
        Explore
      </h2>
      <span className="results-count text-xs uppercase tracking-[0.1em] text-[var(--page-ink-muted)]">
        Showing {count} of {totalCount}
      </span>
    </div>
  )
}

ResultsHeaderComponent.displayName = 'ResultsHeader'

export const ResultsHeader = memo(ResultsHeaderComponent)
