import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AppShell } from '@/components/layout/AppShell'
import { Auth } from '@/pages/Auth'
import { Home } from '@/pages/Home'
import { Browse } from '@/pages/Browse'
import { CategoryDetail } from '@/pages/CategoryDetail'
import { QuestionDetail } from '@/pages/QuestionDetail'
import { Drill } from '@/pages/Drill'
import { DrillSession } from '@/pages/DrillSession'
import { Toaster } from '@/components/ui/sonner'
import { useProgressStore } from '@/store/progressStore'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const loadProgress = useProgressStore(s => s.loadProgress)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProgress(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProgress(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [loadProgress])

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <>
        <Auth />
        <Toaster />
      </>
    )
  }

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
