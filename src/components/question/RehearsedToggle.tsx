import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: boolean
  onChange?: (v: boolean) => void
  label?: string
}

export function RehearsedToggle({ value, onChange, label = 'Rehearsed' }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!value)}
      disabled={!onChange}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all border',
        value
          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400'
          : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
      )}
    >
      <div
        className={cn(
          'w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all flex-shrink-0',
          value ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
        )}
      >
        {value && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
      </div>
      {label}
    </button>
  )
}
