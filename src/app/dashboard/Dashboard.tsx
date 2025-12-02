'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // 1. ADD ROUTER IMPORT
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const router = useRouter() // 2. INITIALIZE ROUTER
  const [user, setUser] = useState<User | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // 3. ENHANCED PROTECTION: Check session and redirect if user is missing
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
    })
  }, [router]) // Dependency on router is good practice

  // 4. LOGOUT: Make async and redirect after sign out
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // OPTIONAL: Prevent rendering dashboard content until the user check is complete
  if (!user) {
    return <div className="text-center p-8">Loading session...</div> 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* ... rest of the dashboard UI remains the same */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">FAA Report Dashboard</h1>
            <button onClick={handleLogout} className="text-red-600 hover:underline font-medium">
              Logout
            </button>
          </div>
          
          <p className="text-lg text-gray-700 mb-10">
            Welcome back, <span className="font-semibold">{user.email}</span> ✈️ 
            {/* Note: changed user?.email to user.email since we check for user above */}
          </p>

          {/* ... file upload UI ... */}
          
        </div>
      </div>
    </div>
  )
}