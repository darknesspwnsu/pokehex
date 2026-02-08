import { motion } from 'framer-motion'

const heroVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 lg:px-16">
      <header className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--ink-muted)]">
            Poke Hexcolor
          </p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Official-art palettes for every Pokemon form.
          </h1>
          <p className="max-w-xl text-base text-[var(--ink-muted)] md:text-lg">
            Search by name, number, or color to reveal bold triads extracted
            from the latest artwork set. Filters, exports, and shiny modes are
            next up.
          </p>
        </motion.div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[var(--stroke)] bg-[var(--card)] px-4 py-2 text-sm font-medium shadow-glow">
            Theme: Light
          </button>
          <a
            className="rounded-full border border-transparent bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--bg)] shadow-glow transition hover:translate-y-[-1px]"
            href="https://github.com/pokehex/pokehex.github.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-6xl">
        <div className="rounded-[32px] border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-float">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--ink-muted)]">
                Build in progress
              </p>
              <h2 className="font-display text-3xl">
                Palette engine, search index, and UI controls are loading.
              </h2>
              <p className="text-sm text-[var(--ink-muted)]">
                Next step: wire up the data pipeline and transform this block
                into the live Poke Hexcolor cockpit.
              </p>
            </div>
            <div className="rounded-3xl border border-dashed border-[var(--stroke)] bg-[var(--bg-muted)] p-6 text-sm text-[var(--ink-muted)]">
              Swatch grid placeholder
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto mt-12 max-w-6xl text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">
        © {year} Poke Hexcolor. All Pokemon artwork and trademarks belong to
        their respective owners.
      </footer>
    </div>
  )
}

export default App
