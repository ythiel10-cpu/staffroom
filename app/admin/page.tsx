import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/admin")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/unauthorized")

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Admin</h1>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 520 }}>
        <Link href="/admin/jobs" style={{ padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
          Jobs verwalten
        </Link>
        <Link href="/admin/applications" style={{ padding: 14, borderRadius: 12, background: "#1a1a1a" }}>
          Bewerbungen ansehen
        </Link>
      </div>
    </div>
  )
}

