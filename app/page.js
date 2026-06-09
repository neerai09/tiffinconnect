import Link from 'next/link'
import Navbar from '@/components/Navbar'
import './home.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-text">
              <div className="hero-pill">🇮🇳 Connecting India's Home Kitchens</div>
              <h1>Real home food.<br /><em>Real home chefs.</em><br />Your door.</h1>
              <p>Subscribe to fresh, hygienic daily tiffins from verified home chefs in your neighbourhood. No restaurants. No compromises.</p>
              <div className="hero-btns">
                <Link href="/browse" className="btn btn-clay">Find Tiffin Near Me →</Link>
                <Link href="/login?role=provider" className="btn btn-outline">Start Selling Tiffins</Link>
              </div>
              <div className="hero-stats">
                <div><b>500+</b><span>Home Chefs</span></div>
                <div className="divider" />
                <div><b>₹80–₹150</b><span>Per meal avg.</span></div>
                <div className="divider" />
                <div><b>20+ Cities</b><span>Across India</span></div>
              </div>
            </div>
            <div className="hero-img">
              <div className="tiffin-box">
                <span>🍱</span>
                <small>Fresh Today</small>
              </div>
              <div className="fc fc1">🌿 Veg Thali<br /><small>North Indian</small></div>
              <div className="fc fc2">⭐ 4.9 Rating<br /><small>1.2k reviews</small></div>
              <div className="fc fc3">🚚 Home Delivery<br /><small>By 12:30 PM</small></div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section bg-white">
          <div className="container">
            <p className="label">Simple Process</p>
            <h2>Three steps to home food</h2>
            <div className="steps">
              {[
                { n: '01', e: '🔍', t: 'Browse Chefs', d: 'Search by city, diet (Veg/Non-Veg/Jain), cuisine and budget.' },
                { n: '02', e: '📋', t: 'Pick a Plan', d: 'Choose Weekly, Monthly or Quarterly. Better plans get bigger discounts.' },
                { n: '03', e: '🍽️', t: 'Enjoy Daily', d: 'Fresh meals at your door every day. Pause or cancel anytime.' },
              ].map(s => (
                <div key={s.n} className="step card">
                  <span className="step-n">{s.n}</span>
                  <div className="step-e">{s.e}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EARN */}
        <section className="earn-section">
          <div className="container earn-inner">
            <div>
              <p className="label" style={{ color: '#8BE0B2' }}>For Home Chefs</p>
              <h2>Cook at home.<br />Earn ₹15K–₹40K/month.</h2>
              <p>No restaurant license needed. List your tiffin free, set your own price and get paid to your UPI directly.</p>
              <ul>
                {['Free to list — no upfront cost', 'Set your own price and delivery area', 'We take only 8% per order', 'Weekly payouts to your UPI'].map(i => (
                  <li key={i}><span className="check">✓</span>{i}</li>
                ))}
              </ul>
              <Link href="/login?role=provider" className="btn btn-leaf" style={{ marginTop: '1.5rem' }}>Start Earning Free →</Link>
            </div>
            <div className="earn-stats">
              {[{ v: '₹0', l: 'To get started' }, { v: '8%', l: 'Our commission' }, { v: '100%', l: 'Earnings to you' }].map(s => (
                <div key={s.l} className="earn-stat">
                  <b>{s.v}</b><span>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CUISINES */}
        <section className="section">
          <div className="container">
            <p className="label">Browse by Style</p>
            <h2>Every cuisine, every diet</h2>
            <div className="cuisines">
              {[
                { e: '🫓', n: 'North Indian', s: 'Dal, Roti, Sabzi, Rice' },
                { e: '🍛', n: 'South Indian', s: 'Sambar, Rasam, Dosa' },
                { e: '🥗', n: 'Gujarati', s: 'Thepla, Kadhi, Khichdi' },
                { e: '🧆', n: 'Punjabi', s: 'Butter Chicken, Lassi' },
                { e: '🐟', n: 'Bengali', s: 'Macher Jhol, Mishti Doi' },
                { e: '🫙', n: 'Maharashtrian', s: 'Puran Poli, Misal' },
              ].map(c => (
                <Link href="/browse" key={c.n} className="cuisine card">
                  <span>{c.e}</span><b>{c.n}</b><small>{c.s}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>Ready for home food every day?</h2>
            <p>Join thousands of customers and home chefs on Tiffin Connect.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link href="/browse" className="btn btn-clay">Browse Tiffins</Link>
              <Link href="/login?role=provider" className="btn btn-ghost">Become a Chef</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-inner">
            <div>
              <div style={{ fontFamily: 'Fraunces,serif', fontSize: '1.2rem', fontWeight: 900, color: 'var(--clay)', marginBottom: 8 }}>🍱 Tiffin Connect</div>
              <p>Fresh home food, zero restaurant markup.<br />Made with ❤️ in India.</p>
            </div>
            <div className="flinks"><b>Platform</b><Link href="/browse">Browse Tiffins</Link><Link href="/login?role=provider">Become a Chef</Link></div>
            <div className="flinks"><b>Contact</b><a href="mailto:hello@tiffinconnect.in">hello@tiffinconnect.in</a></div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,.3)', paddingTop: '1.5rem' }}>© 2025 Tiffin Connect · Powered by Vercel + Supabase (Free)</p>
        </footer>
      </main>
    </>
  )
}
