import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function signIn() {
    setMessage('Sending magic link…')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://faa-mvp.vercel.app/dashboard' }
    })
    if (error) setMessage('Error: ' + error.message)
    else setMessage('Check your email! Click the link to sign in.')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">FAA Reporting Tool</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to start creating FAA reports</p>
        
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={signIn}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Send Magic Link
        </button>
        
        {message && <p className="mt-6 text-center text-sm">{message}</p>}
      </div>
    </div>
  )
}