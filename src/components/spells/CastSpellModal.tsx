import type { Spell, Character, SpellLevel } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { isWarlock } from '../../utils/spellSlotTable'

interface CastSpellModalProps {
  spell: Spell
  character: Character
  open: boolean
  onClose: () => void
  onCast: (slotLevel: SpellLevel) => void
}

export function CastSpellModal({ spell, character, open, onClose, onCast }: CastSpellModalProps) {
  if (isWarlock(character.class) && character.pactSlots) {
    const pact = character.pactSlots
    const available = pact.used < pact.total

    return (
      <Modal open={open} onClose={onClose} title={`Seslat: ${spell.name}`}>
        <p className="text-sm text-ink-muted mb-4">
          Warlock — Pact Magic slot (úroveň {pact.level})
        </p>

        {available ? (
          <button
            onClick={() => { onCast(pact.level); onClose() }}
            className="w-full text-left px-4 py-3 rounded border border-accent-gold/50 bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-display">Pact Slot — úroveň {pact.level}</span>
              <span className="text-xs text-ink-muted">
                {pact.total - pact.used} / {pact.total} dostupné
              </span>
            </div>
          </button>
        ) : (
          <div className="p-4 bg-red-50 border border-accent-red/30 rounded text-center">
            <p className="text-accent-red font-display mb-1">Žádné Pact Sloty</p>
            <p className="text-xs text-ink-muted">
              Odpočiň si (Short Rest) pro obnovení slotů.
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Zrušit</Button>
        </div>
      </Modal>
    )
  }

  // Collect available slots for levels >= spell.level
  const slotOptions: { level: SpellLevel; total: number; used: number }[] = []
  for (let lvl = spell.level; lvl <= 9; lvl++) {
    const slot = character.spellSlots[lvl as SpellLevel]
    if (slot && slot.total > 0) {
      slotOptions.push(slot)
    }
  }

  const hasAnyAvailable = slotOptions.some((s) => s.used < s.total)

  return (
    <Modal open={open} onClose={onClose} title={`Seslat: ${spell.name}`}>
      <p className="text-sm text-ink-muted mb-4">
        Vyber spell slot (min. úroveň {spell.level}):
      </p>

      {slotOptions.length === 0 || !hasAnyAvailable ? (
        <div className="p-4 bg-red-50 border border-accent-red/30 rounded text-center">
          <p className="text-accent-red font-display mb-1">Žádné dostupné sloty</p>
          <p className="text-xs text-ink-muted">
            Pro obnovení slotů potřebuješ Long Rest.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {slotOptions.map((slot) => {
            const remaining = slot.total - slot.used
            const exhausted = remaining === 0
            return (
              <button
                key={slot.level}
                disabled={exhausted}
                onClick={() => { onCast(slot.level); onClose() }}
                className={
                  exhausted
                    ? 'w-full text-left px-4 py-3 rounded border border-parchment-300/60 bg-parchment-200/50 text-ink-muted/30 cursor-not-allowed'
                    : 'w-full text-left px-4 py-3 rounded border border-accent-gold/50 bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold transition-colors'
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-display">
                    {slot.level === spell.level ? `Úroveň ${slot.level}` : `Úroveň ${slot.level} ↑`}
                  </span>
                  <span className={`text-xs ${exhausted ? 'text-accent-red' : 'text-ink-muted'}`}>
                    {exhausted ? 'Vyčerpáno' : `${remaining} / ${slot.total} dostupné`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClose}>Zrušit</Button>
      </div>
    </Modal>
  )
}
