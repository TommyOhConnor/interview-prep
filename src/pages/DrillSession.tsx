import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, SkipForward } from 'lucide-react'
import { useDrillSession } from '@/hooks/useDrillSession'
import { useProgressStore } from '@/store/progressStore'
import { FlashCard } from '@/components/drill/FlashCard'
import { ConfidenceRating } from '@/components/question/ConfidenceRating'
import { Button } from '@/components/ui/button'

export function DrillSession() {
  const navigate = useNavigate()
  const { queue, currentIndex, flipped, isFinished, results, flip, next, reset } = useDrillSession()
  const setConfidence = useProgressStore(s => s.setConfidence)
  const setRehearsd = useProgressStore(s => s.setRehearsd)

  useEffect(() => {
    if (queue.length === 0) navigate('/drill')
  }, [queue.length, navigate])

  if (queue.length === 0) return null

  if (isFinished) {
    const avg = results.length > 0
      ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length
      : 0
    const rated = results.filter(r => r.confidence > 0).length
    const lowConf = results.filter(r => r.confidence > 0 && r.confidence <= 2)

    return (
      <div className="space-y-6 text-center py-8">
        <div className="text-5xl">✅</div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Session complete</h2>
          <p className="text-sm text-muted-foreground">{queue.length} questions covered</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{rated}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rated</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{avg > 0 ? avg.toFixed(1) : '—'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Avg confidence</p>
          </div>
        </div>

        <div className="space-y-3">
          {lowConf.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const lowIds = new Set(lowConf.map(r => r.questionId))
                const redrillQueue = [...queue.filter(q => lowIds.has(q.id))].sort(() => Math.random() - 0.5)
                useDrillSession.getState().startSession(redrillQueue)
                navigate('/drill/session')
              }}
            >
              Drill again — low confidence ({lowConf.length})
            </Button>
          )}
          <Button
            className="w-full"
            onClick={() => { reset(); navigate('/') }}
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  const question = queue[currentIndex]
  const progress = (currentIndex / queue.length) * 100

  function handleRate(confidence: number) {
    setConfidence(question.id, confidence)
    setRehearsd(question.id, true)
    next(confidence)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { reset(); navigate('/drill') }}
          className="p-1.5 -ml-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-12 text-right">
          {currentIndex + 1}/{queue.length}
        </span>
      </div>

      {/* Category label */}
      <p className="text-xs text-muted-foreground">{question.category.name}</p>

      {/* Card — reserve space */}
      <div style={{ minHeight: 280 }}>
        <FlashCard question={question} flipped={flipped} onFlip={flip} />
      </div>

      {/* Post-flip actions */}
      {flipped ? (
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Rate your confidence</p>
            <div className="flex justify-center">
              <ConfidenceRating
                value={question.confidence}
                onChange={handleRate}
              />
            </div>
          </div>

          <Button variant="ghost" size="sm" className="w-full" onClick={() => next()}>
            <SkipForward className="w-3.5 h-3.5" />
            Skip without rating
          </Button>
        </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground">
          Tap the card to flip
        </p>
      )}
    </div>
  )
}
