'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const createJob = async () => {
    const { error } = await supabase.from('jobs').insert({
      title,
      description,
      status: 'published',
      active: true
      // created_by wird automatisch via auth.uid()
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Job erstellt');
      setTitle('');
      setDescription('');
    }
  };

  return (
    <main>
      <h1>Admin ✅</h1>

      <h2>Neuen Job anlegen</h2>

      <input
        placeholder="Jobtitel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createJob}>Job veröffentlichen</button>

      {message && <p>{message}</p>}
    </main>
  );
}

