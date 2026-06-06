import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { QuestionBank, MergedQuestion } from '@/lib/types'
import { toast } from 'sonner'

interface ProgressState {
  questions: MergedQuestion[]
  loading: boolean
  userId: string | null
  loadProgress: (userId: string) => Promise<void>
  setRehearsd: (questionId: string, value: boolean) => void
  setConfidence: (questionId: string, value: number) => void
  setNotes: (questionId: string, value: string) => void
}

let bankPromise: Promise<QuestionBank> | null = null

function getBank(): Promise<QuestionBank> {
  if (!bankPromise) {
    bankPromise = fetch(import.meta.env.BASE_URL + 'data/interview-bank.json').then(r => r.json())
  }
  return bankPromise
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  questions: [],
  loading: true,
  userId: null,

  async loadProgress(userId: string) {
    set({ loading: true, userId })

    const [bank, { data: progressRows }] = await Promise.all([
      getBank(),
      supabase.from('question_progress').select('*').eq('user_id', userId),
    ])

    const progressMap = new Map(
      (progressRows ?? []).map(r => [r.question_id, r])
    )
    const categoryMap = new Map(bank.categories.map(c => [c.id, c]))

    const questions: MergedQuestion[] = bank.questions.map(q => {
      const saved = progressMap.get(q.id)
      return {
        ...q,
        rehearsed: saved?.rehearsed ?? false,
        confidence: saved?.confidence ?? 0,
        user_notes: saved?.user_notes ?? '',
        category: categoryMap.get(q.category_id)!,
      }
    })

    set({ questions, loading: false })
  },

  setRehearsd(questionId, value) {
    const { questions, userId } = get()
    const prev = questions.find(q => q.id === questionId)
    if (!prev || !userId) return

    set({
      questions: questions.map(q =>
        q.id === questionId ? { ...q, rehearsed: value } : q
      ),
    })

    supabase
      .from('question_progress')
      .upsert({
        question_id: questionId,
        user_id: userId,
        rehearsed: value,
        confidence: prev.confidence,
        user_notes: prev.user_notes,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          set({ questions: questions })
          toast.error('Failed to save — check your connection')
        }
      })
  },

  setConfidence(questionId, value) {
    const { questions, userId } = get()
    const prev = questions.find(q => q.id === questionId)
    if (!prev || !userId) return

    set({
      questions: questions.map(q =>
        q.id === questionId ? { ...q, confidence: value } : q
      ),
    })

    supabase
      .from('question_progress')
      .upsert({
        question_id: questionId,
        user_id: userId,
        rehearsed: prev.rehearsed,
        confidence: value,
        user_notes: prev.user_notes,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          set({ questions: questions })
          toast.error('Failed to save — check your connection')
        }
      })
  },

  setNotes(questionId, value) {
    const { questions, userId } = get()
    const prev = questions.find(q => q.id === questionId)
    if (!prev || !userId) return

    set({
      questions: questions.map(q =>
        q.id === questionId ? { ...q, user_notes: value } : q
      ),
    })

    supabase
      .from('question_progress')
      .upsert({
        question_id: questionId,
        user_id: userId,
        rehearsed: prev.rehearsed,
        confidence: prev.confidence,
        user_notes: value,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          toast.error('Failed to save notes — check your connection')
        }
      })
  },
}))
