'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function AdminJobsClient({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  async function addJob(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.from('jobs').insert({ title, location, description, is_active: true }).select('*').single()
    if (error) return alert(error.message)
    setJobs([data, ...jobs])
    setTitle(''); setLocation(''); setDescription('')
  }

  async function removeJob(id: string) {
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return alert(error.message)
    setJobs(jobs.filter((j) => j.id !== id))
  }

  return (
    <main style={{ display: 'grid', gap: 18 }}>
      <h1>Admin – Jobs</h1>

      <form onSubmit={addJob} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Ort" value={location} onChange={(e) => setLocation(e.target.value)} />
        <textarea placeholder="Beschreibung" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Job hinzufügen</button>
      </form>

      <ul>
        {jobs.map((j) => (
          <li key={j.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span>{j.title}</span>
            <button onClick={() => removeJob(j.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
