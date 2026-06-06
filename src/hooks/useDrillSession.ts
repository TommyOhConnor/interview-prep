import { create } from 'zustand'
import type { MergedQuestion } from '@/lib/types'

interface SessionResult {
  questionId: string
  confidence: number
}

interface DrillSessionState {
  queue: MergedQuestion[]
  currentIndex: number
  flipped: boolean
  results: SessionResult[]
  startSession: (queue: MergedQuestion[]) => void
  flip: () => void
  next: (confidence?: number) => void
  reset: () => void
  isFinished: boolean
}

export const useDrillSession = create<DrillSessionState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  flipped: false,
  results: [],
  isFinished: false,

  startSession(queue) {
    set({ queue, currentIndex: 0, flipped: false, results: [], isFinished: false })
  },

  flip() {
    set({ flipped: true })
  },

  next(confidence) {
    const { currentIndex, queue, results } = get()
    const current = queue[currentIndex]

    const newResults =
      confidence !== undefined
        ? [...results, { questionId: current.id, confidence }]
        : results

    const nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      set({ results: newResults, isFinished: true, flipped: false })
    } else {
      set({ currentIndex: nextIndex, flipped: false, results: newResults })
    }
  },

  reset() {
    set({ queue: [], currentIndex: 0, flipped: false, results: [], isFinished: false })
  },
}))
