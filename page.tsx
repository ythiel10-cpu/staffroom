"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("testuser@example.com");
  const [password, setPassword] = useState("test1234");

  const [session, setSession] = useState<any>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) router.push("/dashboard");
    });

    return () => sub.subscription.unsubscribe();
  }, [router]);

  const signUp = async () => {
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "✅ Sign up OK (falls Email-Confirm aktiv: Mail checken)");
  };

  const signIn = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "✅ Sign in OK");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMsg("👋 Abgemeldet");
  };

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>StaffRoom 🚀</h1>

      <p style={{ marginTop: 12 }}>
        Status: {session ? "EINGELOGGT ✅" : "NICHT EINGELOGGT ❌"}
      </p>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 340 }}>
        <input
          style={{ padding: 10, borderRadius: 8, color: "black" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          style={{ padding: 10, borderRadius: 8, color: "black" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          type="password"
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={signUp} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Sign up
          </button>
          <button onClick={signIn} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Sign in
          </button>
          <button onClick={signOut} style={{ padding: "10px 14px", borderRadius: 8, opacity: 0.8 }}>
            Sign out
          </button>
        </div>

        {msg && <div style={{ marginTop: 8, opacity: 0.9 }}>{msg}</div>}
      </div>
    </main>
  );
}
