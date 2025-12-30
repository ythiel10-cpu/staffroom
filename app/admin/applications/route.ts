import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path')
  if (!path) return new NextResponse('missing path', { status: 400 })

  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('unauthorized', { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new NextResponse('forbidden', { status: 403 })

  const { data, error } = await supabase.storage.from('applications').download(path)
  if (error || !data) return new NextResponse('not found', { status: 404 })

  return new NextResponse(data, {
    headers: {
      'Content-Type': data.type || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${path.split('/').pop() || 'cv'}"`,
    },
  })
}
