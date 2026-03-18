import { useEffect, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-lg bg-arcane-900 border border-gold-600',
          'shadow-2xl p-6',
          className
        )}
      >
        {title && (
          <h2 className="font-display text-xl text-gold-400 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
