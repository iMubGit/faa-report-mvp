// src/app/dashboard/Dashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setMessage('Uploading & processing…')

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      // 3. Create report + file rows
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({ user_id: user.id, status: 'processing' })
        .select()
        .single()

      if (reportError) throw reportError

      const { error: fileError } = await supabase
        .from('files')
        .insert({
          report_id: report.id,
          url: publicUrl,
          original_name: file.name,
          file_type: file.type,
          size: file.size
        })

      if (fileError) throw fileError

      setMessage(`Success! File uploaded – AI will generate report shortly.`)
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  if (!user) return <div className="text-center p-20">Loading…</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">FAA Report Generator</h1>
            <button onClick={handleLogout} className="text-red-600 hover:underline text-lg">
              Logout
            </button>
          </div>

          <p className="text-xl text-gray-700 mb-12">
            Welcome back, <span className="font-bold">{user.email}</span> ✈️
          </p>

          <div className="border-4 border-dashed border-indigo-400 rounded-3xl p-24 text-center bg-indigo-50 hover:bg-indigo-100 transition">
            <input
              type="file"
              accept=".pdf,.mp3,.wav,.m4a,.jpg,.png,.heic"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-lg text-gray-900 file:mr-6 file:py-4 file:px-10 file:rounded-full file:border-0 file:text-white file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 hover:file:from-indigo-700 hover:file:to-purple-700 cursor-pointer"
            />
            <p className="mt-8 text-2xl text-gray-700 font-medium">
              {uploading ? 'Uploading & processing…' : 'Drop inspection notes here'}
            </p>
            <p className="mt-4 text-gray-600">
              PDF, photos, voice memos → AI generates perfect FAA report
            </p>
          </div>

          {message && (
            <div className={`mt-8 p-6 rounded-xl text-center text-lg font-medium ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}