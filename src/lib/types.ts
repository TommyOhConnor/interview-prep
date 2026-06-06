export interface Category {
  id: string
  number: number
  name: string
  tag: string
  probing_for: string
  your_angle: string
  notes: string[]
}

export interface Question {
  id: string
  category_id: string
  category_number: number
  subgroup: string | null
  text: string
  tags: string[]
  priority: 'high' | 'normal'
  rehearsed: boolean
  confidence: number
  user_notes: string
}

export interface BankMeta {
  title: string
  role: string
  company: string
  design_lead: string
  owner: string
  status: string
  source_last_updated: string
  version: string
  generated_at: string
  source_file: string
  question_count: number
  category_count: number
}

export interface QuestionBank {
  meta: BankMeta
  tags: string[]
  categories: Category[]
  questions: Question[]
}

export interface QuestionProgress {
  question_id: string
  user_id: string
  rehearsed: boolean
  confidence: number
  user_notes: string
  updated_at: string
}

export interface MergedQuestion extends Question {
  category: Category
}

export interface DrillSession {
  queue: MergedQuestion[]
  currentIndex: number
  flipped: boolean
  sessionResults: Array<{ questionId: string; confidence: number }>
}

export interface DrillFilters {
  categoryIds: string[]
  priorityOnly: boolean
  tags: string[]
  shuffle: boolean
}
