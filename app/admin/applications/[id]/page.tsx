import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin/applications')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/login?next=/admin')

  const { data: app } = await supabase.from('applications').select('*').eq('id', params.id).single()
  if (!app) redirect('/admin/applications')

  return (
    <div style={{ padding: 24, color: 'white', fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Status ändern</h1>
      <p style={{ opacity: 0.8 }}>{app.full_name} • {app.email}</p>

      <form action={async (formData) => {
        'use server'
        const supabase = await createSupabaseServerClient()
        const status = String(formData.get('status') || 'new')
        await supabase.from('applications').update({ status }).eq('id', params.id)
        redirect('/admin/applications')
      }}>
        <select name="status" defaultValue={app.status} style={{ padding: 10, borderRadius: 8, marginTop: 12 }}>
          <option value="new">new</option>
          <option value="reviewed">reviewed</option>
          <option value="rejected">rejected</option>
        </select>

        <button style={{ marginLeft: 10, padding: 10, borderRadius: 8, fontWeight: 800 }}>
          Speichern
        </button>
      </form>
    </div>
  )
}

