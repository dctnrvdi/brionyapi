'use client'

import { useEffect, useState } from 'react'

type Phase = 'loading' | 'charge' | 'exit' | 'gone'

export default function Preloader() {
  const [count, setCount]   = useState(0)
  const [phase, setPhase]   = useState<Phase>('loading')

  useEffect(() => {
    let n = 0
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      // Variable speed: burst at start, steady middle, burst to 100
      const inc = n < 20 ? 3 : n < 80 ? 1 : 3
      n = Math.min(n + inc, 100)
      setCount(n)
      if (n >= 100) {
        clearTimeout(timer)
        setTimeout(() => setPhase('charge'), 80)
        setTimeout(() => setPhase('exit'),  360)
        setTimeout(() => setPhase('gone'),  1200)
        return
      }
      timer = setTimeout(step, n < 25 ? 10 : 20)
    }

    timer = setTimeout(step, 60)
    return () => clearTimeout(timer)
  }, [])

  if (phase === 'gone') return null

  const isCharge = phase === 'charge'
  const isExit   = phase === 'exit'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: isExit ? 'none' : 'all',
        // Exit: slide entire panel up
        transform: isExit ? 'translateY(-100%)' : 'translateY(0)',
        transition: isExit ? 'transform 0.82s cubic-bezier(0.85,0,0.15,1)' : 'none',
      }}
    >
      {/* ── BASE ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />

      {/* ── GRADIENT LAYER 1 — wide amber bloom top-right ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 75% 65% at 90% 5%, rgba(224,120,32,0.22) 0%, transparent 68%)',
        opacity: isCharge ? 1.6 : 1,
        transition: 'opacity 0.25s ease',
      }} />

      {/* ── GRADIENT LAYER 2 — deep amber bloom bottom-left ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 10% 100%, rgba(224,120,32,0.13) 0%, transparent 65%)',
        opacity: isCharge ? 1.8 : 1,
        transition: 'opacity 0.25s ease',
      }} />

      {/* ── GRADIENT LAYER 3 — center pulse on charge ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(224,120,32,0.10) 0%, transparent 70%)',
        opacity: isCharge ? 1 : 0,
        transition: 'opacity 0.28s ease',
      }} />

      {/* ── DIAGONAL ACCENT LINES ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Main diagonal */}
        <div style={{
          position: 'absolute',
          top: '55%', left: '-30%',
          width: '160%', height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(224,120,32,0.12) 20%, rgba(224,120,32,0.3) 50%, rgba(224,120,32,0.12) 80%, transparent 100%)',
          transform: 'rotate(-14deg)',
        }} />
        {/* Secondary diagonal — offset */}
        <div style={{
          position: 'absolute',
          top: '62%', left: '-30%',
          width: '160%', height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(224,120,32,0.05) 25%, rgba(224,120,32,0.12) 50%, rgba(224,120,32,0.05) 75%, transparent 100%)',
          transform: 'rotate(-14deg)',
        }} />
      </div>

      {/* ── SUBTLE GRID ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* ── AMBER TRAILING LINE — appears at bottom edge on exit ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(224,120,32,0.3) 20%, #E07820 50%, rgba(224,120,32,0.3) 80%, transparent 100%)',
        opacity: isExit ? 1 : isCharge ? 0.6 : 0,
        transition: 'opacity 0.2s ease',
      }} />

      {/* ── CORNERS ── */}
      {/* Top-left corner bracket */}
      <div style={{ position: 'absolute', top: 28, left: 36 }}>
        <div style={{ width: 18, height: 1, background: 'rgba(224,120,32,0.35)' }} />
        <div style={{ width: 1, height: 18, background: 'rgba(224,120,32,0.35)', marginTop: -1 }} />
      </div>
      {/* Bottom-right corner bracket */}
      <div style={{ position: 'absolute', bottom: 28, right: 36 }}>
        <div style={{ width: 1, height: 18, background: 'rgba(224,120,32,0.35)', marginLeft: 'auto' }} />
        <div style={{ width: 18, height: 1, background: 'rgba(224,120,32,0.35)', marginLeft: 'auto' }} />
      </div>

      {/* ── CORNER LABELS ── */}
      <div style={{
        position: 'absolute', top: 36, left: 64,
        fontFamily: 'var(--font-syne), sans-serif',
        fontSize: 8, fontWeight: 700,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'rgba(224,120,32,0.45)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        Brion Yapı
      </div>
      <div style={{
        position: 'absolute', top: 36, right: 36,
        fontFamily: 'var(--font-syne), sans-serif',
        fontSize: 8, letterSpacing: '0.28em',
        color: 'rgba(255,255,255,0.1)',
      }}>EST. 2009</div>

      {/* ── GHOST BIG LETTER — behind content ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        fontFamily: 'var(--font-bebas), sans-serif',
        fontSize: 'clamp(180px, 35vw, 500px)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.022)',
        userSelect: 'none', pointerEvents: 'none',
        letterSpacing: '-6px', lineHeight: 0.85,
        whiteSpace: 'nowrap',
        zIndex: 0,
      }}>BRION</div>

      {/* ── CENTER CONTENT ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Company name — two-line split */}
        <div style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(72px, 14vw, 160px)',
          color: '#EBEBEB',
          letterSpacing: '0.18em',
          lineHeight: 0.88,
          textAlign: 'center',
        }}>BRION</div>

        <div style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(30px, 5.5vw, 60px)',
          color: '#E07820',
          letterSpacing: '0.65em',
          lineHeight: 1,
          textAlign: 'center',
          marginBottom: 28,
          // Charge: small brightness pop
          filter: isCharge ? 'brightness(1.3)' : 'brightness(1)',
          transition: 'filter 0.25s ease',
        }}>YAPI</div>

        {/* Divider line with amber glow */}
        <div style={{
          width: 'clamp(180px, 28vw, 320px)',
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          position: 'relative',
          marginBottom: 16,
          overflow: 'visible',
        }}>
          <div style={{
            position: 'absolute', inset: '0 auto 0 0',
            width: `${count}%`,
            background: 'linear-gradient(90deg, rgba(224,120,32,0.3) 0%, #E07820 100%)',
            boxShadow: '0 0 10px rgba(224,120,32,0.5)',
            transition: 'width 0.016s linear',
          }} />
        </div>

        {/* Counter */}
        <div style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(12px, 1.5vw, 16px)',
          letterSpacing: '0.25em',
          color: 'rgba(224,120,32,0.55)',
          marginBottom: 20,
        }}>{String(count).padStart(3, '0')}</div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 8, fontWeight: 700,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.15)',
        }}>MÜHENDİSLİK & İNŞAAT</div>

      </div>

      {/* ── BOTTOM STRIP ── */}
      <div style={{
        position: 'absolute', bottom: 28, left: 36, right: 36,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 7, letterSpacing: '0.2em', lineHeight: 2,
          color: 'rgba(255,255,255,0.07)', textTransform: 'uppercase',
        }}>Güven · Kalite<br />Mükemmellik</p>
        <p style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 7, letterSpacing: '0.2em', lineHeight: 2,
          color: 'rgba(255,255,255,0.07)', textTransform: 'uppercase',
          textAlign: 'right',
        }}>İstanbul<br />Türkiye</p>
      </div>

    </div>
  )
}
