'use client'

import Link from 'next/link'

const S: React.CSSProperties = {
  fontFamily: 'var(--font-syne), sans-serif',
  fontSize: 9, fontWeight: 700,
  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
  color: '#E07820', marginBottom: 4,
}

export default function AdminDashboardClient({
  projectCount, messageCount, unreadCount, testimonialCount,
}: {
  projectCount: number; messageCount: number; unreadCount: number; testimonialCount: number
}) {
  const cards = [
    { label: 'Toplam Proje', value: projectCount, href: '/studio/projeler', color: '#E07820' },
    { label: 'Referans', value: testimonialCount, href: '/studio/testimonials', color: '#E07820' },
    { label: 'Toplam Mesaj', value: messageCount, href: '/studio/mesajlar', color: '#EBEBEB' },
    { label: 'Okunmamış', value: unreadCount, href: '/studio/mesajlar', color: '#ff5555' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <p style={S}>Genel Bakış</p>
        <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 44, color: '#EBEBEB', letterSpacing: '0.04em' }}>
          DASHBOARD
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 48 }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--dark-2)', border: '1px solid var(--border-subtle)',
              padding: '24px 20px', transition: 'border-color 0.25s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(224,120,32,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 48, color: c.color, lineHeight: 1, marginBottom: 6 }}>{c.value}</p>
              <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Hızlı İşlemler</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/studio/projeler/yeni" className="btn-gold" style={{ fontSize: 10, padding: '10px 22px' }}>+ Yeni Proje</Link>
          <Link href="/studio/testimonials" className="btn-dark" style={{ fontSize: 10, padding: '10px 22px' }}>Referanslar</Link>
          <Link href="/studio/mesajlar" className="btn-dark" style={{ fontSize: 10, padding: '10px 22px' }}>Mesajlar</Link>
          <Link href="/studio/ayarlar" className="btn-dark" style={{ fontSize: 10, padding: '10px 22px' }}>Ayarlar</Link>
          <Link href="/" target="_blank" className="btn-dark" style={{ fontSize: 10, padding: '10px 22px' }}>Siteyi Gör ↗</Link>
        </div>
      </div>
    </div>
  )
}
