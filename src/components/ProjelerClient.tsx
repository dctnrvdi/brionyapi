'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type Project = {
  id: number; title: string; slug: string; category: string
  location: string; year: number; area: string; coverImage: string
}

function Reveal({ children, delay = 0, fill = false }: { children: React.ReactNode; delay?: number; fill?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    el.style.transition = `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.disconnect() }
    }, { threshold: 0.06 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <div ref={ref} style={fill ? { height: '100%' } : undefined}>{children}</div>
}

// Repeating column-span pattern (no ratio — heights fixed by grid-auto-rows)
const SPANS = [
  'span 7',
  'span 5',
  'span 5',
  'span 7',
  'span 6',
  'span 6',
]

function isCoverVideo(url: string) {
  return /\.(mp4|mov|webm)$/i.test(url) || url.includes('/video/upload/')
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const col = SPANS[index % SPANS.length]
  const [hovered, setHovered] = useState(false)
  const isVid = project.coverImage ? isCoverVideo(project.coverImage) : false

  return (
    <div style={{ gridColumn: col, height: '100%' }}>
      <Reveal delay={(index % 2) * 0.08} fill>
        <Link href={`/projeler/${project.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
          <div
            style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#111', cursor: 'pointer' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Number */}
            <span style={{
              position: 'absolute', top: 20, right: 24, zIndex: 3,
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 11, letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.2)',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Media */}
            <div style={{
              position: 'absolute', inset: 0,
              transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}>
              {project.coverImage ? (
                isVid ? (
                  <video
                    src={project.coverImage}
                    autoPlay muted loop playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 100, color: 'rgba(224,120,32,0.04)' }}>
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(transparent 40%, rgba(8,8,8,0.94) 100%)',
              transition: 'opacity 0.4s ease',
              opacity: hovered ? 1 : 0.6,
            }} />

            {/* Neon top border on hover */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 4,
              background: 'linear-gradient(90deg, transparent, #E07820, transparent)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }} />

            {/* Info */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px', zIndex: 3,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.4s ease',
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#E07820', border: '1px solid rgba(224,120,32,0.35)', padding: '3px 7px',
                }}>{project.category}</span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(22px, 3vw, 38px)',
                color: '#EBEBEB', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 4,
              }}>{project.title.toUpperCase()}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {project.location} · {project.year}
              </p>
            </div>
          </div>
        </Link>
      </Reveal>
    </div>
  )
}

const cats = ['Tümü', 'Konut', 'Ticari', 'Karma', 'Altyapı']

export default function ProjelerClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('Tümü')
  const filtered = active === 'Tümü' ? projects : projects.filter(p => p.category === active)

  return (
    <main>
      {/* Header */}
      <section style={{ paddingTop: 160, paddingBottom: 56, background: 'var(--dark)' }}>
        <div className="container-site">
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: '#E07820' }} />
            <span style={{
              fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07820',
            }}>Portföy</span>
          </div>
          <h1 className="animate-fade-up" style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(52px, 9vw, 120px)',
            color: '#EBEBEB', lineHeight: 0.92, letterSpacing: '-1px',
          }}>TÜM<br />PROJELERİMİZ</h1>
        </div>
      </section>

      {/* Filter tabs */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'var(--dark)' }}>
        <div className="container-site">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {cats.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '18px 28px',
                background: 'none', border: 'none',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: active === cat ? '#E07820' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', transition: 'color 0.2s',
                borderBottom: active === cat ? '2px solid #E07820' : '2px solid transparent',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '4px 0 120px' }}>
        <div className="container-site" style={{ paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Bu kategoride proje bulunmuyor.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoRows: '520px',
              gap: 2,
              padding: '0 2px',
            }}>
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
