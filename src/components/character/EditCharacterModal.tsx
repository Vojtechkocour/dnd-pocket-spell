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
          <label className="block text-sm text-parchment-200 mb-1">Jméno</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-arcane-800 border border-arcane-700 rounded px-3 py-2 text-parchment-100 placeholder:text-parchment-200/40 focus:outline-none focus:border-gold-500"
          />
          {error && <p className="text-crimson-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm text-parchment-200 mb-1">
            Level: <span className="text-gold-400 font-bold">{level}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-xs text-parchment-200/50">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-parchment-200 mb-1">
            Subclass <span className="text-parchment-200/40">(nepovinné)</span>
          </label>
          <input
            type="text"
            value={subclass}
            onChange={(e) => setSubclass(e.target.value)}
            placeholder="např. School of Evocation"
            className="w-full bg-arcane-800 border border-arcane-700 rounded px-3 py-2 text-parchment-100 placeholder:text-parchment-200/30 focus:outline-none focus:border-gold-500"
          />
        </div>

        {isPreparedClass(character.class) && (
          <div>
            <label className="block text-sm text-parchment-200 mb-1">
              {PREPARED_CLASS_ABILITY[character.class]} modifier:{' '}
              <span className="text-gold-400 font-bold">
                {modifier >= 0 ? `+${modifier}` : modifier}
              </span>
            </label>
            <input
              type="range"
              min={-1}
              max={10}
              value={modifier}
              onChange={(e) => setModifier(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
            <div className="flex justify-between text-xs text-parchment-200/50">
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
