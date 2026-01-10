import { useState, useEffect } from 'react'
import { supabase } from '../lib/superbaseClient'
import Auth from './Auth'  

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })


    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!session) {
    return <Auth />
  }

  return children
}