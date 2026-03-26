import { useAppStore } from '../../store/useAppStore'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface ConcentrationWarningProps {
  characterId: string
}

export function ConcentrationWarning({ characterId }: ConcentrationWarningProps) {
  const warning = useAppStore((s) => s.concentrationWarning)
  const spells = useAppStore((s) => s.spells)
  const character = useAppStore((s) => s.characters.find((c) => c.id === characterId))
  const dismiss = useAppStore((s) => s.dismissConcentrationWarning)
  const confirm = useAppStore((s) => s.confirmConcentrationSwitch)

  if (!warning || !character) return null

  const currentSpell = character.concentratingOnSpellId
    ? spells.find((s) => s.id === character.concentratingOnSpellId)
    : null
  const newSpell = spells.find((s) => s.id === warning.spellId)

  return (
    <Modal open={true} onClose={dismiss} title="Break Concentration">
      <div className="space-y-4">
        <p className="text-ink-light">
          You are concentrating on{' '}
          <span className="text-yellow-700 font-semibold">{currentSpell?.name ?? 'a spell'}</span>
          . Casting{' '}
          <span className="text-accent-gold font-semibold">{newSpell?.name ?? 'a new spell'}</span>{' '}
          will break concentration.
        </p>
        <p className="text-ink-muted text-sm">Switch concentration?</p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => confirm(characterId, warning.spellId)}
          >
            Switch
          </Button>
          <Button variant="ghost" onClick={dismiss}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
