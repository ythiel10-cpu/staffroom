'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'

function ApplyInner() {
  const params = useSearchParams()
  const jobId = params.get('jobId') || '' // ?jobId=...

  const supabase = useMemo(() => createBrowserClient(), [])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [cv, setCv] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('Apply-Seite geladen ✅')
  const [err, setErr] = useState<string | null>(null)

  const onSubmit = async () => {
    setErr(null)

    if (!jobId) {
      setErr('Fehlt: jobId in URL (z.B. /apply?jobId=...)')
      return
    }
    if (!email || !fullName) {
      setErr('Bitte Name + Email ausfüllen')
      return
    }

    setStatus('Sende Bewerbung…')

    try {
      let cv_path: string | null = null

      // 1) optional CV upload
      if (cv) {
        const safeName = cv.name.replaceAll(' ', '_')
        const path = `${jobId}/${Date.now()}_${safeName}`

        const { error: upErr } = await supabase.storage.from('applications').upload(path, cv, {
          cacheControl: '3600',
          upsert: false,
        })
        if (upErr) throw upErr
        cv_path = path
      }

      // 2) insert application
      const { error: insErr } = await supabase.from('applications').insert({
        job_id: jobId,
        full_name: fullName,
        email,
        phone,
        message,
        cv_path,
        status: 'new',
      })
      if (insErr) throw insErr

      setStatus('Bewerbung gesendet ✅')
      setFullName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setCv(null)
    } catch (e: any) {
      setErr(String(e?.message ?? e))
      setStatus('Fehler ❌')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Bewerben</h1>
      <p style={{ opacity: 0.8 }}>{status}</p>

      <div style={{ display: 'grid', gap: 10, maxWidth: 520, marginTop: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          jobId: <code>{jobId || '(fehlt)'}</code>
        </div>

        <input style={{ padding: 10, borderRadius: 8 }} placeholder="Vollständiger Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input style={{ padding: 10, borderRadius: 8 }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={{ padding: 10, borderRadius: 8 }} placeholder="Telefon (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea style={{ padding: 10, borderRadius: 8, minHeight: 120 }} placeholder="Nachricht (optional)" value={message} onChange={(e) => setMessage(e.target.value)} />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCv(e.target.files?.[0] ?? null)}
          style={{ padding: 10, borderRadius: 8, background: '#1a1a1a' }}
        />

        <button
          onClick={onSubmit}
          style={{ padding: 12, borderRadius: 8, background: '#fff', color: '#111', fontWeight: 800, cursor: 'pointer' }}
        >
          Bewerbung senden
        </button>

        {err && (
          <pre style={{ marginTop: 12, background: '#300', padding: 12, borderRadius: 8, overflow: 'auto' }}>
            {err}
          </pre>
        )}
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 24 }}>Lade…</div>}>
      <ApplyInner />
    </Suspense>
  )
}
