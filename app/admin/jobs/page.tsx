import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import AdminJobsClient from "./ui"

export default async function AdminJobsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/admin/jobs")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/unauthorized")

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id,title,location,status,is_active,created_at")
    .order("created_at", { ascending: false })

  return <AdminJobsClient initialJobs={jobs ?? []} />
}

