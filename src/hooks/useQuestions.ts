import { useMemo } from 'react'
import { useProgressStore } from '@/store/progressStore'
import type { MergedQuestion, DrillFilters } from '@/lib/types'

export function useQuestions() {
  return useProgressStore(s => s.questions)
}

export function useQuestion(id: string): MergedQuestion | undefined {
  return useProgressStore(s => s.questions.find(q => q.id === id))
}

export function useCategory(categoryId: string) {
  const questions = useProgressStore(s => s.questions)
  return useMemo(
    () => questions.filter(q => q.category_id === categoryId),
    [questions, categoryId]
  )
}

export function useCategories() {
  const questions = useProgressStore(s => s.questions)
  return useMemo(() => {
    const seen = new Set<string>()
    const cats: MergedQuestion['category'][] = []
    for (const q of questions) {
      if (!seen.has(q.category.id)) {
        seen.add(q.category.id)
        cats.push(q.category)
      }
    }
    return cats.sort((a, b) => a.number - b.number)
  }, [questions])
}

export function useCategoryStats(categoryId: string) {
  const questions = useProgressStore(s => s.questions)
  return useMemo(() => {
    const qs = questions.filter(q => q.category_id === categoryId)
    const rehearsed = qs.filter(q => q.rehearsed).length
    const highPriority = qs.filter(q => q.priority === 'high').length
    const avgConfidence =
      qs.length > 0
        ? qs.reduce((sum, q) => sum + q.confidence, 0) / qs.length
        : 0
    return { total: qs.length, rehearsed, highPriority, avgConfidence }
  }, [questions, categoryId])
}

export function useOverallStats() {
  const questions = useProgressStore(s => s.questions)
  return useMemo(() => {
    const total = questions.length
    const rehearsed = questions.filter(q => q.rehearsed).length
    const highPriority = questions.filter(q => q.priority === 'high')
    const highRehearsed = highPriority.filter(q => q.rehearsed).length
    const withConfidence = questions.filter(q => q.confidence > 0)
    const avgConfidence =
      withConfidence.length > 0
        ? withConfidence.reduce((sum, q) => sum + q.confidence, 0) / withConfidence.length
        : 0
    return {
      total,
      rehearsed,
      highTotal: highPriority.length,
      highRehearsed,
      avgConfidence,
    }
  }, [questions])
}

export function useDrillQueue(filters: DrillFilters): MergedQuestion[] {
  const questions = useProgressStore(s => s.questions)
  return useMemo(() => {
    let qs = questions

    if (filters.categoryIds.length > 0) {
      qs = qs.filter(q => filters.categoryIds.includes(q.category_id))
    }
    if (filters.priorityOnly) {
      qs = qs.filter(q => q.priority === 'high')
    }
    if (filters.tags.length > 0) {
      qs = qs.filter(q => q.tags.some(t => filters.tags.includes(t)))
    }

    if (filters.shuffle) {
      qs = [...qs].sort(() => Math.random() - 0.5)
    }

    return qs
  }, [questions, filters])
}
