'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import './browse.css'

export default function BrowseClient() {
  const [tiffins, setTiffins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [diet, setDiet] = useState('')
  const [maxPrice, setMaxPrice] = useState(300)
  const supabase = createClient()

  useEffect(() => { loadTiffins() }, [diet, city, maxPrice])

  const loadTiffins = async () => {
    setLoading(true)
    let q = supabase.from('tiffins').select('*, profiles(name,avatar)').eq('active', true).lte('price_per_day', maxPrice).order('created_at', { ascending: false })
    if (diet) q = q.eq('diet_type', diet)
    if (city) q = q.ilike('city', `%${city}%`)
    const { data } = await q
    setTiffins(data || [])
    setLoading(false)
  }

  const filtered = tiffins.filter(t =>
    !search ||
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.city?.toLowerCase().includes(search.toLowerCase()) ||
    t.profiles?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="page">
      <div className="container">
        <div className="browse-head">
          <h1>Find Your Tiffin</h1>
          <p>Fresh home-cooked meals from verified chefs near you</p>
        </div>

        <div className="filters card">
          <input className="search-inp" placeholder="🔍 Search by name, chef or city..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input placeholder="Delhi, Mumbai..." value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Diet type</label>
              <select value={diet} onChange={e => setDiet(e.target.value)}>
                <option value="">All types</option>
                <option value="veg">🟢 Vegetarian</option>
                <option value="nonveg">🔴 Non-Vegetarian</option>
                <option value="jain">🟡 Jain</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Max price/day: ₹{maxPrice}</label>
              <input type="range" min={50} max={500} step={10} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🍽️</div>
            <h3>No tiffins found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: '1rem' }}>{filtered.length} tiffin{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="tiffin-grid">
              {filtered.map(t => <TiffinCard key={t.id} t={t} />)}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function TiffinCard({ t }) {
  const bg = t.diet_type === 'nonveg' ? '#FFF0F0' : t.diet_type === 'jain' ? '#FFFBEA' : '#F0FAF4'
  return (
    <Link href={`/tiffin/${t.id}`} className="tcard card">
      <div className="tcard-cover" style={{ background: bg }}>{t.cover_emoji || '🍱'}</div>
      <div className="tcard-body">
        <div className="tcard-top">
          <h3>{t.title}</h3>
          <span className={`tag tag-${t.diet_type}`}>{t.diet_type}</span>
        </div>
        <p className="tcard-chef">👩‍🍳 {t.profiles?.name} · {t.city}</p>
        <p className="tcard-desc">{t.description?.substring(0, 80)}...</p>
        <div className="tcard-foot">
          <div><b style={{ fontSize: '1.2rem', color: 'var(--clay)', fontFamily: 'Fraunces,serif' }}>₹{t.price_per_day}</b><span style={{ fontSize: 12, color: 'var(--ink-60)' }}>/day</span></div>
          <span className="tcard-badge">{t.delivery_type === 'home' ? '🚚 Delivery' : t.delivery_type === 'pickup' ? '🏠 Pickup' : '✅ Both'}</span>
          {t.rating && <span style={{ fontSize: 12 }}>⭐ {t.rating}</span>}
        </div>
      </div>
    </Link>
  )
}
