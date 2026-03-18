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
      <div className="flex items-center gap-3 py-2 border-b border-arcane-800 last:border-0">
        <button
          onClick={() => navigate(`/spells/${spell.id}`)}
          className="flex-1 text-left min-w-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-parchment-100 font-medium truncate">{spell.name}</span>
            {spell.concentration && (
              <span className="shrink-0 text-xs bg-yellow-900/60 text-yellow-400 px-1.5 py-0.5 rounded">
                C
              </span>
            )}
            {spell.ritual && (
              <span className="shrink-0 text-xs bg-purple-900/60 text-purple-400 px-1.5 py-0.5 rounded">
                R
              </span>
            )}
          </div>
          <p className="text-xs text-parchment-200/50">
            {levelLabel} • {SPELL_SCHOOL_LABELS[spell.school]} • {spell.castingTime}
          </p>
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" variant="secondary" onClick={handleCast} title="Cast">
            ▶
          </Button>
          <button
            onClick={onRemove}
            className="text-parchment-200/30 hover:text-crimson-500 transition-colors px-1"
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
