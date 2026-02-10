export type RGB = [number, number, number]

export type PaletteMode = 'normal' | 'shiny'

export type PaletteSwatch = {
  hex: string
  rgb: RGB
  population: number
}

export type PaletteSet = {
  swatches: PaletteSwatch[]
  sourceUrl: string
}

export type BaseStats = {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  total: number
}

export type FormTag =
  | 'default'
  | 'mega'
  | 'gmax'
  | 'regional'
  | 'gendered'
  | 'primal'
  | 'origin'
  | 'totem'
  | 'variant'

export type PokemonEntry = {
  id: number
  name: string
  displayName: string
  speciesId: number
  speciesName: string
  types: string[]
  generation: number
  color: string
  formTags: FormTag[]
  isDefault: boolean
  order: number
  formOrder: number
  images: {
    normal: string
    shiny: string
  }
  palettes: {
    normal: PaletteSet
    shiny: PaletteSet
  }
  baseStats: BaseStats
}

export type PokemonIndex = {
  generatedAt: string
  count: number
  entries: PokemonEntry[]
}
