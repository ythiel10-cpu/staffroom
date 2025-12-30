"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Job = {
  id: string;
  title: string | null;
  description: string | null;
};

export default function JobDetailPage() {
  const supabase = createSupabaseBrowserClient();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [applyMsg, setApplyMsg] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyInfo, setApplyInfo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setMsg(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("id,title,description")
        .eq("id", id)
        .single();

      setLoading(false);

      if (error) {
        setMsg("Fehler: " + error.message);
        return;
      }

      setJob(data as Job);
    })();
  }, [id, supabase]);

  async function apply() {
    setApplyInfo(null);
    setApplyLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/login?next=/jobs/${id}`);
        return;
      }

      const { error } = await supabase.from("applications").insert({
        job_id: id,
        applicant_id: user.id,
        message: applyMsg,
      });

      if (error) {
        setApplyInfo("DB-Fehler: " + error.message);
        return;
      }

      setApplyMsg("");
      setApplyInfo("Bewerbung gesendet ✅");
    } finally {
      setApplyLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <button
        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded"
        onClick={() => router.push("/jobs")}
      >
        ← Zurück
      </button>

      {loading && <div className="text-zinc-400 mt-6">Lade Job...</div>}
      {msg && <div className="text-red-400 mt-6">{msg}</div>}

      {job && (
        <div className="max-w-3xl mt-6">
          <h1 className="text-3xl font-bold">{job.title ?? "Ohne Titel"}</h1>

          {job.description && (
            <div className="text-zinc-200 mt-4 whitespace-pre-wrap">
              {job.description}
            </div>
          )}

          <div className="mt-10 border border-zinc-800 bg-zinc-950 rounded p-5">
            <h2 className="text-xl font-semibold">Bewerben</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Wenn du nicht eingeloggt bist, wirst du automatisch zum Login weitergeleitet.
            </p>

            <textarea
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 mt-4"
              rows={6}
              placeholder="Kurze Nachricht / Motivation…"
              value={applyMsg}
              onChange={(e) => setApplyMsg(e.target.value)}
            />

            <button
              className="mt-4 px-5 py-3 bg-white text-black rounded font-semibold disabled:opacity-50"
              onClick={apply}
              disabled={applyLoading}
            >
              {applyLoading ? "Sende..." : "Bewerbung senden"}
            </button>

            {applyInfo && (
              <div className={`text-sm mt-3 ${applyInfo.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                {applyInfo}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


