'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/projeler', label: 'Projeler' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>(undefined)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    const onResize = () => setMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    fetch('/api/ayarlar')
      .then(r => r.json())
      .then(d => setLogoUrl(d.logo_url || null))
      .catch(() => setLogoUrl(null))
  }, [])

  return (
    <>
      <nav
        className="navbar-safe"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          paddingBottom: scrolled ? 14 : 24,
          paddingLeft: mobile ? 20 : 48,
          paddingRight: mobile ? 20 : 48,
          background: scrolled
            ? 'rgba(8,8,8,0.94)'
            : mobile ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minWidth: 80, minHeight: 28 }}>
          {logoUrl === undefined ? (
            <span style={{ display: 'block', width: 80, height: 28 }} />
          ) : logoUrl ? (
            <img src={logoUrl} alt="Brion Yapı" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
          ) : (
            <span style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 22, letterSpacing: '0.12em',
              color: '#EBEBEB',
            }}>BRION YAPI</span>
          )}
        </Link>

        {/* Desktop nav */}
        {!mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} className="hover-line" style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: pathname === l.href ? '#E07820' : '#888',
                textDecoration: 'none', transition: 'color 0.25s ease',
              }}>
                {l.label}
              </Link>
            ))}
            <Link href="/iletisim" className="btn-neon" style={{ padding: '10px 24px', fontSize: 10 }}>
              Teklif Al
            </Link>
          </div>
        )}

        {/* Hamburger */}
        {mobile && (
          <button
            onClick={() => setOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            aria-label="Menü"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 24, height: 1, marginBottom: i < 2 ? 6 : 0,
                background: open ? '#E07820' : '#888',
                transition: 'all 0.3s ease',
                transform: open
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : i === 1 ? 'scaleX(0)'
                    : 'rotate(-45deg) translate(5px, -5px)'
                  : 'none',
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {mobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(8,8,8,0.98)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 42, letterSpacing: '0.1em',
              color: pathname === l.href ? '#E07820' : '#EBEBEB',
              textDecoration: 'none',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s ease ${i * 0.07}s`,
            }}>
              {l.label.toUpperCase()}
            </Link>
          ))}
          <Link href="/iletisim" className="btn-neon" style={{ marginTop: 16 }}>
            Teklif Al
          </Link>
        </div>
      )}
    </>
  )
}
