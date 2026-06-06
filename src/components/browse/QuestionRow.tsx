import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ConfidenceRating } from '@/components/question/ConfidenceRating'
import { cn } from '@/lib/utils'
import type { MergedQuestion } from '@/lib/types'

export function QuestionRow({ question }: { question: MergedQuestion }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/question/${question.id}`)}
      className="w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            'w-2 h-2 rounded-full mt-1',
            question.rehearsed ? 'bg-green-500' : 'bg-border'
          )}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm leading-snug">
          {question.priority === 'high' && (
            <span className="inline-block mr-1.5 mb-0.5 px-1 py-px rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 align-middle">
              KEY
            </span>
          )}
          {question.text}
        </p>
        {question.confidence > 0 && (
          <ConfidenceRating value={question.confidence} size="sm" />
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
    </button>
  )
}
