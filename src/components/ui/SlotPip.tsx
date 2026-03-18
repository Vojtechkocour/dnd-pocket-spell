import { cn } from '../../utils/cn'

interface SlotPipProps {
  filled: boolean
  onClick?: () => void
  disabled?: boolean
}

export function SlotPip({ filled, onClick, disabled }: SlotPipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={filled ? 'Použitý slot — klikni pro obnovu' : 'Volný slot — klikni pro použití'}
      className={cn(
        'w-6 h-6 rounded-full border-2 transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none',
        'disabled:cursor-not-allowed',
        filled
          ? 'bg-transparent border-gold-600'
          : 'bg-gold-500 border-gold-400 shadow-glow',
        !disabled && 'hover:scale-110 cursor-pointer'
      )}
    />
  )
}
