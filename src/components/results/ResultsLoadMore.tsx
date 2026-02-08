import { buttonBase } from '../styles'

type ResultsLoadMoreProps = {
  onLoadMore: () => void
}

export const ResultsLoadMore = ({ onLoadMore }: ResultsLoadMoreProps) => {
  return (
    <div className="results-load flex justify-center pb-2">
      <button
        className={`${buttonBase} results-load-button border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
        onClick={onLoadMore}
      >
        Load more
      </button>
    </div>
  )
}
