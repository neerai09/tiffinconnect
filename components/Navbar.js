'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadRole(session.user.id)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadRole(session.user.id)
      else setRole(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadRole = async (uid) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', uid).single()
    if (data) setRole(data.role)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand">🍱 Tiffin Connect</Link>
      <div className="nav-links">
        <Link href="/browse">Browse Tiffins</Link>
        {role === 'provider' && <Link href="/provider">My Kitchen</Link>}
        {role === 'customer' && <Link href="/customer">My Orders</Link>}
      </div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.user_metadata?.avatar_url
            ? <img src={user.user_metadata.avatar_url} alt="" className="nav-avatar" />
            : <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--clay-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--clay)' }}>{user.email?.[0]?.toUpperCase()}</div>}
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      ) : (
        <Link href="/login" className="btn btn-clay btn-sm">Join Free</Link>
      )}
    </nav>
  )
}
