"use client"

import { useState } from "react"

export default function ApplyForm({ jobId }: { jobId: number }) {
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(formData: FormData) {
    setOk(false); setErr(null)

    const res = await fetch("/api/apply", {
      method: "POST",
      body: formData,
    })

    const json = await res.json()
    if (!res.ok) setErr(json?.error || "Fehler")
    else setOk(true)
  }

  return (
    <form action={submit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
      <input type="hidden" name="job_id" value={String(jobId)} />
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Nachricht (optional)" rows={5} />

      <button type="submit">Absenden</button>

      {ok && <p style={{ color: "lime" }}>✅ Bewerbung gespeichert!</p>}
      {err && <p style={{ color: "tomato" }}>❌ {err}</p>}
    </form>
  )
}
