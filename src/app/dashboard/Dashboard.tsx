'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // ← adjust path if yours is different
import { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = () => supabase.auth.signOut()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">FAA Report Dashboard</h1>
            <button onClick={handleLogout} className="text-red-600 hover:underline font-medium">
              Logout
            </button>
          </div>

          <p className="text-lg text-gray-700 mb-10">
            Welcome back, <span className="font-semibold">{user?.email}</span> ✈️
          </p>

          <div className="border-4 border-dashed border-blue-300 rounded-2xl p-20 text-center bg-blue-50">
            <input
              type="file"
              accept=".pdf,.mp3,.wav,.m4a,.jpg,.png"
              disabled={uploading}
              className="block w-full text-lg text-gray-900 file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-white file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 hover:file:from-blue-700 hover:file:to-indigo-700 cursor-pointer"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  alert('File selected: ' + e.target.files[0].name + '\nUpload logic coming in next step!')
                }
              }}
            />
            <p className="mt-6 text-xl text-gray-600">
              {uploading ? 'Uploading…' : 'Drag & drop inspection notes (PDF, audio, photos)'}
            </p>
          </div>

          <p className="mt-10 text-center text-gray-500">
            Upload a file → we’ll extract text → generate perfect FAA report
          </p>
        </div>
      </div>
    </div>
  )
}