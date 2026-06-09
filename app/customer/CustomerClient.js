'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function CustomerClient() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'customer') { router.push('/'); return }
      const { data } = await supabase.from('orders').select('*').eq('customer_id', session.user.id).order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    })
  }, [])

  const cancel = async id => {
    if (!confirm('Cancel this subscription?')) return
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id)
    setOrders(o => o.map(x => x.id === id ? { ...x, status: 'cancelled' } : x))
    setToast('Order cancelled')
    setTimeout(() => setToast(''), 3000)
  }

  const active = orders.filter(o => ['active', 'pending_payment'].includes(o.status))
  const past = orders.filter(o => ['cancelled', 'completed'].includes(o.status))

  const statusStyle = { active: 'tag-veg', pending_payment: 'tag-jain', cancelled: 'tag-nonveg', completed: 'tag-veg' }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 780 }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>My Orders 🍽️</h1>
        <p style={{ color: 'var(--ink-60)', marginBottom: '2rem' }}>Your active tiffin subscriptions</p>

        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
          <>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active ({active.length})</h2>
            {active.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🍱</div>
                <h3>No active orders</h3>
                <p>Find a tiffin you love and subscribe!</p>
                <Link href="/browse" className="btn btn-clay" style={{ marginTop: 16 }}>Browse Tiffins →</Link>
              </div>
            ) : active.map(o => (
              <div key={o.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <div>
                  <b style={{ fontSize: 15 }}>{o.tiffin_title}</b>
                  <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 4 }}>{o.plan} plan · {o.days} days · {new Date(o.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <b style={{ fontFamily: 'Fraunces,serif', fontSize: '1.3rem', color: 'var(--clay)' }}>₹{o.total_amount}</b>
                  <span className={`tag ${statusStyle[o.status] || 'tag-jain'}`}>{o.status}</span>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#B91C1C', borderColor: '#FECACA' }} onClick={() => cancel(o.id)}>Cancel</button>
                </div>
              </div>
            ))}

            {past.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem' }}>Past Orders</h2>
                {past.map(o => (
                  <div key={o.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: .65, marginBottom: 8 }}>
                    <div><b>{o.tiffin_title}</b><p style={{ fontSize: 13, color: 'var(--ink-60)' }}>{o.plan} · ₹{o.total_amount}</p></div>
                    <span className={`tag ${statusStyle[o.status] || 'tag-nonveg'}`}>{o.status}</span>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}
