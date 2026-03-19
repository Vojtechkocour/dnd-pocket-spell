import type { CharacterClass, SpellLevel, SpellSlots, PactSlots } from '../types'

// PHB 2024 Spell Slot Tables
// Index = character level - 1 (so index 0 = level 1, index 19 = level 20)

type SlotRow = [number, number, number, number, number, number, number, number, number]

// Standard spellcaster table (Bard, Cleric, Druid, Sorcerer, Wizard)
const FULL_CASTER: SlotRow[] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 3
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 4
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 5
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 6
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 8
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 9
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 10
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // level 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // level 12
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // level 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // level 14
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // level 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // level 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // level 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // level 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // level 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // level 20
]

// Half-caster table (Paladin, Ranger) — starts at class level 2
const HALF_CASTER: SlotRow[] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 3
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 4
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 5
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 6
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 7
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 8
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 9
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 10
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 11
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 12
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 13
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 14
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 15
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 16
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 17
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 18
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 19
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 20
]

// Artificer (half-caster, rounds up — starts at level 1)
const ARTIFICER_CASTER: SlotRow[] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 3
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 4
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 5
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 6
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 7
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 8
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 9
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 10
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 11
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 12
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 13
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 14
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 15
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 16
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 17
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 18
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 19
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 20
]

// Warlock Pact Magic — level of pact slot and count per class level
// [slotLevel, slotCount, shortRestSlots]
const WARLOCK_PACT: [SpellLevel, number][] = [
  [1, 1], // level 1
  [1, 2], // level 2
  [2, 2], // level 3
  [2, 2], // level 4
  [3, 2], // level 5
  [3, 2], // level 6
  [4, 2], // level 7
  [4, 2], // level 8
  [5, 2], // level 9
  [5, 2], // level 10
  [5, 3], // level 11
  [5, 3], // level 12
  [5, 3], // level 13
  [5, 3], // level 14
  [5, 3], // level 15
  [5, 3], // level 16
  [5, 4], // level 17
  [5, 4], // level 18
  [5, 4], // level 19
  [5, 4], // level 20
]

function rowToSpellSlots(row: SlotRow): SpellSlots {
  const slots = {} as SpellSlots
  for (let i = 0; i < 9; i++) {
    const level = (i + 1) as SpellLevel
    slots[level] = { level, total: row[i], used: 0 }
  }
  return slots
}

export function getSlotsForCharacter(
  cls: CharacterClass,
  characterLevel: number
): SpellSlots {
  const idx = Math.max(0, Math.min(19, characterLevel - 1))

  switch (cls) {
    case 'bard':
    case 'cleric':
    case 'druid':
    case 'sorcerer':
    case 'wizard':
      return rowToSpellSlots(FULL_CASTER[idx])
    case 'paladin':
    case 'ranger':
      return rowToSpellSlots(HALF_CASTER[idx])
    case 'artificer':
      return rowToSpellSlots(ARTIFICER_CASTER[idx])
    case 'warlock':
      // Warlock uses pact slots — return empty standard slots
      return rowToSpellSlots([0, 0, 0, 0, 0, 0, 0, 0, 0])
    case 'barbarian':
    case 'fighter':
    case 'rogue':
      return rowToSpellSlots([0, 0, 0, 0, 0, 0, 0, 0, 0])
  }
}

export function getPactSlotsForWarlock(characterLevel: number): PactSlots {
  const idx = Math.max(0, Math.min(19, characterLevel - 1))
  const [slotLevel, total] = WARLOCK_PACT[idx]
  return { level: slotLevel, total, used: 0 }
}

export function isWarlock(cls: CharacterClass): boolean {
  return cls === 'warlock'
}
