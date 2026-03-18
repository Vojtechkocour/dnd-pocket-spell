import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { CharacterClass } from '../../types'
import { CHARACTER_CLASS_LABELS } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { isPreparedClass } from '../../utils/preparedSpellLimit'

interface CharacterFormProps {
  open: boolean
  onClose: () => void
}

const CLASS_OPTIONS = Object.entries(CHARACTER_CLASS_LABELS) as [CharacterClass, string][]

const PREPARED_CLASS_ABILITY: Partial<Record<CharacterClass, string>> = {
  cleric: 'Wisdom',
  druid: 'Wisdom',
  paladin: 'Charisma',
  wizard: 'Intelligence',
  artificer: 'Intelligence',
}

export function CharacterForm({ open, onClose }: CharacterFormProps) {
  const addCharacter = useAppStore((s) => s.addCharacter)
  const [name, setName] = useState('')
  const [cls, setCls] = useState<CharacterClass>('wizard')
  const [level, setLevel] = useState(1)
  const [spellcastingModifier, setSpellcastingModifier] = useState(3)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Enter character name')
      return
    }
    addCharacter({
      name: name.trim(),
      class: cls,
      level,
      spellcastingModifier: isPreparedClass(cls) ? spellcastingModifier : undefined,
    })
    setName('')
    setCls('wizard')
    setLevel(1)
    setSpellcastingModifier(3)
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Character">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-parchment-200 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Gandalf, Merlin..."
            className="w-full bg-arcane-800 border border-arcane-800 rounded px-3 py-2 text-parchment-100 placeholder:text-parchment-200/40 focus:outline-none focus:border-gold-500"
            autoFocus
          />
          {error && <p className="text-crimson-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm text-parchment-200 mb-1">Class</label>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value as CharacterClass)}
            className="w-full bg-arcane-800 border border-arcane-800 rounded px-3 py-2 text-parchment-100 focus:outline-none focus:border-gold-500"
          >
            {CLASS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {isPreparedClass(cls) && (
          <div>
            <label className="block text-sm text-parchment-200 mb-1">
              {PREPARED_CLASS_ABILITY[cls]} modifier:{' '}
              <span className="text-gold-400 font-bold">{spellcastingModifier >= 0 ? `+${spellcastingModifier}` : spellcastingModifier}</span>
            </label>
            <input
              type="range"
              min={-1}
              max={10}
              value={spellcastingModifier}
              onChange={(e) => setSpellcastingModifier(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
            <div className="flex justify-between text-xs text-parchment-200/50">
              <span>−1</span>
              <span>+5</span>
              <span>+10</span>
            </div>
            <p className="text-xs text-parchment-200/40 mt-1">
              Ovlivňuje počet připravených kouzel
            </p>
          </div>
        )}

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

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            Create Character
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
