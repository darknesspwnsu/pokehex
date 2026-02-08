import {
  deriveFormTags,
  formatFormLabel,
  formatPokemonDisplayName,
  formatPokemonName,
} from './pokemon'

describe('pokemon formatting', () => {
  it('formats special case names', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr. Mime')
    expect(formatPokemonName('type-null')).toBe('Type: Null')
    expect(formatPokemonName('farfetchd')).toBe("Farfetch'd")
  })

  it('formats form labels', () => {
    expect(formatFormLabel('gmax')).toBe('Gigantamax')
    expect(formatFormLabel('mega-x')).toBe('Mega X')
  })

  it('builds display names from species and form', () => {
    expect(formatPokemonDisplayName('charizard-mega-x', 'charizard')).toBe(
      'Charizard Mega X',
    )
  })
})

describe('form tagging', () => {
  it('tags default entries', () => {
    expect(deriveFormTags('pikachu', true)).toContain('default')
  })

  it('detects form variants', () => {
    expect(deriveFormTags('pikachu-gmax', false)).toContain('gmax')
    expect(deriveFormTags('raichu-alola', false)).toContain('regional')
    expect(deriveFormTags('meowstic-female', false)).toContain('gendered')
  })

  it('labels generic variants', () => {
    expect(deriveFormTags('pikachu-cosplay', false)).toContain('variant')
  })
})
