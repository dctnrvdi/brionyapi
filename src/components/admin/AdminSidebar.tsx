'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  {
    href: '/studio',
    label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /></svg>,
  },
  {
    href: '/studio/projeler',
    label: 'Projeler',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13V5l6-3 6 3v8H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M5 13V9h6v4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  },
  {
    href: '/studio/testimonials',
    label: 'Referanslar',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 1.9.7-4L2.2 5.2l4-.6L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  },
  {
    href: '/studio/mesajlar',
    label: 'Mesajlar',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.2" /></svg>,
  },
  {
    href: '/studio/ayarlar',
    label: 'Site Ayarları',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" /><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 240,
      background: 'var(--dark-2)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <p style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 20, letterSpacing: '0.1em',
          color: '#EBEBEB', marginBottom: 2,
        }}>BRION YAPI</p>
        <p style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 8, fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#E07820',
        }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const isActive = item.href === '/studio'
              ? pathname === '/studio'
              : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: isActive ? 'rgba(224,120,32,0.07)' : 'transparent',
                border: isActive ? '1px solid rgba(224,120,32,0.15)' : '1px solid transparent',
                color: isActive ? '#E07820' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.06em',
                transition: 'all 0.2s ease',
                borderRadius: 1,
              }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#EBEBEB' } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' } }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 14px',
          color: 'var(--text-muted)', textDecoration: 'none',
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          marginBottom: 2, transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#EBEBEB')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2v10h3M10 4l3 3-3 3M5 7h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Siteye Dön
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/studio/login' })} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 14px',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          transition: 'color 0.2s', textAlign: 'left',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2h3v10H9M6 4L3 7l3 3M11 7H3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
