# Poke Hexcolor

Poke Hexcolor is a React + TypeScript web app that surfaces dominant color palettes from official Pokemon artwork. You can search by name/number or nearest color, filter by type/generation/form, and export palette data in multiple formats.

## Features

- Search by Pokemon name, species number, or color distance.
- Toggle normal and shiny palettes.
- Filter by generation, type, and form tags.
- View dominant swatches and base stats for each form.
- Copy exports as HEX list, CSS variables, JSON, or badge HTML.
- Share direct links via URL hash (`#pokemon-slug` / `#pokemon-slug-shiny`).
- Export the hero panel as a PNG.

## Tech stack

- React 19
- TypeScript 5
- Vite 7
- Vitest + Testing Library
- ESLint 9

## Getting started

Prerequisites:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm ci
```

Start local dev server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check and build for production.
- `npm run lint`: Run ESLint across the repo.
- `npm run test`: Run tests once with Vitest.
- `npm run test:watch`: Run Vitest in watch mode.
- `npm run generate:index`: Build/update `public/data/pokemon-index.json`.

## Data generation

The app consumes `public/data/pokemon-index.json`. Regenerate it with:

```bash
npm run generate:index
```

Optional environment variables for `generate:index`:

- `CONCURRENCY` (default `6`)
- `LIMIT` (default `0`, meaning no limit)
- `OFFSET` (default `0`)
- `SIZE` (default `128`, image resize target for palette extraction)
- `SWATCHES` (default `3`)

Example:

```bash
CONCURRENCY=8 LIMIT=151 npm run generate:index
```

## Project layout

- `src/App.tsx`: Main app orchestration and UI composition.
- `src/components/`: Hero, side panel, results, swatches, export controls.
- `src/hooks/`: State, storage, search/filter, index loading, theming.
- `src/lib/`: Color math, filtering, export formatting, shared types.
- `scripts/generate-index.ts`: Pokemon index + palette generator.
- `public/data/pokemon-index.json`: Generated dataset used at runtime.

## CI and deployment

- CI checks (`lint`, `test`, `build`) run in GitHub Actions on pull requests and pushes to `main`.
- GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.
- Vite base path is configured for Pages in `vite.config.ts` (`/pokehex/`).

## Attribution

Pokemon data and sprites are sourced from [PokeAPI](https://pokeapi.co/) and the public PokeAPI sprite repository. Pokemon names, artwork, and trademarks belong to their respective owners.
