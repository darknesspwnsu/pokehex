import { motion } from 'framer-motion'

import { buttonBase } from './styles'
import { ThemeToggle } from './header/ThemeToggle'
import logo from '../assets/logo.png'

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  return (
    <header className="site-header header-shell flex w-full flex-col gap-5 rounded-none bg-[var(--page-surface)] px-6 py-5 shadow-sm backdrop-blur layout-header sm:px-8">
      <div className="header-top flex flex-wrap items-center justify-between gap-4">
        <div className="header-brand flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-[var(--page-ink-muted)]">
          <div className="header-logo">
            <img src={logo} alt="Poke Hexcolor" className="header-logo-image" />
          </div>
          <span className="header-gen rounded-full border border-[var(--page-stroke)] bg-[var(--page-surface-strong)] px-3 py-1 text-[10px] tracking-[0.35em] text-[var(--page-ink)]">
            Gen 1-9
          </span>
        </div>
        <div className="header-actions flex flex-wrap items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
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
