import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminApplicationsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/admin/applications")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/unauthorized")

  const { data: apps } = await supabase
    .from("applications")
    .select("id,full_name,email,message,created_at, job_id")
    .order("created_at", { ascending: false })

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link href="/admin" style={{ color: "#fff", textDecoration: "underline" }}>← Admin</Link>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Bewerbungen</h1>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 900 }}>
        {(apps ?? []).map((a) => (
          <div key={a.id} style={{ padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
            <div style={{ fontWeight: 800 }}>{a.full_name}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              {a.email} — job_id: {a.job_id} — {new Date(a.created_at).toLocaleString()}
            </div>
            {a.message && <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{a.message}</div>}
          </div>
        ))}

        {(!apps || apps.length === 0) && (
          <div style={{ opacity: 0.7, padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
            Noch keine Bewerbungen.
          </div>
        )}
      </div>
    </div>
  )
}

