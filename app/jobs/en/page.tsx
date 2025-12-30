"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type JobRow = {
  id: string;
  title?: string | null;
  title_en?: string | null;
  description?: string | null;
  description_en?: string | null;
};

export default function JobsENPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("id,title,title_en,description,description_en")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      setJobs((data as JobRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const titleOf = (j: JobRow) => j.title_en ?? j.title ?? "Untitled";
  const descOf = (j: JobRow) => j.description_en ?? j.description ?? "";

  async function submitApplication() {
    setStatusMsg(null);

    if (!openJobId) return;
    if (!name.trim() || !email.trim()) {
      setStatusMsg("Please enter name & email.");
      return;
    }

    const { error } = await supabase.from("applications").insert({
      job_id: openJobId,
      name: name.trim(),
      email: email.trim(),
      message: message.trim() || null,
    });

    if (error) {
      console.error(error);
      setStatusMsg("Failed to send. Please try again.");
      return;
    }

    setStatusMsg("✅ Application sent. We'll get back to you.");
    setName("");
    setEmail("");
    setMessage("");
    setOpenJobId(null);
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1>Jobs (EN)</h1>
      <p>Apply in 10 seconds — no account required.</p>

      {loading ? (
        <p>Loading…</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12, paddingLeft: 18 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ border: "1px solid #333", padding: 12, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <b>{titleOf(job)}</b>
                  {descOf(job) ? (
                    <p style={{ opacity: 0.85, marginTop: 8 }}>{descOf(job)}</p>
                  ) : null}
                </div>

                <button onClick={() => setOpenJobId(job.id)} style={{ height: 36 }}>
                  Apply
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openJobId ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={() => setOpenJobId(null)}
        >
          <div
            style={{ width: "100%", maxWidth: 520, background: "#111", border: "1px solid #333", borderRadius: 12, padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Application</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />

              {statusMsg ? <p>{statusMsg}</p> : null}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setOpenJobId(null)}>Cancel</button>
                <button onClick={submitApplication}>Send</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

