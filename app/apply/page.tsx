'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function ApplyPage() {
  const supabase = createSupabaseBrowserClient()
  const params = useSearchParams()
  const jobId = params.get('job')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const submit = async () => {
    setStatus('')
    const { error } = await supabase.from('applications').insert({
      job_id: jobId,
      name,
      email,
      message,
    })
    if (error) setStatus(error.message)
    else setStatus('✅ Saved!')
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12, maxWidth: 520 }}>
      <h1>Apply</h1>
      <p>Job: {jobId}</p>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={submit}>Submit</button>
      {status && <p>{status}</p>}
    </main>
  )
}

