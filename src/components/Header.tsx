import { motion } from 'framer-motion'

import { buttonBase } from './styles'

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  return (
    <header className="site-header header-shell flex w-full flex-col gap-5 rounded-none bg-[var(--page-surface)] px-6 py-5 shadow-sm backdrop-blur layout-header sm:px-8">
      <div className="header-top flex flex-wrap items-center justify-between gap-4">
        <div className="header-brand flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-[var(--page-ink-muted)]">
          <span className="header-logo">Poke Hexcolor</span>
          <span className="header-gen rounded-full border border-[var(--page-stroke)] bg-[var(--page-surface-strong)] px-3 py-1 text-[10px] tracking-[0.35em] text-[var(--page-ink)]">
            Gen 1-9
          </span>
        </div>
        <div className="header-actions flex flex-wrap items-center gap-2">
          <button
            className={`${buttonBase} header-toggle border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)] shadow-none hover:shadow-none`}
            onClick={onToggleTheme}
          >
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            className={`${buttonBase} header-github border-transparent bg-[var(--page-ink)] text-[var(--page-a)] shadow-none hover:shadow-none`}
            href="https://github.com/pokehex/pokehex.github.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="header-hero grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      >
        <div className="header-copy space-y-3">
          <h1 className="header-title font-display text-3xl leading-tight text-[var(--page-ink)] sm:text-4xl">
            Official-art palettes for every Pokemon form.
          </h1>
          <p className="header-subtitle max-w-2xl text-sm text-[var(--page-ink-muted)] sm:text-base">
            Search by name, number, or nearest color match to reveal dominant
            swatches. Filter by generation, type, and form, then export clean
            palette snippets.
          </p>
        </div>
        <div className="header-meta flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--page-ink-muted)]">
          <span className="header-meta-chip rounded-full border border-[var(--page-stroke)] px-3 py-2">
            Official art only
          </span>
          <span className="header-meta-chip rounded-full border border-[var(--page-stroke)] px-3 py-2">
            3 swatch palettes
          </span>
        </div>
      </motion.div>
    </header>
  )
}
