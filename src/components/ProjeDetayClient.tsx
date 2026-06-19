'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

type Project = {
  id: number; title: string; slug: string; category: string
  location: string; year: number; area: string; description: string
  coverImage: string; images: string
}

function Reveal({ children, delay = 0, y = 48 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = `translateY(${y}px)`
    el.style.transition = `opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.disconnect() }
    }, { threshold: 0.06 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay, y])
  return <div ref={ref}>{children}</div>
}

function RevealImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(56px) scale(0.98)'
    el.style.transition = 'opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94)'
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0) scale(1)'; io.disconnect() }
    }, { threshold: 0.04 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm)$/i.test(url) || url.includes('/video/upload/')
}

function MediaEl({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const base: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
  const s = style ? { ...base, ...style } : base
  if (isVideoUrl(src)) {
    return <video src={src} autoPlay muted loop playsInline className={className} style={s} />
  }
  return <img src={src} alt={alt} className={className} style={s} />
}

export default function ProjeDetayClient({ project }: { project: Project }) {
  const images: string[] = (() => {
    try { return JSON.parse(project.images) } catch { return [] }
  })()
  const allImages = [project.coverImage, ...images].filter(Boolean)

  // Build image layout: alternating sizes
  const galleryImages = allImages.slice(1) // skip cover, shown in hero

  return (
    <main style={{ background: 'var(--dark)' }}>

      {/* ── HERO IMAGE ── */}
      <section style={{ position: 'relative', height: '92vh', overflow: 'hidden', background: '#111' }}>
        {allImages[0] ? (
          <>
            <MediaEl
              src={allImages[0]}
              alt={project.title}
              style={{ position: 'absolute', inset: 0, filter: 'brightness(0.5)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.75) 100%)',
            }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(80px, 15vw, 200px)', color: 'rgba(224,120,32,0.04)' }}>BRION</span>
          </div>
        )}

        {/* Back button */}
        <div style={{ position: 'absolute', top: 100, left: 0, right: 0, zIndex: 3 }}>
          <div className="container-site">
            <Link href="/projeler" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E07820')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M6 11L2 7l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Projeler
            </Link>
          </div>
        </div>

        {/* Title at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, padding: '0 0 52px' }}>
          <div className="container-site">
            <p className="animate-fade-in" style={{
              fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#E07820', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 24, height: 1, background: '#E07820', display: 'inline-block' }} />
              {project.category}
            </p>
            <h1 className="animate-fade-up" style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 'clamp(52px, 9vw, 120px)',
              color: '#EBEBEB', lineHeight: 0.9, letterSpacing: '-1px',
            }}>
              {project.title.toUpperCase()}
            </h1>
          </div>
        </div>
      </section>

      {/* ── META STRIP ── */}
      <section style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--dark-2)',
      }}>
        <div className="container-site">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            background: 'rgba(255,255,255,0.04)',
          }}>
            {[
              { label: 'Konum', value: project.location },
              { label: 'Yıl', value: String(project.year) },
              { label: 'Alan', value: project.area },
              { label: 'Kategori', value: project.category },
            ].map(m => (
              <div key={m.label} style={{ padding: '28px 24px', background: 'var(--dark-2)' }}>
                <p style={{
                  fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)', marginBottom: 6,
                }}>{m.label}</p>
                <p style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: 18, letterSpacing: '0.06em',
                  color: '#EBEBEB',
                }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      {project.description && (
        <section style={{ padding: '100px 0' }}>
          <div className="container-site">
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <Reveal>
                <p style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: 17, lineHeight: 1.85,
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.01em',
                }}>{project.description}</p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {allImages.length > 0 && (
        <section style={{ paddingBottom: 120 }}>
          {/* First media: full width */}
          <Reveal y={60}>
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', marginBottom: 2 }}>
              <MediaEl src={allImages[0]} alt={project.title} />
            </div>
          </Reveal>

          {/* Remaining media in pattern */}
          {galleryImages.length > 0 && (() => {
            const chunks: string[][] = []
            let i = 0
            while (i < galleryImages.length) {
              if (i % 3 === 0 && galleryImages[i + 1]) {
                chunks.push([galleryImages[i], galleryImages[i + 1]])
                i += 2
              } else {
                chunks.push([galleryImages[i]])
                i += 1
              }
            }
            return chunks.map((chunk, ci) => (
              <div key={ci} style={{ marginTop: 2 }}>
                {chunk.length === 2 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {chunk.map((url, ii) => (
                      <Reveal key={ii} delay={ii * 0.1} y={56}>
                        <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                          <MediaEl src={url} alt="" style={{ transition: 'transform 0.8s ease' }} />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <Reveal y={56}>
                    <div style={{ width: '100%', aspectRatio: '21/9', overflow: 'hidden' }}>
                      <MediaEl src={chunk[0]} alt="" style={{ transition: 'transform 0.8s ease' }} />
                    </div>
                  </Reveal>
                )}
              </div>
            ))
          })()}
        </section>
      )}

      {/* ── CTA / NEXT ── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 0',
        background: 'var(--dark-2)',
      }}>
        <div className="container-site">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#E07820', marginBottom: 12,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 20, height: 1, background: '#E07820', display: 'inline-block' }} />
                  Benzer Bir Projeniz mi Var?
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: 'clamp(32px, 5vw, 64px)',
                  color: '#EBEBEB', lineHeight: 0.95, letterSpacing: '-0.5px',
                }}>
                  BİRLİKTE<br />
                  <em style={{ fontStyle: 'normal', color: '#E07820' }}>GERÇEKLEŞTİRELİM.</em>
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/iletisim" className="btn-neon">
                  İletişime Geç
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/projeler" className="btn-outline">Tüm Projeler</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}
