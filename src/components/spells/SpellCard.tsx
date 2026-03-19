import { useNavigate } from 'react-router-dom'
import type { Spell } from '../../types'
import { SPELL_SCHOOL_LABELS, SPELL_SCHOOL_COLORS } from '../../types'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface SpellCardProps {
  spell: Spell
  isPrepared: boolean
  isAtLimit?: boolean
  isUnavailable?: boolean
  onTogglePrepare: () => void
}

export function SpellCard({ spell, isPrepared, isAtLimit = false, isUnavailable = false, onTogglePrepare }: SpellCardProps) {
  const navigate = useNavigate()
  const levelLabel = spell.level === 0 ? 'Cantrip' : `Lv ${spell.level}`
  const blocked = !isPrepared && (isUnavailable || isAtLimit)

  return (
    <div className="bg-arcane-900 border border-arcane-800 hover:border-gold-600/50 rounded-lg p-4 flex flex-col gap-3 transition-colors">
      <button
        onClick={() => navigate(`/spells/${spell.id}`)}
        className="text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-parchment-100 leading-tight">{spell.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {spell.concentration && (
              <span className="text-xs bg-yellow-900/60 text-yellow-400 px-1.5 py-0.5 rounded">C</span>
            )}
            {spell.ritual && (
              <span className="text-xs bg-purple-900/60 text-purple-400 px-1.5 py-0.5 rounded">R</span>
            )}
          </div>
        </div>
        <p className="text-xs text-parchment-200/50 mt-1">
          {levelLabel} • {spell.castingTime} • {spell.range}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            label={SPELL_SCHOOL_LABELS[spell.school]}
            className={SPELL_SCHOOL_COLORS[spell.school]}
          />
        </div>
      </button>

      <button
        onClick={blocked ? undefined : onTogglePrepare}
        disabled={blocked}
        title={
          isUnavailable && !isPrepared
            ? `Requires higher character level`
            : isAtLimit && !isPrepared
              ? 'Spell limit reached'
              : undefined
        }
        className={cn(
          'w-full text-sm py-1.5 rounded border transition-colors',
          isPrepared
            ? 'bg-gold-500/20 border-gold-600 text-gold-400 hover:bg-crimson-900/40 hover:border-crimson-600 hover:text-crimson-400'
            : isUnavailable
              ? 'bg-transparent border-arcane-800/30 text-parchment-200/20 cursor-not-allowed'
              : isAtLimit
                ? 'bg-transparent border-arcane-800/40 text-parchment-200/20 cursor-not-allowed'
                : 'bg-transparent border-arcane-800 text-parchment-200/60 hover:border-gold-600 hover:text-gold-400'
        )}
      >
        {isPrepared ? '✓ Prepared' : isUnavailable ? '🔒 Too high level' : isAtLimit ? '— at limit' : '+ Add'}
      </button>
    </div>
  )
}
