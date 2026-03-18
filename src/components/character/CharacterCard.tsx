import { useNavigate } from 'react-router-dom'
import type { Character } from '../../types'
import { CHARACTER_CLASS_LABELS } from '../../types'
import { Button } from '../ui/Button'
import { useAppStore } from '../../store/useAppStore'

const CLASS_ICONS: Record<string, string> = {
  bard: '🎵',
  cleric: '✝️',
  druid: '🌿',
  paladin: '⚔️',
  ranger: '🏹',
  sorcerer: '⚡',
  warlock: '👁️',
  wizard: '🔮',
  artificer: '⚙️',
}

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate()
  const setActiveCharacter = useAppStore((s) => s.setActiveCharacter)
  const deleteCharacter = useAppStore((s) => s.deleteCharacter)

  const totalSlots = Object.values(character.spellSlots).reduce(
    (acc, s) => acc + s.total,
    0
  )
  const usedSlots = Object.values(character.spellSlots).reduce(
    (acc, s) => acc + s.used,
    0
  )

  function handlePlay() {
    setActiveCharacter(character.id)
    navigate('/dashboard')
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Delete character "${character.name}"? This action cannot be undone.`)) {
      deleteCharacter(character.id)
    }
  }

  return (
    <div className="bg-arcane-900 border border-arcane-800 rounded-lg p-5 flex flex-col gap-4 hover:border-gold-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={CHARACTER_CLASS_LABELS[character.class]}>
            {CLASS_ICONS[character.class] ?? '🧙'}
          </span>
          <div>
            <h3 className="font-display text-lg text-parchment-100 leading-tight">
              {character.name}
            </h3>
            <p className="text-sm text-parchment-200/70">
              {CHARACTER_CLASS_LABELS[character.class]} • Level {character.level}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-parchment-200/30 hover:text-crimson-500 transition-colors text-lg"
          aria-label="Delete character"
        >
          🗑️
        </button>
      </div>

      <div className="text-xs text-parchment-200/60 flex gap-4">
        <span>🔮 {character.preparedSpellIds.length} spells</span>
        <span>
          ✨ {totalSlots - usedSlots}/{totalSlots} slots
        </span>
        {character.concentratingOnSpellId && (
          <span className="text-yellow-400">⚡ Concentrating</span>
        )}
      </div>

      <Button onClick={handlePlay} className="w-full">
        Play
      </Button>
    </div>
  )
}
