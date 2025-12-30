import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminApplications() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('applications')
    .select('id,full_name,email,phone,message,created_at, jobs(title)')
    .order('created_at', { ascending: false })

  return (
    <main>
      <h1>Applications</h1>
      <ul style={{ display: 'grid', gap: 12 }}>
        {data?.map((a: any) => (
          <li key={a.id} style={{ border: '1px solid #333', padding: 12, borderRadius: 8 }}>
            <b>{a.full_name}</b> – {a.email} {a.phone ? `(${a.phone})` : ''}
            <div>Job: {a.jobs?.title}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{a.message}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
