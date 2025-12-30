'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Login-Seite geladen ✅')
  const [err, setErr] = useState<string | null>(null)

  // ✅ Supabase Client erst NACH Mount erstellen (so kann kein "black screen" beim Rendern passieren)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    try {
      const client = createBrowserClient()
      setSupabase(client)
      console.log('✅ supabase client ok')
    } catch (e: any) {
      console.error('❌ supabase client error', e)
      setErr(String(e?.message ?? e))
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

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
    if (!supabase) {
      setErr('Supabase Client fehlt (ENV?)')
      return
    }

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

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
          ENV check:{' '}
          <code>
            URL={String(process.env.NEXT_PUBLIC_SUPABASE_URL).slice(0, 25)}… / KEY=
            {String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).slice(0, 10)}…
          </code>
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
