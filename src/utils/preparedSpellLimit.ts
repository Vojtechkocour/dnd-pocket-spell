import type { Character, CharacterClass } from '../types'

// Max spell level accessible by class and character level (index = level - 1)
const MAX_SPELL_LEVEL: Record<CharacterClass, number[]> = {
  // Full casters
  bard:     [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  cleric:   [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  druid:    [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  sorcerer: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  wizard:   [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  // Half casters — max 5th level
  paladin:  [1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5],
  ranger:   [1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5],
  // Pact magic — unlocks one tier earlier than half casters
  warlock:  [1,2,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5],
  // Artificer — half caster, max 5th level
  artificer:[1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5],
}

/** Highest spell level the character can access (cantrips = level 0, always allowed). */
export function getMaxSpellLevel(character: Character): number {
  const table = MAX_SPELL_LEVEL[character.class]
  return table[Math.min(character.level, 20) - 1]
}

// Classes where spells are "prepared" — limit = spellcasting modifier + level formula
const PREPARED_CLASSES = new Set<CharacterClass>(['cleric', 'druid', 'paladin', 'wizard', 'artificer'])

// Cantrip limits by class, indexed [level - 1]
const CANTRIP_LIMITS: Partial<Record<CharacterClass, number[]>> = {
  artificer: Array(20).fill(2),
  bard:      [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  cleric:    [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  druid:     [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  paladin:   Array(20).fill(2), // PHB 2024
  ranger:    Array(20).fill(2), // PHB 2024
  sorcerer:  [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
  warlock:   [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  wizard:    [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
}

// Spells known (leveled) for "spells known" classes, indexed [level - 1]
const SPELLS_KNOWN: Partial<Record<CharacterClass, number[]>> = {
  bard:    [4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,16,16,16,17],
  sorcerer:[2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
  warlock: [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
  ranger:  [2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,10,11,11],
}

export function isPreparedClass(cls: CharacterClass): boolean {
  return PREPARED_CLASSES.has(cls)
}

/** Max cantrips for character. Returns null if class has no cantrip limit. */
export function getMaxCantrips(character: Character): number | null {
  const table = CANTRIP_LIMITS[character.class]
  if (!table) return null
  return table[Math.min(character.level, 20) - 1]
}

/** Max leveled (non-cantrip) prepared/known spells. Returns null if unlimited. */
export function getMaxPreparedLeveledSpells(character: Character): number | null {
  const cls = character.class
  const level = Math.min(character.level, 20)
  const mod = character.spellcastingModifier ?? 3

  if (cls in (SPELLS_KNOWN as object)) {
    const table = SPELLS_KNOWN[cls as keyof typeof SPELLS_KNOWN]!
    return table[level - 1]
  }

  switch (cls) {
    case 'cleric':
    case 'druid':
    case 'wizard':
      return Math.max(1, mod + level)
    case 'paladin':
      return Math.max(1, mod + Math.floor(level / 2))
    case 'artificer':
      return Math.max(1, mod + Math.ceil(level / 2))
    default:
      return null
  }
}
