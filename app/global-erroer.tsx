'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ background: '#111', color: '#fff', padding: 24, fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>❌ App crashed</h1>
        <p style={{ opacity: 0.8 }}>Jetzt siehst du endlich den echten Fehler:</p>

        <pre style={{ marginTop: 12, background: '#300', padding: 12, borderRadius: 8, overflow: 'auto' }}>
          {String(error?.message ?? error)}
          {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
        </pre>

        <button
          onClick={() => reset()}
          style={{ marginTop: 12, padding: 10, borderRadius: 8, background: '#fff', color: '#111', fontWeight: 700 }}
        >
          Retry
        </button>
      </body>
    </html>
  )
}
