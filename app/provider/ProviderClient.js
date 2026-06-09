'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import './provider.css'

const EMOJIS = ['🍱','🍛','🥘','🍲','🫕','🥗','🍜','🫙','🧆','🍚']
const EMPTY = { title:'', description:'', price_per_day:'', diet_type:'veg', city:'', area:'', cuisine:'', delivery_type:'home', menu_items:'', cover_emoji:'🍱', active:true }

export default function ProviderClient() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tiffins, setTiffins] = useState([])
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'provider') { router.push('/'); return }
      setUser(session.user)
      loadData(session.user.id)
    })
  }, [])

  const loadData = async uid => {
    const [{ data: t }, { data: o }] = await Promise.all([
      supabase.from('tiffins').select('*').eq('provider_id', uid).order('created_at', { ascending: false }),
      supabase.from('orders').select('*').eq('provider_id', uid).order('created_at', { ascending: false }),
    ])
    setTiffins(t || []); setOrders(o || []); setLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('tiffins').insert({ ...form, price_per_day: Number(form.price_per_day), provider_id: user.id, total_orders: 0 })
    setSaving(false)
    if (error) showToast('Error: ' + error.message)
    else { showToast('Tiffin listed successfully!'); setShowForm(false); setForm(EMPTY); loadData(user.id) }
  }

  const toggleActive = async t => {
    await supabase.from('tiffins').update({ active: !t.active }).eq('id', t.id)
    loadData(user.id)
  }

  const deleteTiffin = async id => {
    if (!confirm('Delete this listing?')) return
    await supabase.from('tiffins').delete().eq('id', id)
    showToast('Deleted'); loadData(user.id)
  }

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const totalEarned = orders.filter(o => o.status === 'active').reduce((s, o) => s + (o.total_amount || 0), 0)

  return (
    <main className="page">
      <div className="container">
        <div className="dash-head">
          <div>
            <h1>My Kitchen 👩‍🍳</h1>
            <p>Manage your tiffin listings and track orders</p>
          </div>
          <button className="btn btn-clay" onClick={() => setShowForm(true)}>+ Add Tiffin</button>
        </div>

        <div className="stat-row">
          {[
            { e: '📦', v: tiffins.length, l: 'Listings' },
            { e: '🛒', v: orders.length, l: 'Total Orders' },
            { e: '✅', v: orders.filter(o => o.status === 'active').length, l: 'Active Subscribers' },
            { e: '💰', v: `₹${totalEarned.toLocaleString()}`, l: 'Total Earned' },
          ].map(s => (
            <div key={s.l} className="stat card">
              <span>{s.e}</span><b>{s.v}</b><label>{s.l}</label>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="modal-bg" onClick={() => setShowForm(false)}>
            <div className="modal card" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h2>List Your Tiffin</h2>
                <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--ink-60)' }} onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Pick an emoji</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {EMOJIS.map(e => (
                      <button type="button" key={e} onClick={() => setForm(p => ({ ...p, cover_emoji: e }))}
                        style={{ fontSize: '1.5rem', width: 44, height: 44, border: `2px solid ${form.cover_emoji === e ? 'var(--clay)' : 'var(--border)'}`, borderRadius: 10, background: form.cover_emoji === e ? 'var(--clay-l)' : 'var(--cream)', cursor: 'pointer' }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-2col">
                  <div className="form-group"><label>Tiffin Name *</label><input required placeholder="Maa Ki Dal Thali" value={form.title} onChange={f('title')} /></div>
                  <div className="form-group"><label>Diet Type *</label>
                    <select value={form.diet_type} onChange={f('diet_type')}>
                      <option value="veg">🟢 Vegetarian</option>
                      <option value="nonveg">🔴 Non-Vegetarian</option>
                      <option value="jain">🟡 Jain</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Description *</label><textarea required rows={3} placeholder="What is in the tiffin? Who is it for?" value={form.description} onChange={f('description')} /></div>
                <div className="form-2col">
                  <div className="form-group"><label>Price Per Day (₹) *</label><input required type="number" min={30} max={1000} placeholder="120" value={form.price_per_day} onChange={f('price_per_day')} /></div>
                  <div className="form-group"><label>Cuisine Style</label><input placeholder="North Indian, Gujarati..." value={form.cuisine} onChange={f('cuisine')} /></div>
                </div>
                <div className="form-2col">
                  <div className="form-group"><label>City *</label><input required placeholder="Delhi" value={form.city} onChange={f('city')} /></div>
                  <div className="form-group"><label>Area / Locality</label><input placeholder="Lajpat Nagar..." value={form.area} onChange={f('area')} /></div>
                </div>
                <div className="form-group"><label>Menu Items (comma separated)</label><input placeholder="Dal, Sabzi, Roti, Rice, Salad" value={form.menu_items} onChange={f('menu_items')} /></div>
                <div className="form-group"><label>Delivery Type</label>
                  <select value={form.delivery_type} onChange={f('delivery_type')}>
                    <option value="home">🚚 Home Delivery</option>
                    <option value="pickup">🏠 Pickup Only</option>
                    <option value="both">✅ Both</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-clay" disabled={saving}>{saving ? 'Publishing...' : 'Publish Tiffin 🚀'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 style={{ margin: '2rem 0 1rem' }}>My Listings</h2>
        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : tiffins.length === 0 ? (
          <div className="empty"><div className="empty-icon">🍱</div><h3>No listings yet</h3><p>Add your first tiffin to start getting orders!</p></div>
        ) : (
          <div className="listing-grid">
            {tiffins.map(t => (
              <div key={t.id} className={`listing card ${!t.active ? 'dim' : ''}`}>
                <div className="listing-em">{t.cover_emoji || '🍱'}</div>
                <div className="listing-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    <b style={{ fontSize: 14 }}>{t.title}</b>
                    <span className={`tag tag-${t.diet_type}`}>{t.diet_type}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-60)', margin: '4px 0' }}>📍 {t.area ? `${t.area}, ` : ''}{t.city}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clay)', fontFamily: 'Fraunces,serif', marginBottom: 10 }}>₹{t.price_per_day}/day</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn btn-sm ${t.active ? 'btn-ghost' : 'btn-leaf'}`} onClick={() => toggleActive(t)}>{t.active ? '⏸ Pause' : '▶ Activate'}</button>
                    <button className="btn btn-sm btn-ghost" style={{ color: '#B91C1C', borderColor: '#FECACA' }} onClick={() => deleteTiffin(t.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ margin: '2.5rem 0 1rem' }}>Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="empty"><div className="empty-icon">🛒</div><p>No orders yet. Share your tiffin link to get customers!</p></div>
        ) : (
          <div className="orders-table card">
            <table>
              <thead><tr><th>Tiffin</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 15).map(o => (
                  <tr key={o.id}>
                    <td>{o.tiffin_title}</td>
                    <td>{o.plan}</td>
                    <td style={{ fontWeight: 700, color: 'var(--clay)' }}>₹{o.total_amount}</td>
                    <td><span className={`tag tag-${o.status === 'active' ? 'veg' : o.status === 'pending_payment' ? 'jain' : 'nonveg'}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}
