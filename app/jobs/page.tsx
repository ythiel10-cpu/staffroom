"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";

type Job = {
  id: string;
  title: string | null;
  description: string | null;
  created_at?: string;
};

export default function JobsPage() {
  const supabase = createSupabaseBrowserClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setMsg(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("id,title,description,created_at")
        .eq("status", "live")
        .eq("active", true)
        .order("created_at", { ascending: false });

      setLoading(false);

      if (error) {
        setMsg("Fehler: " + error.message);
        return;
      }

      setJobs((data ?? []) as Job[]);
    })();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded" href="/admin">
          Admin
        </Link>
      </div>

      {loading && <div className="text-zinc-400 mt-6">Lade Jobs...</div>}
      {msg && <div className="text-red-400 mt-6">{msg}</div>}

      {!loading && !msg && jobs.length === 0 && (
        <div className="text-zinc-400 mt-6">Noch keine Jobs online.</div>
      )}

      <div className="grid gap-4 max-w-3xl mt-6">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="rounded border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-600"
          >
            <div className="text-xl font-semibold">{job.title ?? "Ohne Titel"}</div>
            {job.description && (
              <div className="text-zinc-300 mt-2 line-clamp-3 whitespace-pre-wrap">
                {job.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
