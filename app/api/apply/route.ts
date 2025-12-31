import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function getSupabaseAdminOrAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Wenn Service Role vorhanden -> bypass RLS (ideal)
  // Sonst -> anon client (dann brauchst du RLS INSERT policy für anon)
  const key = service || anon

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const jobId = String(body.jobId ?? "").trim()
    const fullName = String(body.fullName ?? "").trim()
    const email = String(body.email ?? "").trim()
    const message = String(body.message ?? "").trim()
    const cvPath = body.cvPath ? String(body.cvPath) : null

    if (!jobId || !fullName || !email) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (jobId, fullName, email)." },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminOrAnonClient()

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      full_name: fullName,
      email,
      message,
      cv_path: cvPath,
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 })
  }
}

