export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1>Staffroom</h1>
      <p>Simple MVP: Jobs + Apply + Admin.</p>

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <a href="/jobs?lang=en">→ Jobs (EN)</a>
        <a href="/jobs?lang=de">→ Jobs (DE)</a>
        <a href="/login">→ Login</a>
        <a href="/admin">→ Admin</a>
        <a href="/dashboard">→ Dashboard</a>
      </div>
    </main>
  );
}
