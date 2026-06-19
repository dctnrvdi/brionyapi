'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [s, setS] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/ayarlar').then(r => r.json()).then(setS).catch(() => {})
  }, [])

  const phone     = s.footer_phone     || '+90 537 054 19 88'
  const email     = s.footer_email     || 'info@brionyapi.com'
  const address   = s.footer_address   || 'İzmir, Türkiye'
  const tagline   = s.footer_tagline   || 'Mühendislik · Güven · Kalıcılık'
  const instagram = s.social_instagram || ''
  const linkedin  = s.social_linkedin  || ''
  const twitter   = s.social_x        || ''

  return (
    <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border-subtle)' }}>

      <div style={{ padding: '80px 0 40px' }}>
        <div className="container-site">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 56, marginBottom: 56,
          }}>

            {/* Marka */}
            <div>
              <p style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 26, letterSpacing: '0.12em',
                color: '#EBEBEB', marginBottom: 12,
              }}>BRION YAPI</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 240 }}>
                Güçlü temeller, kalıcı yapılar. Mühendislik mükemmelliğiyle inşa ediyoruz.
              </p>
              {(instagram || linkedin || twitter) && (
                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  {[
                    { href: instagram, label: 'IG' },
                    { href: linkedin,  label: 'IN' },
                    { href: twitter,   label: 'X'  },
                  ].filter(s => s.href).map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                      width: 32, height: 32,
                      border: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                      color: 'var(--text-muted)', fontSize: 10,
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontWeight: 700, letterSpacing: '0.05em',
                      transition: 'border-color 0.25s, color 0.25s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E07820'; (e.currentTarget as HTMLElement).style.color = '#E07820' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                    >{s.label}</a>
                  ))}
                </div>
              )}
            </div>

            {/* Sayfalar */}
            <div>
              <p style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#E07820', marginBottom: 20,
              }}>Sayfalar</p>
              {[
                { href: '/hakkimizda', label: 'Hakkımızda' },
                { href: '/projeler', label: 'Projeler' },
                { href: '/iletisim', label: 'İletişim' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{
                  display: 'block', fontSize: 13,
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  marginBottom: 12, transition: 'color 0.25s ease',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E07820')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{l.label}</Link>
              ))}
            </div>

            {/* İletişim */}
            <div>
              <p style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#E07820', marginBottom: 20,
              }}>İletişim</p>
              {[phone, email, address].map(item => (
                <p key={item} style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  marginBottom: 12,
                  fontFamily: 'var(--font-inter), sans-serif',
                }}>{item}</p>
              ))}
            </div>
          </div>

          {/* Alt çizgi */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)', paddingTop: 28,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-syne), sans-serif', letterSpacing: '0.05em' }}>
              © {new Date().getFullYear()} Brion Yapı. Tüm hakları saklıdır.
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-syne), sans-serif', letterSpacing: '0.08em' }}>
              {tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Marquee band */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#060606', overflow: 'hidden' }}>
        <style>{`
          .brion-marquee { display: flex; width: max-content; animation: marqueeSlide 22s linear infinite; }
          .brion-marquee:hover { animation-play-state: paused; }
        `}</style>
        <div className="brion-marquee">
          {[...Array(2)].map((_, c) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <a
                    href="https://cutpastecut.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '18px 0', textDecoration: 'none', flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 8, fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}>
                      Designed &amp; Developed by
                    </span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '0.3em', color: 'rgba(224,120,32,0.35)', whiteSpace: 'nowrap' }}>
                      CUTPASTECUT®
                    </span>
                  </a>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(224,120,32,0.2)', margin: '0 28px', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </footer>
  )
}
