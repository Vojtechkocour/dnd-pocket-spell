import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Character,
  CharacterClass,
  Spell,
  SpellLevel,
  SpellFilters,
  ExportData,
} from '../types'
import { DEFAULT_FILTERS } from '../types'
import { getSlotsForCharacter, getPactSlotsForWarlock, isWarlock } from '../utils/spellSlotTable'
import { exportCharacters, parseImportFile } from '../utils/importExport'

// Simple uuid without dependency on 'uuid' package
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface AppStore {
  // ─── State ───────────────────────────────────────────────────────────────
  characters: Character[]
  activeCharacterId: string | null
  spells: Spell[]
  filters: SpellFilters
  concentrationWarning: { spellId: string } | null

  // ─── Spell library init ───────────────────────────────────────────────────
  setSpells: (spells: Spell[]) => void

  // ─── Character CRUD ───────────────────────────────────────────────────────
  addCharacter: (data: { name: string; class: CharacterClass; level: number; spellcastingModifier?: number }) => void
  updateCharacter: (id: string, patch: Partial<Pick<Character, 'name' | 'level' | 'subclass' | 'spellcastingModifier'>>) => void
  deleteCharacter: (id: string) => void
  setActiveCharacter: (id: string) => void
  getActiveCharacter: () => Character | undefined

  // ─── Spell Slots ──────────────────────────────────────────────────────────
  useSlot: (characterId: string, level: SpellLevel) => void
  recoverSlot: (characterId: string, level: SpellLevel) => void
  longRest: (characterId: string) => void
  shortRest: (characterId: string) => void

  // ─── Prepared Spells ──────────────────────────────────────────────────────
  addPreparedSpell: (characterId: string, spellId: string) => void
  removePreparedSpell: (characterId: string, spellId: string) => void

  // ─── Concentration ────────────────────────────────────────────────────────
  startConcentration: (characterId: string, spellId: string) => void
  endConcentration: (characterId: string) => void
  dismissConcentrationWarning: () => void
  confirmConcentrationSwitch: (characterId: string, newSpellId: string) => void

  // ─── Filters ──────────────────────────────────────────────────────────────
  setFilter: (patch: Partial<SpellFilters>) => void
  resetFilters: () => void

  // ─── Import / Export ──────────────────────────────────────────────────────
  exportData: () => void
  importData: (data: ExportData, strategy: 'replace' | 'merge') => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      characters: [],
      activeCharacterId: null,
      spells: [],
      filters: DEFAULT_FILTERS,
      concentrationWarning: null,

      setSpells: (spells) => set({ spells }),

      // ─── Character CRUD ────────────────────────────────────────────────────

      addCharacter: ({ name, class: cls, level, spellcastingModifier }) => {
        const spellSlots = getSlotsForCharacter(cls, level)
        const pactSlots = isWarlock(cls) ? getPactSlotsForWarlock(level) : undefined
        const character: Character = {
          id: generateId(),
          name,
          class: cls,
          level,
          spellcastingModifier,
          spellSlots,
          pactSlots,
          preparedSpellIds: [],
          concentratingOnSpellId: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({ characters: [...state.characters, character] }))
      },

      updateCharacter: (id, patch) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== id) return c
            const updated = { ...c, ...patch, updatedAt: Date.now() }
            // Recalculate slots if level changed
            if (patch.level !== undefined && patch.level !== c.level) {
              updated.spellSlots = getSlotsForCharacter(c.class, patch.level)
              if (isWarlock(c.class)) {
                updated.pactSlots = getPactSlotsForWarlock(patch.level)
              }
            }
            return updated
          }),
        }))
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          activeCharacterId:
            state.activeCharacterId === id ? null : state.activeCharacterId,
        }))
      },

      setActiveCharacter: (id) => set({ activeCharacterId: id }),

      getActiveCharacter: () => {
        const { characters, activeCharacterId } = get()
        return characters.find((c) => c.id === activeCharacterId)
      },

      // ─── Spell Slots ───────────────────────────────────────────────────────

      useSlot: (characterId, level) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            // Handle warlock pact slots
            if (isWarlock(c.class) && c.pactSlots && c.pactSlots.level === level) {
              if (c.pactSlots.used >= c.pactSlots.total) return c
              return {
                ...c,
                pactSlots: { ...c.pactSlots, used: c.pactSlots.used + 1 },
                updatedAt: Date.now(),
              }
            }
            const slot = c.spellSlots[level]
            if (!slot || slot.used >= slot.total) return c
            return {
              ...c,
              spellSlots: {
                ...c.spellSlots,
                [level]: { ...slot, used: slot.used + 1 },
              },
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      recoverSlot: (characterId, level) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            if (isWarlock(c.class) && c.pactSlots && c.pactSlots.level === level) {
              if (c.pactSlots.used === 0) return c
              return {
                ...c,
                pactSlots: { ...c.pactSlots, used: c.pactSlots.used - 1 },
                updatedAt: Date.now(),
              }
            }
            const slot = c.spellSlots[level]
            if (!slot || slot.used === 0) return c
            return {
              ...c,
              spellSlots: {
                ...c.spellSlots,
                [level]: { ...slot, used: slot.used - 1 },
              },
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      longRest: (characterId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            const resetSlots = { ...c.spellSlots }
            for (const key of Object.keys(resetSlots) as unknown as SpellLevel[]) {
              resetSlots[key] = { ...resetSlots[key], used: 0 }
            }
            return {
              ...c,
              spellSlots: resetSlots,
              pactSlots: c.pactSlots ? { ...c.pactSlots, used: 0 } : undefined,
              concentratingOnSpellId: null,
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      shortRest: (characterId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            // Only warlock recovers slots on short rest
            if (!isWarlock(c.class) || !c.pactSlots) return c
            return {
              ...c,
              pactSlots: { ...c.pactSlots, used: 0 },
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      // ─── Prepared Spells ───────────────────────────────────────────────────

      addPreparedSpell: (characterId, spellId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            if (c.preparedSpellIds.includes(spellId)) return c
            return {
              ...c,
              preparedSpellIds: [...c.preparedSpellIds, spellId],
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      removePreparedSpell: (characterId, spellId) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c
            return {
              ...c,
              preparedSpellIds: c.preparedSpellIds.filter((id) => id !== spellId),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      // ─── Concentration ─────────────────────────────────────────────────────

      startConcentration: (characterId, spellId) => {
        const character = get().characters.find((c) => c.id === characterId)
        if (!character) return

        if (character.concentratingOnSpellId && character.concentratingOnSpellId !== spellId) {
          // Show warning — user must confirm
          set({ concentrationWarning: { spellId } })
          return
        }

        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId
              ? { ...c, concentratingOnSpellId: spellId, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      endConcentration: (characterId) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId
              ? { ...c, concentratingOnSpellId: null, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      dismissConcentrationWarning: () => set({ concentrationWarning: null }),

      confirmConcentrationSwitch: (characterId, newSpellId) => {
        set((state) => ({
          concentrationWarning: null,
          characters: state.characters.map((c) =>
            c.id === characterId
              ? { ...c, concentratingOnSpellId: newSpellId, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      // ─── Filters ───────────────────────────────────────────────────────────

      setFilter: (patch) => {
        set((state) => ({ filters: { ...state.filters, ...patch } }))
      },

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // ─── Import / Export ───────────────────────────────────────────────────

      exportData: () => {
        exportCharacters(get().characters)
      },

      importData: (data, strategy) => {
        if (strategy === 'replace') {
          set({ characters: data.characters, activeCharacterId: null })
        } else {
          // Merge: skip characters with same id
          set((state) => {
            const existingIds = new Set(state.characters.map((c) => c.id))
            const newChars = data.characters.filter((c) => !existingIds.has(c.id))
            return { characters: [...state.characters, ...newChars] }
          })
        }
      },
    }),
    {
      name: 'dnd-pocket-spell-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        characters: state.characters,
        activeCharacterId: state.activeCharacterId,
      }),
      version: 1,
    }
  )
)

// Selector helpers
export const selectActiveCharacter = (state: AppStore) =>
  state.characters.find((c) => c.id === state.activeCharacterId)

export const selectSpellById = (state: AppStore, id: string) =>
  state.spells.find((s) => s.id === id)
