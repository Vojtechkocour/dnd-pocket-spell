// ─── Spell ────────────────────────────────────────────────────────────────────

export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'

export interface SpellComponents {
  verbal: boolean
  somatic: boolean
  material: boolean
  materialDescription?: string
}

export interface Spell {
  id: string
  name: string
  level: number // 0 = cantrip, 1–9 = spell level
  school: SpellSchool
  castingTime: string
  range: string
  components: SpellComponents
  duration: string
  concentration: boolean
  ritual: boolean
  description: string
  higherLevels?: string
  classes: string[]
  source: string
  damageType?: string
  savingThrow?: string
}

// ─── Spell Slots ──────────────────────────────────────────────────────────────

export type SpellLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface SpellSlotLevel {
  level: SpellLevel
  total: number
  used: number
}

export type SpellSlots = Record<SpellLevel, SpellSlotLevel>

// ─── Pact Magic (Warlock) ─────────────────────────────────────────────────────

export interface PactSlots {
  level: SpellLevel // always same level for all warlock slots
  total: number
  used: number
}

// ─── Character ────────────────────────────────────────────────────────────────

export type CharacterClass =
  | 'barbarian'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'fighter'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'sorcerer'
  | 'warlock'
  | 'wizard'
  | 'artificer'

export const CHARACTER_CLASS_LABELS: Record<CharacterClass, string> = {
  barbarian: 'Barbarian',
  bard: 'Bard',
  cleric: 'Cleric',
  druid: 'Druid',
  fighter: 'Fighter',
  paladin: 'Paladin',
  ranger: 'Ranger',
  rogue: 'Rogue',
  sorcerer: 'Sorcerer',
  warlock: 'Warlock',
  wizard: 'Wizard',
  artificer: 'Artificer',
}

export const SPELL_SCHOOL_LABELS: Record<SpellSchool, string> = {
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
}

export const SPELL_SCHOOL_COLORS: Record<SpellSchool, string> = {
  abjuration: 'bg-blue-100 text-blue-800 border border-blue-300',
  conjuration: 'bg-violet-100 text-violet-800 border border-violet-300',
  divination: 'bg-sky-100 text-sky-800 border border-sky-300',
  enchantment: 'bg-pink-100 text-pink-800 border border-pink-300',
  evocation: 'bg-orange-100 text-orange-800 border border-orange-300',
  illusion: 'bg-purple-100 text-purple-800 border border-purple-300',
  necromancy: 'bg-green-100 text-green-800 border border-green-300',
  transmutation: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
}

export interface Character {
  id: string
  name: string
  class: CharacterClass
  level: number // 1–20
  subclass?: string
  spellcastingModifier?: number // ability modifier for prepared-spell classes
  spellSlots: SpellSlots
  pactSlots?: PactSlots // only for warlock
  preparedSpellIds: string[]
  concentratingOnSpellId: string | null
  createdAt: number
  updatedAt: number
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface SpellFilters {
  searchQuery: string
  levels: number[]
  classes: string[]
  schools: SpellSchool[]
  concentration: boolean | null
  ritual: boolean | null
}

export const DEFAULT_FILTERS: SpellFilters = {
  searchQuery: '',
  levels: [],
  classes: [],
  schools: [],
  concentration: null,
  ritual: null,
}

// ─── Import / Export ──────────────────────────────────────────────────────────

export interface ExportData {
  version: number
  exportedAt: string
  characters: Character[]
}
