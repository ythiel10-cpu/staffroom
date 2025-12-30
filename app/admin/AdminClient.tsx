"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

type Club = { id: string; name: string };

type ApplicationRow = {
  id: string;
  message: string | null;
  created_at: string;
  job_id: string;
  applicant_id: string;
};

export default function AdminClient() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubId, setClubId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [appsMsg, setAppsMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setMsg(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login?next=/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const admin = profile?.role === "admin";
      setIsAdmin(admin);

      if (admin) {
        const { data: clubsData } = await supabase
          .from("clubs")
          .select("id,name")
          .order("name", { ascending: true });

        const clubList = (clubsData ?? []) as Club[];
        setClubs(clubList);
        if (clubList[0]?.id) setClubId(clubList[0].id);

        const { data: appData, error: appErr } = await supabase
          .from("applications")
          .select("id,message,created_at,job_id,applicant_id")
          .order("created_at", { ascending: false })
          .limit(50);

        if (appErr) setAppsMsg("Bewerbungen Fehler: " + appErr.message);
        setApps((appData ?? []) as ApplicationRow[]);
      }

      setChecking(false);
    })();
  }, [router, supabase]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login?next=/admin");
  }

  async function createJob() {
    setMsg(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMsg("Bitte einloggen.");
        router.replace("/login?next=/admin");
        return;
      }

      if (!isAdmin) {
        setMsg("Kein Zugriff: Du bist kein Admin.");
        return;
      }

      if (!clubId) {
        setMsg("Bitte Club auswählen (Pflicht).");
        return;
      }

      const { error } = await supabase.from("jobs").insert({
        club_id: clubId,
        title,
        description,
        status: "live",
        active: true,
      });

      if (error) {
        setMsg("DB-Fehler: " + error.message);
        return;
      }

      setTitle("");
      setDescription("");
      setMsg("Job erstellt ✅");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Lade Admin...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-3">Kein Zugriff</h1>
          <p className="text-zinc-300">
            Du bist eingeloggt, aber kein Admin. In Supabase → Tabelle <b>profiles</b> → role auf <b>admin</b> setzen.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin ✅</h1>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded"
            onClick={() => router.push("/jobs")}
          >
            Zur Jobliste
          </button>
          <button
            className="px-4 py-2 bg-white text-black rounded font-semibold"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-4 mt-8">
        <div>
          <div className="text-sm text-zinc-400 mb-1">Club (Pflicht)</div>
          <select
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {clubs.length === 0 && (
            <div className="text-xs text-zinc-500 mt-1">
              Noch keine Clubs vorhanden → Supabase Tabelle <b>clubs</b> → Row anlegen (name ausfüllen).
            </div>
          )}
        </div>

        <div>
          <div className="text-sm text-zinc-400 mb-1">Jobtitel</div>
          <input
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
            placeholder="z.B. Co-Trainer U19 (m/w/d)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <div className="text-sm text-zinc-400 mb-1">Beschreibung</div>
          <textarea
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-800"
            placeholder="Aufgaben, Anforderungen, Kontakt..."
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={createJob}
          disabled={loading || !title.trim() || !clubId}
          className="px-5 py-3 bg-white text-black rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Speichere..." : "Job veröffentlichen"}
        </button>

        {msg && (
          <div className="text-sm mt-2">
            {msg.startsWith("Job erstellt") ? (
              <span className="text-green-400">{msg}</span>
            ) : (
              <span className="text-red-400">{msg}</span>
            )}
          </div>
        )}
      </div>

      <div className="max-w-3xl mt-12">
        <h2 className="text-xl font-semibold mb-3">Letzte Bewerbungen (Admin)</h2>
        {appsMsg && <div className="text-red-400 mb-2">{appsMsg}</div>}

        {apps.length === 0 ? (
          <div className="text-zinc-400">Noch keine Bewerbungen.</div>
        ) : (
          <div className="grid gap-3">
            {apps.map((a) => (
              <div key={a.id} className="border border-zinc-800 bg-zinc-950 rounded p-4">
                <div className="text-xs text-zinc-500">
                  {new Date(a.created_at).toLocaleString()} • job_id: {a.job_id} • applicant: {a.applicant_id}
                </div>
                {a.message && <div className="mt-2 text-zinc-200 whitespace-pre-wrap">{a.message}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

