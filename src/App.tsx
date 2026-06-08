import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { Browse } from '@/pages/Browse'
import { CategoryDetail } from '@/pages/CategoryDetail'
import { QuestionDetail } from '@/pages/QuestionDetail'
import { Drill } from '@/pages/Drill'
import { DrillSession } from '@/pages/DrillSession'
import { Toaster } from '@/components/ui/sonner'
import { useProgressStore } from '@/store/progressStore'
import { getUserId } from '@/lib/identity'

export default function App() {
  const loadProgress = useProgressStore(s => s.loadProgress)

  useEffect(() => {
    loadProgress(getUserId())
  }, [loadProgress])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse/:categoryId" element={<CategoryDetail />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/drill" element={<Drill />} />
          <Route path="/drill/session" element={<DrillSession />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
      <Toaster />
    </BrowserRouter>
  )
}
