import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Spell, Character, SpellLevel } from '../../types'
import { SPELL_SCHOOL_LABELS } from '../../types'
import { Button } from '../ui/Button'
import { useAppStore } from '../../store/useAppStore'
import { CastSpellModal } from './CastSpellModal'

interface SpellListItemProps {
  spell: Spell
  character: Character
  onRemove: () => void
}

export function SpellListItem({ spell, character, onRemove }: SpellListItemProps) {
  const navigate = useNavigate()
  const useSlot = useAppStore((s) => s.useSlot)
  const startConcentration = useAppStore((s) => s.startConcentration)
  const [showCastModal, setShowCastModal] = useState(false)

  function handleCast() {
    if (spell.level === 0) {
      // Cantrip — no slot needed
      if (spell.concentration) {
        startConcentration(character.id, spell.id)
      }
      return
    }
    setShowCastModal(true)
  }

  function handleConfirmCast(slotLevel: SpellLevel) {
    useSlot(character.id, slotLevel)
    if (spell.concentration) {
      startConcentration(character.id, spell.id)
    }
  }

  const levelLabel = spell.level === 0 ? 'Cantrip' : `Lv ${spell.level}`

  return (
    <>
      <div className="flex items-center gap-3 py-2.5 px-2 -mx-2 border-b border-parchment-300 last:border-0 rounded hover:bg-parchment-200/50 transition-colors">
        <button
          onClick={() => navigate(`/spells/${spell.id}`)}
          className="flex-1 text-left min-w-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-ink font-medium truncate">{spell.name}</span>
            {spell.concentration && (
              <span className="shrink-0 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-300">
                C
              </span>
            )}
            {spell.ritual && (
              <span className="shrink-0 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-300">
                R
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted">
            {levelLabel} • {SPELL_SCHOOL_LABELS[spell.school]} • {spell.castingTime}
          </p>
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" variant="secondary" onClick={handleCast} title="Cast">
            ▶
          </Button>
          <button
            onClick={onRemove}
            className="text-ink-muted/40 hover:text-accent-red transition-colors px-1"
            aria-label="Remove from prepared"
          >
            ✕
          </button>
        </div>
      </div>

      <CastSpellModal
        spell={spell}
        character={character}
        open={showCastModal}
        onClose={() => setShowCastModal(false)}
        onCast={handleConfirmCast}
      />
    </>
  )
}
