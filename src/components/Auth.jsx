import { useState, useEffect } from 'react'
import { supabase } from '../lib/superbaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,  
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email! Magic link sent. ✨')
    }
    setLoading(false)
  }

  return (
    <div  style={{ maxWidth: '100%', margin: '4rem auto', padding: '2rem' }}>
      <h1>Login to Your Diary</h1>
      <p>Enter your email — no password needed!</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.8rem', margin: '1rem 0' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.8rem 1.5rem', background: '#0070f3', color: 'white', border: 'none' }}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: message.includes('error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  )
}