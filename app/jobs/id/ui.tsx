import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient()

  const { data: job } = await supabase
    .from("jobs")
    .select("id,title,location,description")
    .eq("id", params.id)
    .single()

  if (!job) {
    return (
      <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
        <h1>Job nicht gefunden</h1>
        <Link href="/jobs" style={{ color: "#fff", textDecoration: "underline" }}>Zurück</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <Link href="/jobs" style={{ color: "#fff", textDecoration: "underline" }}>← Zurück</Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>{job.title}</h1>
      <div style={{ opacity: 0.7 }}>{job.location ?? ""}</div>

      <div style={{ marginTop: 16, whiteSpace: "pre-wrap", opacity: 0.9 }}>
        {job.description ?? ""}
      </div>

      <div style={{ marginTop: 24 }}>
        <Link
          href={`/apply?jobId=${job.id}`}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 12,
            background: "#fff",
            color: "#111",
            fontWeight: 800,
          }}
        >
          Bewerben
        </Link>
      </div>
    </div>
  )
}

