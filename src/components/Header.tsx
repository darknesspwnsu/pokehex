import logo from '../assets/logo.png'
import logoText from '../assets/logo-text.png'

type HeaderProps = {
  isMobileNavOpen: boolean
  onToggleMobileNav: () => void
}

export const Header = ({ isMobileNavOpen, onToggleMobileNav }: HeaderProps) => {
  return (
    <header className="site-header navbar-shell layout-header flex w-full items-center justify-between rounded-none px-6 py-4 sm:px-8">
      <div className="navbar-left flex items-center gap-3">
        <button
          type="button"
          className="navbar-toggle md:hidden"
          aria-label={isMobileNavOpen ? 'Close filters' : 'Open filters'}
          aria-expanded={isMobileNavOpen}
          aria-controls="side-panel-drawer"
          onClick={onToggleMobileNav}
        >
          {isMobileNavOpen ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
        <div className="navbar-brand flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--page-ink-muted)]">
          <div className="navbar-logo">
            <img src={logo} alt="Poke Hexcolor" className="navbar-logo-image" />
          </div>
          <div className="navbar-title">
            <img src={logoText} alt="Poke Hexcolor" className="navbar-logo-text" />
          </div>
          <span className="navbar-gen rounded-full border border-[var(--page-stroke)] bg-[var(--page-surface-strong)] px-3 py-1 text-[10px] tracking-[0.3em] text-[var(--page-ink)]">
            Gen 1-9
          </span>
        </div>
      </div>
      <div className="navbar-actions flex items-center gap-3">
        <a
          className="navbar-github"
          href="https://github.com/pokehex/pokehex.github.io"
          target="_blank"
          rel="noreferrer"
          aria-label="View repository on GitHub"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </a>
      </div>
    </header>
  )
}
