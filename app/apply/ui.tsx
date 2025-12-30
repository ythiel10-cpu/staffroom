'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/browser'

export default function ApplyClient() {
  const params = useSearchParams()
  const jobId = params.get('jobId') || ''

  const supabase = createBrowserClient()

  // --- Beispiel-State (deinen bestehenden übernehmen) ---
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async () => {
    setStatus('Sende…')
    // TODO: hier dein insert in applications (falls du den schon hast, einfach rein kopieren)
    setStatus('Gespeichert ✅')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 24 }}>
      <h1>Apply</h1>
      <p style={{ opacity: 0.7 }}>jobId: {jobId}</p>

      <div style={{ display: 'grid', gap: 10, maxWidth: 420, marginTop: 16 }}>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button onClick={onSubmit}>Submit</button>
        {status && <p>{status}</p>}
      </div>
    </div>
  )
}
