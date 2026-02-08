import type { FormTag } from './types'

export const FORM_FILTERS: { id: FormTag; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'mega', label: 'Mega' },
  { id: 'gmax', label: 'Gigantamax' },
  { id: 'regional', label: 'Regional' },
  { id: 'gendered', label: 'Gendered' },
  { id: 'primal', label: 'Primal' },
  { id: 'origin', label: 'Origin' },
  { id: 'totem', label: 'Totem' },
  { id: 'variant', label: 'Other' },
]

export const TYPE_COLORS: Record<string, string> = {
  bug: '#84CC16',
  dark: '#334155',
  dragon: '#6366F1',
  electric: '#FACC15',
  fairy: '#F472B6',
  fighting: '#F97316',
  fire: '#FB7185',
  flying: '#38BDF8',
  ghost: '#8B5CF6',
  grass: '#22C55E',
  ground: '#EAB308',
  ice: '#22D3EE',
  normal: '#A8A29E',
  poison: '#C026D3',
  psychic: '#F43F5E',
  rock: '#A16207',
  steel: '#94A3B8',
  water: '#3B82F6',
}
