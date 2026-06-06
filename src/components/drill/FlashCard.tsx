import { motion, AnimatePresence } from 'framer-motion'
import type { MergedQuestion } from '@/lib/types'

interface Props {
  question: MergedQuestion
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ question, flipped, onFlip }: Props) {
  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1000px', minHeight: 280 }}
      onClick={!flipped ? onFlip : undefined}
    >
      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl border border-border bg-card p-6 flex flex-col"
          >
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg font-medium leading-snug text-center">{question.text}</p>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">Tap to reveal coaching tips</p>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 overflow-y-auto"
          >
            <p className="text-sm font-medium leading-snug">{question.text}</p>
            <hr className="border-border" />
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  What they're probing for
                </p>
                <p className="text-sm leading-relaxed">{question.category.probing_for}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Your angle
                </p>
                <p className="text-sm leading-relaxed">{question.category.your_angle}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
