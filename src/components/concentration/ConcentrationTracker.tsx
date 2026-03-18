import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'

interface ConcentrationTrackerProps {
  characterId: string
  spellId: string | null
}

export function ConcentrationTracker({ characterId, spellId }: ConcentrationTrackerProps) {
  const endConcentration = useAppStore((s) => s.endConcentration)
  const spells = useAppStore((s) => s.spells)

  const spell = spellId ? spells.find((s) => s.id === spellId) : null

  if (!spell) {
    return (
      <div className="bg-arcane-900 rounded-lg border border-arcane-800 p-4">
        <h2 className="font-display text-gold-400 text-sm uppercase tracking-widest mb-2">
          Concentration
        </h2>
        <p className="text-parchment-200/40 text-sm">Not concentrating on any spell.</p>
      </div>
    )
  }

  return (
    <div className="bg-arcane-900 rounded-lg border border-yellow-600/60 p-4 shadow-glow-red">
      <h2 className="font-display text-gold-400 text-sm uppercase tracking-widest mb-3">
        ⚡ Concentration Active
      </h2>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-parchment-100 font-semibold">{spell.name}</p>
          <p className="text-xs text-parchment-200/50">{spell.duration}</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => endConcentration(characterId)}
        >
          End
        </Button>
      </div>
    </div>
  )
}
