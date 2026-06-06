import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Shuffle } from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'
import { useCategories } from '@/hooks/useQuestions'
import { useDrillSession } from '@/hooks/useDrillSession'
import { Button } from '@/components/ui/button'
import type { DrillFilters } from '@/lib/types'

const ALL_TAGS = ['ai', 'behavioral', 'collab', 'craft', 'critique', 'curveball',
  'design-eng', 'design-systems', 'exercise', 'founder', 'leadership',
  'logistics', 'motivation', 'portfolio', 'product-sense', 'reverse', 'screen', 'startup']

export function Drill() {
  const navigate = useNavigate()
  const questions = useProgressStore(s => s.questions)
  const categories = useCategories()
  const startSession = useDrillSession(s => s.startSession)

  const [filters, setFilters] = useState<DrillFilters>({
    categoryIds: [],
    priorityOnly: false,
    tags: [],
    shuffle: true,
  })

  const matchCount = useMemo(() => {
    let qs = questions
    if (filters.categoryIds.length > 0) qs = qs.filter(q => filters.categoryIds.includes(q.category_id))
    if (filters.priorityOnly) qs = qs.filter(q => q.priority === 'high')
    if (filters.tags.length > 0) qs = qs.filter(q => q.tags.some(t => filters.tags.includes(t)))
    return qs.length
  }, [questions, filters])

  function toggleCategory(id: string) {
    setFilters(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(c => c !== id)
        : [...f.categoryIds, id],
    }))
  }

  function toggleTag(tag: string) {
    setFilters(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  function handleStart() {
    let qs = questions
    if (filters.categoryIds.length > 0) qs = qs.filter(q => filters.categoryIds.includes(q.category_id))
    if (filters.priorityOnly) qs = qs.filter(q => q.priority === 'high')
    if (filters.tags.length > 0) qs = qs.filter(q => q.tags.some(t => filters.tags.includes(t)))
    if (filters.shuffle) qs = [...qs].sort(() => Math.random() - 0.5)
    startSession(qs)
    navigate('/drill/session')
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Drill</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your practice session</p>
      </div>

      {/* Priority filter */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-medium">Priority</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFilters(f => ({ ...f, priorityOnly: false }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filters.priorityOnly ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            All questions
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, priorityOnly: true }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.priorityOnly ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Key questions only (39)
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Categories</p>
          {filters.categoryIds.length > 0 && (
            <button
              onClick={() => setFilters(f => ({ ...f, categoryIds: [] }))}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.categoryIds.includes(cat.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {filters.categoryIds.length === 0 && (
          <p className="text-xs text-muted-foreground">All categories selected</p>
        )}
      </div>

      {/* Tags */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Tags</p>
          {filters.tags.length > 0 && (
            <button
              onClick={() => setFilters(f => ({ ...f, tags: [] }))}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Shuffle + Start */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilters(f => ({ ...f, shuffle: !f.shuffle }))}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            filters.shuffle
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:bg-accent'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>

        <Button
          onClick={handleStart}
          disabled={matchCount === 0}
          className="flex-1"
        >
          <Zap className="w-4 h-4" />
          Start {matchCount} question{matchCount !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
