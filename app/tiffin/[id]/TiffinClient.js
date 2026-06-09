'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import './detail.css'

const PLANS = [
  { id: 'weekly', label: 'Weekly', days: 7, discount: 0 },
  { id: 'monthly', label: 'Monthly', days: 30, discount: 10 },
  { id: 'quarterly', label: '3 Months', days: 90, discount: 15 },
]

export default function TiffinClient() {
  const { id } = useParams()
  const router = useRouter()
  const [tiffin, setTiffin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('monthly')
  const [booking, setBooking] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('tiffins').select('*, profiles(name,avatar,email)').eq('id', id).single()
      .then(({ data }) => { setTiffin(data); setLoading(false) })
  }, [id])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 5000) }

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role !== 'customer') { showToast('Only customers can place orders'); return }
    const selected = PLANS.find(p => p.id === plan)
    const total = Math.round(tiffin.price_per_day * selected.days * (1 - selected.discount / 100))
    setBooking(true)
    const { error } = await supabase.from('orders').insert({
      customer_id: session.user.id, provider_id: tiffin.provider_id,
      tiffin_id: tiffin.id, tiffin_title: tiffin.title,
      plan: selected.label, days: selected.days,
      price_per_day: tiffin.price_per_day, total_amount: total,
      platform_fee: Math.round(total * 0.08), status: 'pending_payment',
    })
    setBooking(false)
    if (error) showToast('Error placing order. Try again.')
    else showToast(`Order placed! Chef (${tiffin.profiles?.email}) will contact you for payment.`)
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!tiffin) return <div className="container" style={{ padding: '4rem 0' }}><p>Tiffin not found.</p></div>

  const selected = PLANS.find(p => p.id === plan)
  const base = tiffin.price_per_day * selected.days
  const disc = Math.round(base * selected.discount / 100)
  const total = base - disc
  const items = tiffin.menu_items?.split(',').map(s => s.trim()).filter(Boolean) || []

  return (
    <main className="page">
      <div className="container detail-layout">
        <div>
          <div className="detail-cover">{tiffin.cover_emoji || '🍱'}</div>
          <div className="detail-info card">
            <div className="detail-title-row">
              <h1>{tiffin.title}</h1>
              <span className={`tag tag-${tiffin.diet_type}`}>{tiffin.diet_type?.toUpperCase()}</span>
            </div>
            <p className="detail-chef">
              {tiffin.profiles?.avatar && <img src={tiffin.profiles.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />}
              <b>{tiffin.profiles?.name}</b> · 📍 {tiffin.area ? `${tiffin.area}, ` : ''}{tiffin.city}
            </p>
            <p className="detail-desc">{tiffin.description}</p>
            {items.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>🍽️ What is included</p>
                <div className="chips">{items.map(m => <span key={m} className="chip">{m}</span>)}</div>
              </div>
            )}
            <div className="detail-badges">
              <span className="badge">{tiffin.delivery_type === 'home' ? '🚚 Home Delivery' : tiffin.delivery_type === 'pickup' ? '🏠 Pickup Only' : '✅ Delivery and Pickup'}</span>
              {tiffin.cuisine && <span className="badge">🍳 {tiffin.cuisine}</span>}
            </div>
          </div>
        </div>

        <div className="booking-col">
          <div className="booking card">
            <h2>Subscribe</h2>
            <div className="big-price"><b>₹{tiffin.price_per_day}</b><span>/day</span></div>
            <div className="plan-list">
              {PLANS.map(p => (
                <button key={p.id} className={`plan-opt ${plan === p.id ? 'active' : ''}`} onClick={() => setPlan(p.id)}>
                  <div><b>{p.label}</b><small>{p.days} days</small></div>
                  {p.discount > 0
                    ? <span className="save-tag">Save {p.discount}%</span>
                    : <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>₹{tiffin.price_per_day * p.days}</span>}
                </button>
              ))}
            </div>
            <div className="breakdown">
              <div className="brow"><span>₹{tiffin.price_per_day} × {selected.days} days</span><span>₹{base}</span></div>
              {disc > 0 && <div className="brow" style={{ color: 'var(--leaf)' }}><span>Discount ({selected.discount}%)</span><span>−₹{disc}</span></div>}
              <div className="brow" style={{ fontWeight: 700, fontSize: 15 }}><span>Total</span><span>₹{total}</span></div>
            </div>
            <button className="btn btn-clay" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={handleSubscribe} disabled={booking}>
              {booking ? 'Placing order...' : `Subscribe for ₹${total} →`}
            </button>
            <p className="booking-note">Chef will contact you to arrange payment via UPI and delivery.</p>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}
