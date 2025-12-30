import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminApplicationsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin/applications')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/login?next=/admin')

  const { data: apps } = await supabase
    .from('applications')
    .select('id, job_id, full_name, email, phone, message, cv_path, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: 24, color: 'white', fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Applications</h1>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {(apps ?? []).map((a) => (
          <div key={a.id} style={{ border: '1px solid #333', borderRadius: 12, padding: 14, background: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{a.full_name}</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>{a.email} {a.phone ? `• ${a.phone}` : ''}</div>
                <div style={{ opacity: 0.6, fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Status:</span>
                <span style={{ fontWeight: 800 }}>{a.status}</span>
              </div>
            </div>

            {a.message && <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', opacity: 0.9 }}>{a.message}</div>}

            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {a.cv_path && (
                <a
                  href={`/admin/applications/cv?path=${encodeURIComponent(a.cv_path)}`}
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  CV öffnen
                </a>
              )}
              <a href={`/admin/applications/${a.id}`} style={{ color: '#fff', textDecoration: 'underline' }}>
                Status ändern
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
