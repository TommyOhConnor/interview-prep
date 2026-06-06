import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { useCategory, useCategories } from '@/hooks/useQuestions'
import { QuestionRow } from '@/components/browse/QuestionRow'
import { Button } from '@/components/ui/button'
import { useDrillSession } from '@/hooks/useDrillSession'

type Filter = 'all' | 'high' | 'unrehersed'

export function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const questions = useCategory(categoryId ?? '')
  const categories = useCategories()
  const category = categories.find(c => c.id === categoryId)
  const startSession = useDrillSession(s => s.startSession)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = questions.filter(q => {
    if (filter === 'high') return q.priority === 'high'
    if (filter === 'unrehersed') return !q.rehearsed
    return true
  })

  function drillThis() {
    const queue = filter === 'all' ? questions : filtered
    startSession(queue)
    navigate('/drill/session')
  }

  if (!category) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/browse')} className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Browse
        </button>
        <p>Category not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/browse')}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold flex-1 min-w-0 truncate">{category.name}</h1>
        <Button size="sm" onClick={drillThis} className="flex-shrink-0">
          <Zap className="w-3.5 h-3.5" />
          Drill
        </Button>
      </div>

      <div className="flex gap-1.5">
        {(['all', 'high', 'unrehersed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {f === 'all' ? `All (${questions.length})` : f === 'high' ? `Key questions` : 'Not rehearsed'}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No questions match this filter</p>
        ) : (
          filtered.map(q => <QuestionRow key={q.id} question={q} />)
        )}
      </div>
    </div>
  )
}
