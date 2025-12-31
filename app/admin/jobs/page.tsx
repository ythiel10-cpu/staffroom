import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminJobsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin/jobs")}`)

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id,title,description,published,created_at")
    .order("created_at", { ascending: false })

  async function createJob(formData: FormData) {
    "use server"
    const supabase = await createSupabaseServerClient()

    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()

    if (!title) redirect("/admin/jobs")

    await supabase.from("jobs").insert({
      title,
      description,
      published: true,
      is_active: true,
      active: true,
      created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
    })

    redirect("/admin/jobs")
  }

  async function updateJob(formData: FormData) {
    "use server"
    const supabase = await createSupabaseServerClient()

    const id = String(formData.get("id") ?? "")
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const published = formData.get("published") === "on"

    if (!id) redirect("/admin/jobs")

    await supabase
      .from("jobs")
      .update({ title, description, published })
      .eq("id", id)

    redirect("/admin/jobs")
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Jobs (Admin)</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>Hier kannst du Jobs anlegen und bearbeiten.</p>

      {/* CREATE */}
      <div style={{ marginTop: 18, padding: 16, border: "1px solid #333", borderRadius: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Neuen Job anlegen</h2>
        <form action={createJob} style={{ display: "grid", gap: 10, marginTop: 12, maxWidth: 520 }}>
          <input
            name="title"
            placeholder="Titel"
            style={{ padding: 10, borderRadius: 10 }}
            required
          />
          <textarea
            name="description"
            placeholder="Beschreibung"
            rows={4}
            style={{ padding: 10, borderRadius: 10 }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 10,
              background: "#fff",
              color: "#111",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Speichern
          </button>
        </form>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
        {error && (
          <pre style={{ background: "#300", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {String(error.message)}
          </pre>
        )}

        {(jobs ?? []).map((job) => (
          <div
            key={job.id}
            style={{ padding: 16, border: "1px solid #333", borderRadius: 12 }}
          >
            <form action={updateJob} style={{ display: "grid", gap: 10 }}>
              <input type="hidden" name="id" value={job.id} />

              <div style={{ display: "grid", gap: 8 }}>
                <input
                  name="title"
                  defaultValue={job.title ?? ""}
                  style={{ padding: 10, borderRadius: 10 }}
                />
                <textarea
                  name="description"
                  defaultValue={job.description ?? ""}
                  rows={4}
                  style={{ padding: 10, borderRadius: 10 }}
                />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="checkbox" name="published" defaultChecked={!!job.published} />
                <span>Published (öffentlich sichtbar)</span>
              </label>

              <button
                type="submit"
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: "#fff",
                  color: "#111",
                  fontWeight: 800,
                  cursor: "pointer",
                  width: 220,
                }}
              >
                Update speichern
              </button>

              <div style={{ fontSize: 12, opacity: 0.7 }}>
                id: <code>{job.id}</code>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
