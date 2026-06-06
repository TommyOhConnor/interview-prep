import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ProgressRing } from './ProgressRing'
import { useCategoryStats } from '@/hooks/useQuestions'
import type { Category } from '@/lib/types'

export function CategoryCard({ category }: { category: Category }) {
  const navigate = useNavigate()
  const stats = useCategoryStats(category.id)

  return (
    <button
      type="button"
      onClick={() => navigate(`/browse/${category.id}`)}
      className="w-full flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 text-left hover:bg-accent/30 transition-colors active:scale-[0.99]"
    >
      <div className="relative flex-shrink-0">
        <ProgressRing value={stats.rehearsed} max={stats.total} size={44} />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
          {stats.total > 0 ? Math.round((stats.rehearsed / stats.total) * 100) : 0}%
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{category.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {stats.rehearsed}/{stats.total} rehearsed
          {stats.highPriority > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 text-[10px] font-medium">
              {stats.highPriority} key
            </span>
          )}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
