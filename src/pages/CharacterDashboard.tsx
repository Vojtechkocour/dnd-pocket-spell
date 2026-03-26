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
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted mb-4">No active character.</p>
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
    <div className="min-h-screen bg-parchment-100 text-ink">
      <header className="bg-parchment-50 border-b border-parchment-300 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-ink-muted hover:text-ink transition-colors text-sm flex items-center gap-1"
        >
          ← Characters
        </button>
        <div className="text-center">
          <p className="font-display text-accent-gold font-semibold">{character.name}</p>
          <p className="text-xs text-ink-muted">
            {CHARACTER_CLASS_LABELS[character.class]} • Lv {character.level}
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="text-ink-muted hover:text-ink transition-colors text-sm w-16 text-right"
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
        <div className="bg-parchment-50 rounded-xl border border-parchment-400 p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-accent-gold text-sm uppercase tracking-widest">
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
            <div className="text-center py-8 text-ink-muted/60">
              <div className="text-3xl mb-2">📖</div>
              <p className="text-sm">No spells prepared.</p>
              <button
                onClick={() => navigate('/library')}
                className="text-accent-gold hover:text-accent-gold/80 text-sm mt-2 underline"
              >
                Open Library
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {(() => {
                const groups = new Map<number, typeof preparedSpells>()
                for (const spell of preparedSpells) {
                  if (!groups.has(spell.level)) groups.set(spell.level, [])
                  groups.get(spell.level)!.push(spell)
                }
                return Array.from(groups.entries())
                  .sort(([a], [b]) => a - b)
                  .map(([level, group]) => (
                    <div key={level} className="rounded-xl overflow-hidden border border-parchment-400 shadow-md">
                      <div className={`px-3 py-2 flex items-center gap-2 ${level === 0 ? 'bg-parchment-200/80' : 'bg-parchment-300/70'} border-b border-parchment-300`}>
                        {level === 0 ? (
                          <>
                            <span className="font-display text-accent-gold text-xs uppercase tracking-widest">Cantrips</span>
                            <span className="text-xs text-ink-muted ml-auto">{group.length}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-display text-accent-gold text-xs uppercase tracking-widest">Level {level}</span>
                            <span className="text-xs text-ink-muted ml-auto">{group.length}</span>
                          </>
                        )}
                      </div>
                      <div className="px-3">
                        {group.map((spell) => (
                          <SpellListItem
                            key={spell.id}
                            spell={spell}
                            character={character}
                            onRemove={() => removePreparedSpell(character.id, spell.id)}
                          />
                        ))}
                      </div>
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
