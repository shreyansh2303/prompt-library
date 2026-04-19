import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Dashboard from './Dashboard'

export default function App() {
  // REACT LESSON 1: "State"
  // Instead of checking the DOM, we tell React to remember a variable called 'session'.
  // 'setSession' is the function we use to update it. 
  // If 'session' is null, they aren't logged in.
  const [session, setSession] = useState(null)

  // REACT LESSON 2: "useEffect"
  // This runs background tasks when the page loads. 
  // Here, it asks Supabase: "Is this user already logged in from a previous visit?"
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // This listens for login/logout events and updates our 'session' variable instantly.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // REACT LESSON 3: Conditional Rendering
  // This is basically an "if/else" statement for your HTML.

  // IF NO SESSION: Show the Login Box
  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
        <h2>My Prompt Library</h2>
        <p>Sign in to manage your saved prompts.</p>
        
        {/* This is the magic Supabase component! */}
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={[]} // We'll stick to email/password for now
        />
      </div>
    )
  }

  // IF THERE IS A SESSION: Show the Dashboard (We will build this next)
  return <Dashboard session={session} />
}