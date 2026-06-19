'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = {
  num: string
  label: string
  body: string
  video?: string
  image?: string
}

// ── Defaults ───────────────────────────────────────────────────────────────
const DEFAULTS: Tab[] = [
  {
    num: '01',
    label: 'NEDEN?',
    body: 'Yapı kalitesi tartışılmaz. Biz bunu standart kabul ediyoruz. Her projede müşterimizin güvenini kazanmak için işe mükemmeliyetten başlıyoruz. Koşulsuz kalite, bizim için bir vaat değil bir temel.',
  },
  {
    num: '02',
    label: 'YAKLAŞIM',
    body: 'Her proje özgün. Arsamı, programı, yaşam biçimini dinliyoruz. Tek tip çözümler değil, size özel bir strateji geliştiriyoruz. Dinlemek, anlamak ve birlikte tasarlamak sürecin ilk adımı.',
  },
  {
    num: '03',
    label: 'SÜREÇ',
    body: 'Projelendirmeden teslimata tek elden. Sürpriz yok, gecikme yok. Sürecin her adımında sizi bilgilendiriyor, şeffaf bir ortaklık kuruyoruz. Zamanında teslim, bizim için söz değil kural.',
  },
  {
    num: '04',
    label: 'TASARIM',
    body: 'Modern mimari. Kalıcı malzeme. Uzun ömürlü yatırım. Estetik ile fonksiyonelliği bir arada sunan mekanlar tasarlıyoruz. Bugünün trendi değil, yarının klasiği olan yapılar.',
  },
]

// ── Media helper ───────────────────────────────────────────────────────────
function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm)$/i.test(url) || url.includes('/video/upload/')
}

