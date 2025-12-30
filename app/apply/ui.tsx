"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/browser"

export default function ApplyClient() {
  const params = useSearchParams()
  const jobId = params.get("jobId") || ""
  const supabase = createBrowserClient()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  const submit = async () => {
    setStatus(null)
    if (!jobId) return setStatus("Fehler: jobId fehlt.")
    if (!fullName || !email) return setStatus("Bitte Name + Email ausfüllen.")

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      full_name: fullName,
      email,
      message,
    })

    if (error) return setStatus(error.message)
    setStatus("Bewerbung gesendet ✅")
    setFullName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Bewerbung</h1>
      <p style={{ opacity: 0.7 }}>jobId: {jobId || "(fehlt)"} </p>

      <div style={{ display: "grid", gap: 10, maxWidth: 520, marginTop: 16 }}>
        <input style={{ padding: 10, borderRadius: 10 }} placeholder="Full name"
          value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <input style={{ padding: 10, borderRadius: 10 }} placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <textarea style={{ padding: 10, borderRadius: 10, minHeight: 120 }}
          placeholder="Message (optional)"
          value={message} onChange={(e) => setMessage(e.target.value)} />

        <button
          onClick={submit}
          style={{ padding: 10, borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800 }}
        >
          Absenden
        </button>

        {status && <div style={{ opacity: 0.9 }}>{status}</div>}
      </div>
    </div>
  )
}

