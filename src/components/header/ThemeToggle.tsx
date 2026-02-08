type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Toggle dark mode"
      onClick={onToggle}
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
  )
}
