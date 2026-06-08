import { useNavigate } from 'react-router-dom'
import { Zap, List } from 'lucide-react'
import { useOverallStats, useCategories } from '@/hooks/useQuestions'
import { useProgressStore } from '@/store/progressStore'
import { useDrillSession } from '@/hooks/useDrillSession'
import { ProgressRing } from '@/components/browse/ProgressRing'

export function Home() {
  const navigate = useNavigate()
  const stats = useOverallStats()
  const loading = useProgressStore(s => s.loading)
  const questions = useProgressStore(s => s.questions)
  const categories = useCategories()
  const startSession = useDrillSession(s => s.startSession)

  function drillHighPriority() {
    const highUnrehersed = questions
      .filter(q => q.priority === 'high' && !q.rehearsed)
    const queue = highUnrehersed.length > 0 ? highUnrehersed : questions.filter(q => q.priority === 'high')
    const shuffled = [...queue].sort(() => Math.random() - 0.5)
    startSession(shuffled)
    navigate('/drill/session')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-32 rounded-2xl bg-muted animate-pulse" />
        <div className="h-24 rounded-2xl bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Interview Prep</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Founding Product Designer</p>
      </div>

      {/* Main stats */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-6">
          <div className="relative">
            <ProgressRing value={stats.rehearsed} max={stats.total} size={80} strokeWidth={5} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold leading-none">{stats.rehearsed}</span>
              <span className="text-[10px] text-muted-foreground">{stats.total}</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <div>
              <p className="text-sm font-medium">
                {stats.rehearsed}/{stats.total} rehearsed
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.rehearsed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>
                <strong className="text-foreground">{stats.highRehearsed}</strong>/{stats.highTotal} key questions
              </span>
              {stats.avgConfidence > 0 && (
                <span>
                  Avg confidence <strong className="text-foreground">{stats.avgConfidence.toFixed(1)}/5</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={drillHighPriority}
          className="flex flex-col items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 text-left hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
        >
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-medium">Drill key questions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stats.highTotal - stats.highRehearsed} remaining
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/browse')}
          className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left hover:bg-accent/30 transition-colors"
        >
          <List className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Browse all</p>
            <p className="text-xs text-muted-foreground mt-0.5">{categories.length} categories</p>
          </div>
        </button>
      </div>

      {/* Category progress overview */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          By category
        </h2>
        <div className="space-y-1.5">
          {categories.map(cat => {
            const catQs = questions.filter(q => q.category_id === cat.id)
            const catRehearsd = catQs.filter(q => q.rehearsed).length
            const pct = catQs.length > 0 ? catRehearsd / catQs.length : 0

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/browse/${cat.id}`)}
                className="w-full flex items-center gap-3 hover:bg-accent/20 rounded-lg px-2 py-1.5 transition-colors"
              >
                <p className="text-xs flex-1 text-left truncate">{cat.name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">
                    {catRehearsd}/{catQs.length}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
