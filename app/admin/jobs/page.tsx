import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const supabase = await createServerClient();

  // Nur veröffentlichte Jobs
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, description, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 42, marginBottom: 12 }}>Jobs</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Alle offenen Stellen.</p>

      {error && (
        <div style={{ padding: 12, border: "1px solid #333", borderRadius: 8 }}>
          Fehler beim Laden: {error.message}
        </div>
      )}

      {!jobs?.length && !error && (
        <div style={{ padding: 16, border: "1px solid #333", borderRadius: 8 }}>
          Aktuell sind keine Jobs veröffentlicht.
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {jobs?.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            style={{
              border: "1px solid #333",
              borderRadius: 10,
              padding: 16,
              textDecoration: "none",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>{job.title}</div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>
              {(job.description || "").slice(0, 140)}
              {(job.description || "").length > 140 ? "…" : ""}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
