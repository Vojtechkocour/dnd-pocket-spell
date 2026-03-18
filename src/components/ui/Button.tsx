import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold-500 hover:bg-gold-400 text-arcane-950 font-semibold shadow-glow',
  secondary:
    'bg-arcane-800 hover:bg-arcane-900 text-parchment-100 border border-gold-600',
  ghost:
    'bg-transparent hover:bg-arcane-800 text-parchment-200',
  danger:
    'bg-crimson-600 hover:bg-crimson-500 text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
