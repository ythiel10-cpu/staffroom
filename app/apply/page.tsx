import { Suspense } from 'react'
import ApplyClient from './ui'

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: 'white' }}>Loading…</div>}>
      <ApplyClient />
    </Suspense>
  )
}
