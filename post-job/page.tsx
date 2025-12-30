"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);

    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      setMsg("Not logged in");
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      title,
      club_id: "896add6f-a72a-4db2-8713-7045c44c8db2", // dein Club
      // created_by wird automatisch durch DEFAULT auth.uid()
    });

    if (error) setMsg(error.message);
    else setMsg("Job created ✅");
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Post Job</h1>

      <input
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={submit}>Create</button>

      {msg && <p>{msg}</p>}
    </main>
  );
}

