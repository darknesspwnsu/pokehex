import type { PaletteMode, PokemonEntry } from './types'

export const toHexList = (entry: PokemonEntry, mode: PaletteMode) =>
  entry.palettes[mode].swatches.map((swatch) => swatch.hex).join(', ')

export const toPaletteJson = (entry: PokemonEntry, mode: PaletteMode) =>
  JSON.stringify(
    {
      name: entry.displayName,
      id: entry.id,
      speciesId: entry.speciesId,
      mode,
      image: entry.images[mode],
      types: entry.types,
      swatches: entry.palettes[mode].swatches,
    },
    null,
    2,
  )

export const toCssVariables = (entry: PokemonEntry, mode: PaletteMode) => {
  const swatches = entry.palettes[mode].swatches

  return [
    ':root {',
    `  --pokemon-name: "${entry.displayName}";`,
    `  --pokemon-species-id: ${entry.speciesId};`,
    `  --pokemon-mode: "${mode}";`,
    `  --pokemon-swatch-1: ${swatches[0]?.hex ?? '#000000'};`,
    `  --pokemon-swatch-2: ${swatches[1]?.hex ?? '#000000'};`,
    `  --pokemon-swatch-3: ${swatches[2]?.hex ?? '#000000'};`,
    '}',
  ].join('\n')
}

export const toBadgeHtml = (entry: PokemonEntry, mode: PaletteMode) => {
  const swatches = entry.palettes[mode].swatches
  const imageUrl = entry.images[mode]

  return [
    '<div style="display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;border:1px solid rgba(0,0,0,0.1);box-shadow:0 10px 30px rgba(15,23,42,0.15);font-family:Space Grotesk,Arial,sans-serif;width:360px;background:#ffffff;">',
    `<div style="width:68px;height:68px;border-radius:14px;overflow:hidden;background:#f3f4f6;display:flex;align-items:center;justify-content:center;">${
      imageUrl
        ? `<img src="${imageUrl}" alt="${entry.displayName}" style="width:100%;height:100%;object-fit:contain;" />`
        : '<span style="color:#6b7280;font-size:10px;">No art</span>'
    }</div>`,
    '<div style="flex:1;">',
    `<div style="font-weight:700;font-size:14px;">${entry.displayName}</div>`,
    `<div style="font-size:11px;color:#6b7280;margin-top:2px;">#${entry.speciesId} · ${mode}</div>`,
    '<div style="display:flex;gap:6px;margin-top:10px;">',
    ...swatches.map(
      (swatch) =>
        `<span style="width:18px;height:18px;border-radius:6px;background:${swatch.hex};display:inline-block;"></span>`,
    ),
    '</div>',
    '</div>',
    '</div>',
  ].join('')
}
