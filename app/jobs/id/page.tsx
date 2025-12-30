import { createSupabaseServerClient } from '@/lib/supabase/server'
import ApplyForm from './ui'

export default async function JobDetail({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('id,title,location,description')
    .eq('id', params.id)
    .single()

  if (!job) return <main style={{ padding: 16 }}>Job nicht gefunden.</main>

  return (
    <main style={{ maxWidth: 900, margin: '30px auto', padding: 16 }}>
      <h1>{job.title}</h1>
      <p>{job.location}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
      <hr style={{ margin: '20px 0' }} />
      <ApplyForm jobId={job.id} />
    </main>
  )
}
