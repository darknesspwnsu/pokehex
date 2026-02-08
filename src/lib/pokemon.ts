import type { FormTag } from './types'

const SPECIAL_NAME_MAP: Record<string, string> = {
  'farfetchd': "Farfetch'd",
  'sirfetchd': "Sirfetch'd",
  'mr-mime': 'Mr. Mime',
  'mr-rime': 'Mr. Rime',
  'mime-jr': 'Mime Jr.',
  'type-null': 'Type: Null',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'tapu-koko': 'Tapu Koko',
  'tapu-lele': 'Tapu Lele',
  'tapu-bulu': 'Tapu Bulu',
  'tapu-fini': 'Tapu Fini',
  'chien-pao': 'Chien-Pao',
  'chi-yu': 'Chi-Yu',
  'ting-lu': 'Ting-Lu',
  'wo-chien': 'Wo-Chien',
  'nidoran-f': 'Nidoran F',
  'nidoran-m': 'Nidoran M',
}

const FORM_TOKEN_LABELS: Record<string, string> = {
  mega: 'Mega',
  gmax: 'Gigantamax',
  primal: 'Primal',
  origin: 'Origin',
  totem: 'Totem',
  alola: 'Alolan',
  alolan: 'Alolan',
  galar: 'Galarian',
  galarian: 'Galarian',
  hisui: 'Hisuian',
  hisuian: 'Hisuian',
  paldea: 'Paldean',
  paldean: 'Paldean',
  female: 'Female',
  male: 'Male',
}

const REGION_TOKENS = new Set([
  'alola',
  'alolan',
  'galar',
  'galarian',
  'hisui',
  'hisuian',
  'paldea',
  'paldean',
])


const titleCase = (value: string) =>
  value ? `${value[0].toUpperCase()}${value.slice(1)}` : value

export const formatPokemonName = (slug: string) => {
  const normalized = slug.toLowerCase()
  if (SPECIAL_NAME_MAP[normalized]) {
    return SPECIAL_NAME_MAP[normalized]
  }

  return normalized
    .split('-')
    .map((token) => titleCase(token))
    .join(' ')
}

export const formatFormLabel = (slug: string) => {
  const normalized = slug.toLowerCase()
  if (SPECIAL_NAME_MAP[normalized]) {
    return SPECIAL_NAME_MAP[normalized]
  }

  return normalized
    .split('-')
    .map((token) => FORM_TOKEN_LABELS[token] ?? titleCase(token))
    .join(' ')
}

export const formatPokemonDisplayName = (
  pokemonName: string,
  speciesName: string,
) => {
  const baseName = formatPokemonName(speciesName)
  if (pokemonName === speciesName) {
    return baseName
  }

  const prefix = `${speciesName}-`
  const suffix = pokemonName.startsWith(prefix)
    ? pokemonName.slice(prefix.length)
    : pokemonName

  return `${baseName} ${formatFormLabel(suffix)}`
}

export const deriveFormTags = (name: string, isDefault: boolean): FormTag[] => {
  const tags = new Set<FormTag>()
  const tokens = name.toLowerCase().split('-')

  if (isDefault) {
    tags.add('default')
  }

  if (tokens.includes('mega')) {
    tags.add('mega')
  }

  if (tokens.includes('gmax')) {
    tags.add('gmax')
  }

  if (tokens.some((token) => REGION_TOKENS.has(token))) {
    tags.add('regional')
  }

  if (tokens.includes('female') || tokens.includes('male')) {
    tags.add('gendered')
  }

  if (tokens.includes('primal')) {
    tags.add('primal')
  }

  if (tokens.includes('origin')) {
    tags.add('origin')
  }

  if (tokens.includes('totem')) {
    tags.add('totem')
  }

  if (!isDefault && tags.size === 0) {
    tags.add('variant')
  }

  return Array.from(tags)
}
