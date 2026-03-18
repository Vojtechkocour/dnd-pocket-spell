import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore, selectActiveCharacter } from '../store/useAppStore'
import { SPELL_SCHOOL_LABELS, SPELL_SCHOOL_COLORS, CHARACTER_CLASS_LABELS } from '../types'
import type { CharacterClass } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function SpellDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const spells = useAppStore((s) => s.spells)
  const character = useAppStore(selectActiveCharacter)
  const addPreparedSpell = useAppStore((s) => s.addPreparedSpell)
  const removePreparedSpell = useAppStore((s) => s.removePreparedSpell)

  const spell = spells.find((s) => s.id === id)
  const isPrepared = character?.preparedSpellIds.includes(id ?? '') ?? false

  function togglePrepare() {
    if (!character || !id) return
    if (isPrepared) removePreparedSpell(character.id, id)
    else addPreparedSpell(character.id, id)
  }

  if (!spell) {
    return (
      <div className="min-h-screen bg-arcane-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-parchment-200 mb-4">Spell not found.</p>
          <Button onClick={() => navigate(-1)}>← Back</Button>
        </div>
      </div>
    )
  }

  const levelLabel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`
  const components = [
    spell.components.verbal && 'V',
    spell.components.somatic && 'S',
    spell.components.material && 'M',
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-arcane-950 text-parchment-100">
      <header className="bg-arcane-900 border-b border-arcane-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="text-parchment-200/60 hover:text-parchment-100 transition-colors text-sm"
        >
          ←
        </button>
        <h1 className="font-display text-gold-400 text-lg flex-1 truncate">{spell.name}</h1>
        {character && (
          <Button
            size="sm"
            variant={isPrepared ? 'danger' : 'secondary'}
            onClick={togglePrepare}
          >
            {isPrepared ? 'Remove' : '+ Add'}
          </Button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            label={SPELL_SCHOOL_LABELS[spell.school]}
            className={SPELL_SCHOOL_COLORS[spell.school]}
          />
          <Badge label={levelLabel} className="bg-arcane-800 text-parchment-200" />
          {spell.concentration && (
            <Badge label="Concentration" className="bg-yellow-900/60 text-yellow-400" />
          )}
          {spell.ritual && (
            <Badge label="Ritual" className="bg-purple-900/60 text-purple-400" />
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Casting Time', value: spell.castingTime },
            { label: 'Range', value: spell.range },
            { label: 'Components', value: components || '—' },
            { label: 'Duration', value: spell.duration },
            ...(spell.savingThrow
              ? [{ label: 'Saving Throw', value: spell.savingThrow }]
              : []),
            ...(spell.damageType
              ? [{ label: 'Damage Type', value: spell.damageType }]
              : []),
          ].map(({ label, value }) => (
            <div key={label} className="bg-arcane-900 rounded p-3">
              <p className="text-xs text-parchment-200/50 mb-1">{label}</p>
              <p className="text-parchment-100">{value}</p>
            </div>
          ))}
        </div>

        {/* Material component detail */}
        {spell.components.material && spell.components.materialDescription && (
          <div className="text-sm text-parchment-200/60">
            <span className="font-medium text-parchment-200">Material Components: </span>
            {spell.components.materialDescription}
          </div>
        )}

        {/* Description */}
        <div className="bg-arcane-900 rounded-lg p-5 space-y-4">
          <h2 className="font-display text-gold-400 text-sm uppercase tracking-wide">Description</h2>
          <p className="text-parchment-200 leading-relaxed whitespace-pre-line">
            {spell.description}
          </p>
          {spell.higherLevels && (
            <div className="border-t border-arcane-800 pt-4">
              <p className="text-xs text-parchment-200/50 uppercase tracking-wide mb-1">
                At Higher Levels
              </p>
              <p className="text-parchment-200 leading-relaxed">{spell.higherLevels}</p>
            </div>
          )}
        </div>

        {/* Classes */}
        <div>
          <p className="text-xs text-parchment-200/50 uppercase tracking-wide mb-2">Classes</p>
          <div className="flex flex-wrap gap-2">
            {spell.classes.map((cls) => (
              <Badge
                key={cls}
                label={CHARACTER_CLASS_LABELS[cls as CharacterClass] ?? cls}
                className="bg-arcane-800 text-parchment-200"
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-parchment-200/30">Source: {spell.source}</p>
      </main>
    </div>
  )
}
