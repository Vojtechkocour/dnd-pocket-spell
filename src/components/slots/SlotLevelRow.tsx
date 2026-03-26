import type { SpellSlotLevel, SpellLevel } from '../../types'
import { SlotPip } from '../ui/SlotPip'
import { useAppStore } from '../../store/useAppStore'

interface SlotLevelRowProps {
  characterId: string
  slot: SpellSlotLevel
}

export function SlotLevelRow({ characterId, slot }: SlotLevelRowProps) {
  const useSlot = useAppStore((s) => s.useSlot)
  const recoverSlot = useAppStore((s) => s.recoverSlot)

  if (slot.total === 0) return null

  const pips = Array.from({ length: slot.total }, (_, i) => ({
    index: i,
    // slots fill from the right — used slots are the last N pips
    filled: i >= slot.total - slot.used,
  }))

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-muted w-10 shrink-0">
        Lv {slot.level}
      </span>
      <div className="flex items-center gap-1.5 flex-1">
        {pips.map(({ index, filled }) => (
          <SlotPip
            key={index}
            filled={filled}
            onClick={() => {
              if (filled) {
                recoverSlot(characterId, slot.level as SpellLevel)
              } else {
                useSlot(characterId, slot.level as SpellLevel)
              }
            }}
          />
        ))}
      </div>
      <span className="text-xs text-ink-muted/60 w-8 text-right shrink-0">
        {slot.total - slot.used}/{slot.total}
      </span>
    </div>
  )
}
