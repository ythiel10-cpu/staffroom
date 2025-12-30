'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'

export default function LoginClient() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/admin'

  const supabase = useMemo(() => createBrowserClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Login-Seite geladen ✅')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setStatus('Schon eingeloggt → redirect…')
          router.replace(next)
        }
      } catch (e: any) {
        setErr(String(e?.message ?? e))
      }
    })()
  }, [supabase, router, next])

  const onLogin = async () => {
    setErr(null)
    setStatus('Login läuft…')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setStatus('Login ok ✅ → redirect…')
      router.replace(next)
    } catch (e: any) {
      setErr(String(e?.message ?? e))
      setStatus('Login fehlgeschlagen ❌')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#fff',
        padding: 24,
        fontFamily: 'ui-sans-serif, system-ui',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Login</h1>
      <p style={{ opacity: 0.8 }}>{status}</p>

      <div style={{ display: 'grid', gap: 10, maxWidth: 360, marginTop: 20 }}>
        <input
          style={{ padding: 10, borderRadius: 8 }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ padding: 10, borderRadius: 8 }}
          placeholder="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={onLogin}
          style={{
            padding: 10,
            borderRadius: 8,
            background: '#fff',
            color: '#111',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
          next: <code>{next}</code>
        </div>

        {err && (
          <pre style={{ marginTop: 12, background: '#300', padding: 12, borderRadius: 8, overflow: 'auto' }}>
            {err}
          </pre>
        )}
      </div>
    </div>
  )
}
