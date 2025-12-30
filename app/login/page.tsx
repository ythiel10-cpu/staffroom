'use client'

import { createBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const supabase = createBrowserClient()

  const login = async () => {
    await supabase.auth.signInWithPassword({
      email: 'DEINE-EMAIL',
      password: 'DEIN-PASSWORT',
    })
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>
      <button onClick={login}>Login als Admin</button>
    </main>
  )
}

