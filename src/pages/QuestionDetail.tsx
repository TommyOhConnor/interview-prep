import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuestion } from '@/hooks/useQuestions'
import { useProgressStore } from '@/store/progressStore'
import { ConfidenceRating } from '@/components/question/ConfidenceRating'
import { RehearsedToggle } from '@/components/question/RehearsedToggle'
import { CoachingTip } from '@/components/question/CoachingTip'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export function QuestionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const question = useQuestion(id ?? '')
  const setRehearsd = useProgressStore(s => s.setRehearsd)
  const setConfidence = useProgressStore(s => s.setConfidence)
  const setNotes = useProgressStore(s => s.setNotes)

  const [localNotes, setLocalNotes] = useState(question?.user_notes ?? '')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (question) setLocalNotes(question.user_notes)
  }, [question?.id])

  function handleNotesChange(val: string) {
    setLocalNotes(val)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (id) setNotes(id, val)
    }, 800)
  }

  if (!question) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <p>Question not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <p className="text-xs text-muted-foreground">{question.category.name}</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {question.priority === 'high' && (
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              Key question
            </Badge>
          )}
          {question.tags.map(t => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
          {question.subgroup && (
            <Badge variant="outline" className="text-xs">{question.subgroup}</Badge>
          )}
        </div>

        <h2 className="text-lg font-medium leading-snug">{question.text}</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Confidence</p>
            <ConfidenceRating
              value={question.confidence}
              onChange={v => setConfidence(question.id, v)}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <RehearsedToggle
              value={question.rehearsed}
              onChange={v => setRehearsd(question.id, v)}
            />
          </div>
        </div>
      </div>

      <CoachingTip category={question.category} />

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Your notes</label>
        <Textarea
          value={localNotes}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder="Add your talking points, reminders, or sample answers…"
          className="min-h-[120px] resize-none text-sm"
        />
      </div>
    </div>
  )
}
