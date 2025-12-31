import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("id, title, description, created_at, published")
    .eq("id", params.id)
    .single();

  if (error || !job || !job.published) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Job nicht gefunden</h1>
        <p style={{ opacity: 0.8 }}>Dieser Job ist nicht verfügbar.</p>
        <Link href="/jobs">← Zurück</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link href="/jobs">← Zurück</Link>

      <h1 style={{ fontSize: 42, marginTop: 12 }}>{job.title}</h1>

      <div style={{ opacity: 0.8, marginTop: 8 }}>
        Erstellt:{" "}
        {job.created_at
          ? new Date(job.created_at).toLocaleString("de-DE")
          : "-"}
      </div>

      <div style={{ marginTop: 20, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {job.description || "Keine Beschreibung vorhanden."}
      </div>

      <div style={{ marginTop: 28 }}>
        <Link
          href={`/apply?jobId=${encodeURIComponent(job.id)}`}
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 10,
            border: "1px solid #333",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Jetzt bewerben →
        </Link>
      </div>
    </main>
  );
}


