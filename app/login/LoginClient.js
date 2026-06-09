'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import './login.css'

export default function LoginClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [role, setRole] = useState(searchParams.get('role') || 'customer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <main className="login-page">
      <div className="login-card card">
        <div className="login-top">
          <div className="login-emoji">🍱</div>
          <h1>Welcome to<br />Tiffin Connect</h1>
          <p>Join free as a customer or home chef</p>
        </div>

        <div className="role-toggle">
          <button className={`role-btn ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>
            🥢 I want Tiffin
          </button>
          <button className={`role-btn ${role === 'provider' ? 'active' : ''}`} onClick={() => setRole('provider')}>
            👩‍🍳 I am a Home Chef
          </button>
        </div>

        <div className="role-info">
          {role === 'customer' ? (
            <><b>As a Customer you can:</b>
              <ul>
                <li>Browse home chefs in your city</li>
                <li>Subscribe to weekly or monthly plans</li>
                <li>Pause or cancel anytime</li>
                <li>Get meals delivered to your door</li>
              </ul></>
          ) : (
            <><b>As a Home Chef you can:</b>
              <ul>
                <li>List unlimited tiffin plans for free</li>
                <li>Set your own price and delivery area</li>
                <li>Earn directly to your UPI account</li>
                <li>We take only 8% commission per order</li>
              </ul></>
          )}
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="btn btn-clay login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Redirecting...' : '🔐 Continue with Google'}
        </button>
        <p className="login-note">Free to join · No credit card · Secure via Google</p>
      </div>
    </main>
  )
}
