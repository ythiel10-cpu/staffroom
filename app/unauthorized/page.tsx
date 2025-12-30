export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Kein Zugriff ❌</h1>
      <p style={{ opacity: 0.8 }}>Du bist eingeloggt, aber nicht Admin.</p>
      <a href="/" style={{ color: '#fff', textDecoration: 'underline' }}>Zurück</a>
    </div>
  )
}
