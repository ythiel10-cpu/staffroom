"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/browser"

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ApplyInner />
    </Suspense>
  )
}

function ApplyInner() {
  const params = useSearchParams()
  const supabase = useMemo(() => createBrowserClient(), [])

  const jobId = params.get("jobId") || params.get("id") || ""
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [status, setStatus] = useState("Bewerbung öffnen ✅")
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const onSubmit = async () => {
    setErr(null)
    setOk(false)

    if (!jobId) {
      setErr("Fehlt: jobId in URL. Beispiel: /apply?jobId=UUID")
      return
    }
    if (!fullName.trim() || !email.trim()) {
      setErr("Bitte Name + Email ausfüllen.")
      return
    }

    try {
      setStatus("Upload/Save läuft…")

      let cvPath: string | null = null

      // Optional: CV Upload (Storage bucket: "applications")
      if (file) {
        const safeName = file.name.replaceAll(" ", "_")
        cvPath = `${jobId}/${Date.now()}-${safeName}`

        const { error: upErr } = await supabase.storage
          .from("applications")
          .upload(cvPath, file, { upsert: false })

        if (upErr) throw upErr
      }

      // Save application in DB via API
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobId,
          fullName,
          email,
          message,
          cvPath,
        }),
      })

      const json = await res.json()
      if (!json.ok) throw new Error(json.error || "Apply failed")

      setStatus("Gesendet ✅")
      setOk(true)
    } catch (e: any) {
      setErr(String(e?.message ?? e))
      setStatus("Fehlgeschlagen ❌")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: 24,
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Bewerben</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>{status}</p>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        jobId: <code>{jobId || "—"}</code>
      </div>

      <div style={{ display: "grid", gap: 10, maxWidth: 520, marginTop: 20 }}>
        <input
          style={{ padding: 10, borderRadius: 8 }}
          placeholder="Vollständiger Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          style={{ padding: 10, borderRadius: 8 }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          style={{ padding: 10, borderRadius: 8 }}
          placeholder="Nachricht (optional)"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>CV (optional)</div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          onClick={onSubmit}
          style={{
            padding: 10,
            borderRadius: 8,
            background: "#fff",
            color: "#111",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Bewerbung absenden
        </button>

        {ok && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: "#063" }}>
            Bewerbung gespeichert ✅
          </div>
        )}

        {err && (
          <pre
            style={{
              marginTop: 12,
              background: "#300",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
            }}
          >
            {err}
          </pre>
        )}
      </div>
    </div>
  )
}