// ── Reveal ─────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(36px)'
    el.style.transition = `opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.disconnect() }
    }, { threshold: 0.06 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <div ref={ref}>{children}</div>
}

// ── Main component ─────────────────────────────────────────────────────────
export default function HakkimizdaClient({ settings }: { settings: Record<string, string> }) {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  const pageTitle = settings.about_page_title || 'İNŞA ET\n+ TESLİM ET'

  const tabs: Tab[] = DEFAULTS.map((d, i) => ({
    num: d.num,
    label: settings[`about_tab_${i + 1}_label`] || d.label,
    body:  settings[`about_tab_${i + 1}_body`]  || d.body,
    video: settings[`about_tab_${i + 1}_video`] || '',
    image: settings[`about_tab_${i + 1}_image`] || '',
  }))

  const changeTab = (idx: number) => {
    if (idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 280)
  }

  const cur = tabs[active]
  const hasMedia = !!(cur.video || cur.image)

  return (
    <main style={{ background: 'var(--dark)' }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '100px 56px 64px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(224,120,32,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(224,120,32,0.018) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* Ghost word */}
        <div style={{
          position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(100px, 18vw, 280px)',
          color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.02)',
          userSelect: 'none', whiteSpace: 'nowrap', letterSpacing: '-4px',
        }}>BRION YAPI</div>

        {/* Neon glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '55%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,120,32,0.04) 0%, transparent 70%)',
          pointerEvents: 'none', transform: 'translate(-50%, -50%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="animate-fade-in" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#E07820', marginBottom: 36,
          }}>
            <span style={{ width: 24, height: 1, background: '#E07820', display: 'inline-block' }} />
            Biz Kimiz
          </div>

          <h1 className="animate-fade-up" style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(72px, 13vw, 200px)',
            lineHeight: 0.86, letterSpacing: '-3px',
            color: '#EBEBEB', margin: 0,
          }}>
            {pageTitle.split('\n').map((line, i, arr) => (
              <span key={i} style={{ display: 'block' }}>
                {line.startsWith('+')
                  ? <><em style={{ fontStyle: 'normal', color: '#E07820' }}>{line}</em></>
                  : line}
              </span>
            ))}
          </h1>

          <div className="animate-fade-in delay-400" style={{
            marginTop: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28,
          }}>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: 14,
              color: 'rgba(255,255,255,0.3)', maxWidth: 380, lineHeight: 1.75,
            }}>
              {settings.about_page_subtitle || 'Tasarımdan teslimata kadar her adımı sahiplenen bir inşaat şirketi.'}
            </p>
            <div style={{
              fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)',
              writingMode: 'vertical-rl',
            }}>Scroll ↓</div>
          </div>
        </div>
      </section>

      {/* ── ACCORDION ─────────────────────────────────────────────────── */}
      <section style={{
        display: 'flex', minHeight: '100vh',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>

        {/* Left — tab list */}
        <div style={{
          width: '38%', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
        }}>
          {tabs.map((tab, i) => {
            const isActive = active === i
            return (
              <button
                key={i}
                onClick={() => changeTab(i)}
                style={{
                  all: 'unset', cursor: 'pointer', display: 'block',
                  padding: isActive ? '40px 48px 44px' : '32px 48px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: isActive ? 'rgba(224,120,32,0.025)' : 'transparent',
                  borderLeft: isActive ? '2px solid #E07820' : '2px solid transparent',
                  transition: 'background 0.3s, padding 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                  textAlign: 'left', width: '100%',
                }}
              >
                {/* Number + Label row */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                  <span style={{
                    fontFamily: 'var(--font-bebas), sans-serif',
                    fontSize: isActive ? 42 : 20,
                    color: isActive ? '#E07820' : 'rgba(255,255,255,0.15)',
                    lineHeight: 1, letterSpacing: '0.04em',
                    transition: 'font-size 0.35s cubic-bezier(0.25,0.46,0.45,0.94), color 0.3s',
                    minWidth: isActive ? 60 : 36,
                  }}>{tab.num}</span>
                  <span style={{
                    fontFamily: 'var(--font-bebas), sans-serif',
                    fontSize: isActive ? 32 : 16,
                    letterSpacing: '0.06em',
                    color: isActive ? '#EBEBEB' : 'rgba(255,255,255,0.25)',
                    lineHeight: 1,
                    transition: 'font-size 0.35s cubic-bezier(0.25,0.46,0.45,0.94), color 0.3s',
                  }}>{tab.label}</span>
                </div>

                {/* Body — only shown when active */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isActive ? 300 : 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: 14, lineHeight: 1.85,
                    color: 'rgba(255,255,255,0.4)',
                    paddingTop: 20, paddingLeft: 62,
                    maxWidth: 340,
                  }}>{tab.body}</p>
                  <div style={{ paddingLeft: 62, paddingTop: 28 }}>
                    <Link href="/iletisim" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: '#E07820',
                      textDecoration: 'none',
                    }}>
                      <span style={{ width: 20, height: 1, background: '#E07820', display: 'inline-block' }} />
                      Projenizi Konuşalım
                    </Link>
                  </div>
                </div>
              </button>
            )
          })}

          {/* Progress indicator */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', padding: '32px 48px' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {tabs.map((_, i) => (
                <div key={i} style={{
                  width: i === active ? 24 : 6, height: 1,
                  background: i === active ? '#E07820' : 'rgba(255,255,255,0.15)',
                  transition: 'width 0.4s ease, background 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — media + text */}
        <div style={{ flex: 1, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.28s ease',
          }}>

            {/* Media */}
            {hasMedia ? (
              cur.video ? (
                <video
                  key={cur.video}
                  src={cur.video}
                  autoPlay muted loop playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
                />
              ) : (
                <img
                  key={cur.image}
                  src={cur.image}
                  alt={cur.label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
                />
              )
            ) : (
              /* Elegant placeholder — no broken image */
              <>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: 'clamp(80px, 14vw, 220px)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(224,120,32,0.06)',
                  userSelect: 'none', whiteSpace: 'nowrap', letterSpacing: '-4px',
                  lineHeight: 1,
                }}>{cur.label}</div>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400, height: 400, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(224,120,32,0.05) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                {/* Play icon hint — suggests video goes here */}
                <div style={{
                  position: 'absolute', bottom: 40, right: 40,
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.2 }}>
                    <circle cx="16" cy="16" r="15" stroke="#E07820" strokeWidth="1" />
                    <path d="M13 10.5l9 5.5-9 5.5V10.5z" fill="#E07820" />
                  </svg>
                  Video Ekle
                </div>
              </>
            )}

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(8,8,8,0.5) 0%, transparent 50%), linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 55%)',
            }} />

            {/* Tab number overlay — top left */}
            <div style={{
              position: 'absolute', top: 40, left: 48, zIndex: 2,
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 'clamp(100px, 12vw, 180px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.07)',
              lineHeight: 1, userSelect: 'none',
            }}>{cur.num}</div>

            {/* Tab label — bottom left */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '0 48px 48px', zIndex: 2,
            }}>
              <p style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: '#E07820',
                marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 20, height: 1, background: '#E07820', display: 'inline-block' }} />
                {cur.num} / 04
              </p>
              <h2 style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(36px, 5vw, 72px)',
                color: '#EBEBEB', lineHeight: 0.92, letterSpacing: '-1px',
              }}>{cur.label}</h2>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '120px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 40,
        background: 'var(--dark-2)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '55%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,120,32,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Reveal>
          <p style={{
            fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#E07820', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ width: 24, height: 1, background: '#E07820', display: 'inline-block' }} />
            Birlikte Çalışalım
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(52px, 8vw, 110px)',
            lineHeight: 0.9, letterSpacing: '-2px', color: '#EBEBEB',
          }}>
            PROJENİZİ<br />
            <em style={{ fontStyle: 'normal', color: '#E07820' }}>ANLATIN.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Link href="/iletisim" className="btn-neon">
              İletişime Geç
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/projeler" className="btn-outline">Projelerimizi İncele</Link>
          </div>
        </Reveal>
      </section>

    </main>
  )
}
