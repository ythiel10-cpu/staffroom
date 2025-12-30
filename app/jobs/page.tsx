import { createSupabaseServerClient } from '@/lib/supabase/server'
import AdminJobsClient from './ui'

export default async function AdminJobsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: jobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
  return <AdminJobsClient initialJobs={jobs || []} />
}
