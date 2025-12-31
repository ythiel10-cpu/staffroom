import Link from "next/link";

export default function ThanksPage() {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 42 }}>Danke! ✅</h1>
      <p style={{ opacity: 0.85, marginTop: 12 }}>
        Deine Bewerbung wurde gespeichert. Wir melden uns, sobald wir sie geprüft haben.
      </p>

      <div style={{ marginTop: 24 }}>
        <Link href="/jobs">← Zurück zu den Jobs</Link>
      </div>
    </main>
  );
}
