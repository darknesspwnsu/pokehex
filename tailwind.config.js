/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(9, 9, 11, 0.08), 0 8px 30px rgba(31, 41, 55, 0.15)',
        float: '0 18px 50px rgba(16, 24, 40, 0.18)',
      },
    },
  },
  plugins: [],
}
