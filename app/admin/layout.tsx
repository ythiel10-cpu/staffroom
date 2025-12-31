import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${encodeURIComponent("/admin")}`)

  // Role check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect(`/login?next=${encodeURIComponent("/admin")}`)

  // Server Action: Logout
  async function logout() {
    "use server"
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <nav
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/admin" style={{ color: "#fff", textDecoration: "none" }}>
              Admin Home
            </Link>
            <Link href="/admin/jobs" style={{ color: "#fff", textDecoration: "none" }}>
              Jobs
            </Link>
            <Link href="/admin/applications" style={{ color: "#fff", textDecoration: "none" }}>
              Applications
            </Link>
          </div>

          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #333",
                background: "#fff",
                color: "#111",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </form>
        </nav>

        {children}
      </div>
    </div>
  )
}

