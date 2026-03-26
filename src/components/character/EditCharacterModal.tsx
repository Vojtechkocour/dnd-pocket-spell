import { useState } from 'react'
import type { Character } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAppStore } from '../../store/useAppStore'
import { isPreparedClass } from '../../utils/preparedSpellLimit'

const PREPARED_CLASS_ABILITY: Partial<Record<Character['class'], string>> = {
  cleric: 'Wisdom',
  druid: 'Wisdom',
  paladin: 'Charisma',
  wizard: 'Intelligence',
  artificer: 'Intelligence',
}

interface EditCharacterModalProps {
  character: Character
  open: boolean
  onClose: () => void
}

export function EditCharacterModal({ character, open, onClose }: EditCharacterModalProps) {
  const updateCharacter = useAppStore((s) => s.updateCharacter)

  const [name, setName] = useState(character.name)
  const [level, setLevel] = useState(character.level)
  const [subclass, setSubclass] = useState(character.subclass ?? '')
  const [modifier, setModifier] = useState(character.spellcastingModifier ?? 3)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Zadej jméno postavy')
      return
    }
    updateCharacter(character.id, {
      name: name.trim(),
      level,
      subclass: subclass.trim() || undefined,
      spellcastingModifier: isPreparedClass(character.class) ? modifier : undefined,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Upravit postavu">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink-light mb-1">Jméno</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-parchment-100 border border-parchment-300 rounded px-3 py-2 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-gold"
          />
          {error && <p className="text-accent-red text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm text-ink-light mb-1">
            Level: <span className="text-accent-gold font-bold">{level}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-accent-gold"
          />
          <div className="flex justify-between text-xs text-ink-muted">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink-light mb-1">
            Subclass <span className="text-ink-muted/60">(nepovinné)</span>
          </label>
          <input
            type="text"
            value={subclass}
            onChange={(e) => setSubclass(e.target.value)}
            placeholder="např. School of Evocation"
            className="w-full bg-parchment-100 border border-parchment-300 rounded px-3 py-2 text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-accent-gold"
          />
        </div>

        {isPreparedClass(character.class) && (
          <div>
            <label className="block text-sm text-ink-light mb-1">
              {PREPARED_CLASS_ABILITY[character.class]} modifier:{' '}
              <span className="text-accent-gold font-bold">
                {modifier >= 0 ? `+${modifier}` : modifier}
              </span>
            </label>
            <input
              type="range"
              min={-1}
              max={10}
              value={modifier}
              onChange={(e) => setModifier(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-xs text-ink-muted">
              <span>−1</span>
              <span>+5</span>
              <span>+10</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">Uložit</Button>
          <Button type="button" variant="ghost" onClick={onClose}>Zrušit</Button>
        </div>
      </form>
    </Modal>
  )
}
