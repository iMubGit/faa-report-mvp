// src/app/page.tsx  ← FINAL WORKING VERSION
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoginPage from './login/page'

export default async function HomePage() {
  // This runs on the server
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  // If no session → show login page (or you can keep redirecting to /login if you prefer)
  return <LoginPage />
}