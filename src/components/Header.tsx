import { motion } from 'framer-motion'

import { buttonBase } from './styles'

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  return (
    <header className="site-header flex w-full flex-col gap-5 rounded-none bg-[var(--page-surface-strong)] p-5 shadow-float backdrop-blur layout-header sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-3"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.32em] text-[var(--page-ink-muted)]">
            <span>Poke Hexcolor</span>
            <span className="rounded-none bg-[var(--page-surface)] px-3 py-1 text-[10px] tracking-[0.3em] text-[var(--page-ink)] shadow-[0_10px_20px_rgba(0,0,0,0.12)]">
              Gen 1-9
            </span>
          </div>
          <h1 className="font-display text-4xl leading-tight text-[var(--page-ink)] sm:text-5xl">
            Official-art palettes for every Pokemon form.
          </h1>
          <p className="max-w-2xl text-sm text-[var(--page-ink-muted)] sm:text-base">
            Search by name, number, or nearest color match to reveal dominant
            swatches. Filter by generation, type, and form, then export clean
            palette snippets.
          </p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`${buttonBase} border-[var(--page-stroke)] bg-[var(--page-surface-strong)] text-[var(--page-ink)]`}
            onClick={onToggleTheme}
          >
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            className={`${buttonBase} border-transparent bg-[var(--page-ink)] text-[var(--page-a)]`}
            href="https://github.com/pokehex/pokehex.github.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}
