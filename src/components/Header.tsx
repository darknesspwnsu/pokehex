import { buttonBase } from './styles'
import { ThemeToggle } from './header/ThemeToggle'
import logo from '../assets/logo.png'
import logoText from '../assets/logo-text.png'

type HeaderProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  return (
    <header className="site-header navbar-shell layout-header flex w-full items-center justify-between rounded-none px-6 py-4 sm:px-8">
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
      <div className="navbar-actions flex items-center gap-3">
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
    </header>
  )
}
