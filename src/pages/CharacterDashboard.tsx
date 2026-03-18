import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, selectActiveCharacter } from '../store/useAppStore'
import { SpellSlotTracker } from '../components/slots/SpellSlotTracker'
import { ConcentrationTracker } from '../components/concentration/ConcentrationTracker'
import { ConcentrationWarning } from '../components/concentration/ConcentrationWarning'
import { SpellListItem } from '../components/spells/SpellListItem'
import { EditCharacterModal } from '../components/character/EditCharacterModal'
import { Button } from '../components/ui/Button'
import { CHARACTER_CLASS_LABELS } from '../types'

export function CharacterDashboard() {
  const navigate = useNavigate()
  const character = useAppStore(selectActiveCharacter)
  const spells = useAppStore((s) => s.spells)
  const removePreparedSpell = useAppStore((s) => s.removePreparedSpell)
  const [showEdit, setShowEdit] = useState(false)

  if (!character) {
    return (
      <div className="min-h-screen bg-arcane-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-parchment-200 mb-4">No active character.</p>
          <Button onClick={() => navigate('/')}>← Back to Selection</Button>
        </div>
      </div>
    )
  }

  const preparedSpells = character.preparedSpellIds
    .map((id) => spells.find((s) => s.id === id))
    .filter(Boolean) as typeof spells

  const cantrips = preparedSpells.filter((s) => s.level === 0)
  const leveledSpells = preparedSpells.filter((s) => s.level > 0)
  void cantrips
  void leveledSpells

  return (
    <div className="min-h-screen bg-arcane-950 text-parchment-100">
      <header className="bg-arcane-900 border-b border-arcane-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-parchment-200/60 hover:text-parchment-100 transition-colors text-sm flex items-center gap-1"
        >
          ← Characters
        </button>
        <div className="text-center">
          <p className="font-display text-gold-400 font-semibold">{character.name}</p>
          <p className="text-xs text-parchment-200/60">
            {CHARACTER_CLASS_LABELS[character.class]} • Lv {character.level}
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="text-parchment-200/50 hover:text-parchment-100 transition-colors text-sm w-16 text-right"
        >
          ✏️ Edit
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <SpellSlotTracker character={character} />
          <ConcentrationTracker
            characterId={character.id}
            spellId={character.concentratingOnSpellId}
          />
        </div>

        {/* Right column — Prepared spells */}
        <div className="bg-arcane-900 rounded-lg border border-arcane-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-gold-400 text-sm uppercase tracking-widest">
              Prepared Spells
            </h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/library')}
            >
              + Add
            </Button>
          </div>

          {preparedSpells.length === 0 ? (
            <div className="text-center py-8 text-parchment-200/40">
              <div className="text-3xl mb-2">📖</div>
              <p className="text-sm">No spells prepared.</p>
              <button
                onClick={() => navigate('/library')}
                className="text-gold-500 hover:text-gold-400 text-sm mt-2 underline"
              >
                Open Library
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(() => {
                const groups = new Map<number, typeof preparedSpells>()
                for (const spell of preparedSpells) {
                  if (!groups.has(spell.level)) groups.set(spell.level, [])
                  groups.get(spell.level)!.push(spell)
                }
                return Array.from(groups.entries())
                  .sort(([a], [b]) => a - b)
                  .map(([level, group]) => (
                    <div key={level}>
                      <p className="text-xs text-parchment-200/40 uppercase tracking-wide mb-1">
                        {level === 0 ? 'Cantrips' : `Level ${level}`}
                      </p>
                      {group.map((spell) => (
                        <SpellListItem
                          key={spell.id}
                          spell={spell}
                          character={character}
                          onRemove={() => removePreparedSpell(character.id, spell.id)}
                        />
                      ))}
                    </div>
                  ))
              })()}
            </div>
          )}
        </div>
      </main>

      <ConcentrationWarning characterId={character.id} />
      <EditCharacterModal
        character={character}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </div>
  )
}
