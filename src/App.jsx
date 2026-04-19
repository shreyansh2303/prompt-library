import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Dashboard from './Dashboard'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
        <h2>My Prompt Library</h2>
        <p>Sign in to manage your saved prompts.</p>
        
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={[]}
        />
      </div>
    )
  }

  return <Dashboard session={session} />
}