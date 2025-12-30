import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id,title,location,created_at")
    .order("created_at", { ascending: false })

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Jobs</h1>
      <p style={{ opacity: 0.7 }}>Öffentliche Jobliste (read-only)</p>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 720 }}>
        {(jobs ?? []).map((j) => (
          <Link
            key={j.id}
            href={`/jobs/${j.id}`}
            style={{ display: "block", padding: 14, borderRadius: 12, background: "#1a1a1a" }}
          >
            <div style={{ fontWeight: 800 }}>{j.title}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>{j.location ?? ""}</div>
          </Link>
        ))}

        {(!jobs || jobs.length === 0) && (
          <div style={{ opacity: 0.7, padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
            Keine Jobs verfügbar.
          </div>
        )}
      </div>
    </div>
  )
}
