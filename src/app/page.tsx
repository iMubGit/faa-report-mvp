// src/app/page.tsx   ← RECOMMENDED FINAL VERSION
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoginPage from './login/page'

export default async function HomePage() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return <LoginPage />
}