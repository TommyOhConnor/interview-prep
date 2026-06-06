import { useProgressStore } from '@/store/progressStore'
import { useCategories } from '@/hooks/useQuestions'
import { CategoryCard } from '@/components/browse/CategoryCard'

export function Browse() {
  const loading = useProgressStore(s => s.loading)
  const categories = useCategories()

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-7 w-32 rounded-lg bg-muted animate-pulse" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Browse</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{categories.length} categories</p>
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
