import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server";
const supabase = createSupabaseServerClient();


type AppRow = {
  id: string
  job_id: string | null
  full_name: string | null
  email: string | null
  message: string | null
  cv_path: string | null
  created_at: string | null
  _cv_url?: string | null
}

export default async function AdminApplicationsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin/applications")}`)

  const { data, error } = await supabase
    .from("applications")
    .select("id,job_id,full_name,email,message,cv_path,created_at")
    .order("created_at", { ascending: false })

  const apps: AppRow[] = (data ?? []) as any

  // Signed URLs for CV download (if exists)
  await Promise.all(
    apps.map(async (a) => {
      if (!a.cv_path) {
        a._cv_url = null
        return
      }
      const { data } = await supabase.storage
        .from("applications")
        .createSignedUrl(a.cv_path, 60 * 10) // 10 min

      a._cv_url = data?.signedUrl ?? null
    })
  )

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Applications</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>Alle Bewerbungen aus der DB.</p>

      {error && (
        <pre style={{ background: "#300", padding: 12, borderRadius: 10, overflow: "auto" }}>
          {String(error.message)}
        </pre>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {apps.map((a) => (
          <div key={a.id} style={{ border: "1px solid #333", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{a.full_name || "—"}</div>
                <div style={{ opacity: 0.8 }}>{a.email || "—"}</div>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>
                <div>Job: <code>{a.job_id || "—"}</code></div>
                <div>At: {a.created_at || "—"}</div>
              </div>
            </div>

            {a.message && (
              <div style={{ marginTop: 10, whiteSpace: "pre-wrap", opacity: 0.9 }}>
                {a.message}
              </div>
            )}

            <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                id: <code>{a.id}</code>
              </div>

              {a._cv_url ? (
                <a
                  href={a._cv_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#9cf", textDecoration: "underline" }}
                >
                  CV downloaden (10min Link)
                </a>
              ) : (
                <span style={{ fontSize: 12, opacity: 0.6 }}>Kein CV</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
