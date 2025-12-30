export default function Unauthorized() {
  return (
    <main style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h1>Kein Zugriff</h1>
      <p>Du bist nicht als Admin freigeschaltet.</p>
      <a href="/login">Zum Login</a>
    </main>
  )
}
