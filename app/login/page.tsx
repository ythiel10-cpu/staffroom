import { Suspense } from 'react'
import LoginClient from './ui'

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: 'white' }}>Loading…</div>}>
      <LoginClient />
    </Suspense>
  )
}

