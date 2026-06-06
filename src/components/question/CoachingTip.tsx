import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

export function CoachingTip({ category }: { category: Category }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <span className="text-sm font-medium">Coaching tips</span>
        <ChevronDown
          className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="px-4 py-4 space-y-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What they're probing for
            </p>
            <p className="text-sm leading-relaxed">{category.probing_for}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your angle
            </p>
            <p className="text-sm leading-relaxed">{category.your_angle}</p>
          </div>
        </div>
      )}
    </div>
  )
}
