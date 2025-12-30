import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth.user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/unauthorized')

  return auth.user
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <main style={{ maxWidth: 900, margin: '30px auto', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <a href="/admin">Admin Home</a>
        <a href="/admin/jobs">Jobs</a>
        <a href="/admin/applications">Applications</a>
        <a href="/logout">Logout</a>
      </nav>
      {children}
    </main>
  )
}
