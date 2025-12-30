import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const formData = await req.formData()
  const job_id = Number(formData.get("job_id"))
  const name = String(formData.get("name") || "")
  const email = String(formData.get("email") || "")
  const message = String(formData.get("message") || "")

  if (!job_id || !name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("applications").insert({
    job_id,
    name,
    email,
    message: message || null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

