import { cn } from '@/lib/utils'

const LABELS = ['', 'Shaky', 'Developing', 'Decent', 'Solid', 'Ready']
const COLORS = [
  '',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-green-400',
]

interface Props {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md'
}

export function ConfidenceRating({ value, onChange, size = 'md' }: Props) {
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(value === n ? 0 : n)}
            disabled={!onChange}
            className={cn(
              'rounded-full transition-all border-2',
              dotSize,
              n <= value
                ? cn(COLORS[n], 'border-transparent')
                : 'border-border bg-transparent hover:bg-muted'
            )}
            aria-label={`Confidence ${n}: ${LABELS[n]}`}
          />
        ))}
        {size === 'md' && value > 0 && (
          <span className="text-xs text-muted-foreground ml-1">{LABELS[value]}</span>
        )}
      </div>
    </div>
  )
}
