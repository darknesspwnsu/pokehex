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
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
            className="theme-toggle relative flex h-10 w-16 items-center rounded-full border border-[var(--page-stroke)] bg-[var(--page-surface-strong)] px-1"
          >
            <span className="theme-toggle-track absolute inset-0 rounded-full" />
            <span className="theme-toggle-icon theme-toggle-sun flex h-7 w-7 items-center justify-center rounded-full text-[12px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </span>
            <span className="theme-toggle-icon theme-toggle-moon flex h-7 w-7 items-center justify-center rounded-full text-[12px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
              </svg>
            </span>
            <span className="theme-toggle-knob absolute left-1 top-1 h-8 w-8 rounded-full bg-[var(--page-ink)]" />
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
          <h1 className="header-title font-display text-4xl leading-tight text-[var(--page-ink)] sm:text-5xl">
            Poke Hexcolor
          </h1>
          <p className="header-subtitle text-base font-semibold text-[var(--page-ink)] sm:text-lg">
            Official-art palettes for every Pokemon form.
          </p>
          <p className="header-description max-w-2xl text-sm text-[var(--page-ink-muted)] sm:text-base">
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
