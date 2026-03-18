import type { SpellFilters, SpellSchool } from '../../types'
import { SPELL_SCHOOL_LABELS, CHARACTER_CLASS_LABELS } from '../../types'

interface SpellFiltersProps {
  filters: SpellFilters
  onChange: (patch: Partial<SpellFilters>) => void
  onReset: () => void
}

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const SCHOOLS = Object.keys(SPELL_SCHOOL_LABELS) as SpellSchool[]
const CLASSES = Object.keys(CHARACTER_CLASS_LABELS)

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}

export function SpellFilters({ filters, onChange, onReset }: SpellFiltersProps) {
  const activeCount =
    filters.levels.length +
    filters.schools.length +
    filters.classes.length +
    (filters.concentration !== null ? 1 : 0) +
    (filters.ritual !== null ? 1 : 0)

  return (
    <div className="bg-arcane-900 border border-arcane-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-parchment-200 uppercase tracking-wide">
          Filters {activeCount > 0 && <span className="text-gold-400">({activeCount})</span>}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-parchment-200/50 hover:text-parchment-100 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Level */}
      <div>
        <p className="text-xs text-parchment-200/60 mb-2">Level</p>
        <div className="flex flex-wrap gap-1">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => onChange({ levels: toggleItem(filters.levels, lvl) })}
              className={`w-8 h-8 rounded text-xs transition-colors ${
                filters.levels.includes(lvl)
                  ? 'bg-gold-500 text-arcane-950 font-bold'
                  : 'bg-arcane-800 text-parchment-200/60 hover:bg-arcane-700'
              }`}
            >
              {lvl === 0 ? 'C' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* School */}
      <div>
        <p className="text-xs text-parchment-200/60 mb-2">School</p>
        <div className="flex flex-wrap gap-1">
          {SCHOOLS.map((school) => (
            <button
              key={school}
              onClick={() => onChange({ schools: toggleItem(filters.schools, school) })}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                filters.schools.includes(school)
                  ? 'bg-gold-500 text-arcane-950 font-bold'
                  : 'bg-arcane-800 text-parchment-200/60 hover:bg-arcane-700'
              }`}
            >
              {SPELL_SCHOOL_LABELS[school]}
            </button>
          ))}
        </div>
      </div>

      {/* Class */}
      <div>
        <p className="text-xs text-parchment-200/60 mb-2">Class</p>
        <div className="flex flex-wrap gap-1">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => onChange({ classes: toggleItem(filters.classes, cls) })}
              className={`px-2 py-1 rounded text-xs transition-colors capitalize ${
                filters.classes.includes(cls)
                  ? 'bg-gold-500 text-arcane-950 font-bold'
                  : 'bg-arcane-800 text-parchment-200/60 hover:bg-arcane-700'
              }`}
            >
              {CHARACTER_CLASS_LABELS[cls as keyof typeof CHARACTER_CLASS_LABELS]}
            </button>
          ))}
        </div>
      </div>

      {/* Concentration / Ritual */}
      <div className="flex gap-2">
        <button
          onClick={() =>
            onChange({ concentration: filters.concentration === true ? null : true })
          }
          className={`flex-1 py-1.5 rounded text-xs transition-colors ${
            filters.concentration === true
              ? 'bg-yellow-600 text-white'
              : 'bg-arcane-800 text-parchment-200/60 hover:bg-arcane-700'
          }`}
        >
          ⚡ Concentration
        </button>
        <button
          onClick={() =>
            onChange({ ritual: filters.ritual === true ? null : true })
          }
          className={`flex-1 py-1.5 rounded text-xs transition-colors ${
            filters.ritual === true
              ? 'bg-purple-600 text-white'
              : 'bg-arcane-800 text-parchment-200/60 hover:bg-arcane-700'
          }`}
        >
          📜 Ritual
        </button>
      </div>
    </div>
  )
}
