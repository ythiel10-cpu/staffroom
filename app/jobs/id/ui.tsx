'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.from('applications').insert({
      job_id: jobId,
      full_name: fullName,
      email,
      phone,
      message,
    })

    if (error) return setError(error.message)
    setOk(true)
  }

  if (ok) return <p>✅ Bewerbung gesendet. Danke!</p>

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
      <h2>Bewerben</h2>
      <input placeholder="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="Telefon (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <textarea placeholder="Nachricht" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Absenden</button>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
    </form>
  )
}
