"use client"

import { useState } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function AdminJobsClient({ initialJobs }: { initialJobs: any[] }) {
  const supabase = createSupabaseBrowserClient()

  const [jobs, setJobs] = useState<any[]>(initialJobs)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [msg, setMsg] = useState<string | null>(null)

  const reload = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("id,title,location,status,is_active,created_at")
      .order("created_at", { ascending: false })
    setJobs(data ?? [])
  }

  const createJob = async () => {
    setMsg(null)
    if (!title) return setMsg("Titel fehlt.")

    const { error } = await supabase.from("jobs").insert({
      title,
      location,
      description,
      status: "live",
      is_active: true,
    })

    if (error) return setMsg(error.message)

    setTitle("")
    setLocation("")
    setDescription("")
    setMsg("Job erstellt ✅")
    await reload()
  }

  const toggleActive = async (id: string, current: boolean) => {
    setMsg(null)
    const { error } = await supabase.from("jobs").update({ is_active: !current }).eq("id", id)
    if (error) return setMsg(error.message)
    await reload()
  }

  const setStatusLive = async (id: string) => {
    setMsg(null)
    const { error } = await supabase.from("jobs").update({ status: "live" }).eq("id", id)
    if (error) return setMsg(error.message)
    await reload()
  }

  const setStatusClosed = async (id: string) => {
    setMsg(null)
    const { error } = await supabase.from("jobs").update({ status: "closed" }).eq("id", id)
    if (error) return setMsg(error.message)
    await reload()
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link href="/admin" style={{ color: "#fff", textDecoration: "underline" }}>← Admin</Link>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Jobs verwalten</h1>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 720 }}>
        <input style={{ padding: 10, borderRadius: 10 }} placeholder="Job Title"
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <input style={{ padding: 10, borderRadius: 10 }} placeholder="Location (optional)"
          value={location} onChange={(e) => setLocation(e.target.value)} />

        <textarea style={{ padding: 10, borderRadius: 10, minHeight: 120 }}
          placeholder="Description"
          value={description} onChange={(e) => setDescription(e.target.value)} />

        <button onClick={createJob}
          style={{ padding: 10, borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800 }}>
          Job erstellen (live + aktiv)
        </button>

        {msg && <div style={{ opacity: 0.9 }}>{msg}</div>}
      </div>

      <h2 style={{ marginTop: 28, fontSize: 18, fontWeight: 800 }}>Alle Jobs</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 900 }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
            <div style={{ fontWeight: 800 }}>{j.title}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              {j.location ?? ""} — status: {j.status} — active: {String(j.is_active)}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => toggleActive(j.id, j.is_active)}
                style={{ padding: "8px 10px", borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800 }}>
                Active togglen
              </button>

              <button onClick={() => setStatusLive(j.id)}
                style={{ padding: "8px 10px", borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800 }}>
                status=live
              </button>

              <button onClick={() => setStatusClosed(j.id)}
                style={{ padding: "8px 10px", borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800 }}>
                status=closed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
