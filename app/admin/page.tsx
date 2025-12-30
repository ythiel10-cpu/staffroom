import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  // nicht eingeloggt -> login mit next
  if (!user) redirect('/login?next=/admin')

  // role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // eingeloggt aber nicht admin -> unauthorized
  if (profile?.role !== 'admin') redirect('/unauthorized')

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>ADMIN OK ✅</h1>

      <form action="/auth/logout" method="post" style={{ marginTop: 16 }}>
        <button
          type="submit"
          style={{ padding: 10, borderRadius: 10, background: '#fff', color: '#111', fontWeight: 800 }}
        >
          Logout
        </button>
      </form>
    </div>
  )
}
