import { type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export function SearchInput({ className, onClear, value, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-200/50 pointer-events-none">
        🔍
      </span>
      <input
        type="search"
        value={value}
        className={cn(
          'w-full bg-arcane-800 border border-arcane-800 rounded pl-9 pr-9 py-2',
          'text-parchment-100 placeholder:text-parchment-200/40',
          'focus:outline-none focus:border-gold-500 transition-colors',
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-200/50 hover:text-parchment-100"
          aria-label="Clear"
        >
          ✕
        </button>
      )}
    </div>
  )
}
