'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Project = {
  id: number; title: string; slug: string; category: string
  location: string; year: number; area: string; coverImage: string
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(32px)'
    el.style.transition = `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.disconnect() }
    }, { threshold: 0.06 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <div ref={ref}>{children}</div>
}

// ── Service Card ────────────────────────────────────────────────────────────
type ServiceItem = { num: string; title: string; desc: string }

function ServiceCard({ sv, i }: { sv: ServiceItem; i: number }) {
  const [hov, setHov] = useState(false)
  const [entered, setEntered] = useState(false)
  const [scanning, setScanning] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setEntered(true), i * 110); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [i])

  const handleEnter = () => {
    setHov(true)
    setScanning(false)
    setTimeout(() => setScanning(true), 10)
  }
  const handleLeave = () => { setHov(false); setScanning(false) }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hov ? 'rgba(224,120,32,0.022)' : 'var(--dark)',
        height: '100%',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0) scale(1)' : 'translateY(52px) scale(0.97)',
        transition: `opacity 0.75s ease ${i * 0.11}s, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.11}s, background 0.35s`,
        cursor: 'default',
      }}
    >
      {/* Top border — draws left→right on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, height: 1.5, zIndex: 3,
        background: 'linear-gradient(90deg, #E07820 0%, rgba(224,120,32,0.3) 100%)',
        boxShadow: '0 0 8px rgba(224,120,32,0.7)',
        width: hov ? '100%' : '0%',
        transition: 'width 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
        transformOrigin: 'left',
      }} />

      {/* Diagonal scan shimmer on hover */}
      {scanning && (
        <div className="service-scan" style={{
          position: 'absolute', top: 0, bottom: 0, width: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(224,120,32,0.04), transparent)',
          zIndex: 1, pointerEvents: 'none',
        }} />
      )}

      {/* Ghost big number */}
      <div style={{
        position: 'absolute', bottom: -28, right: -6, zIndex: 0,
        fontFamily: 'var(--font-bebas), sans-serif',
        fontSize: 'clamp(100px, 10vw, 150px)', lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: `1px rgba(224,120,32,${hov ? 0.09 : 0.025})`,
        transform: hov ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
        transition: 'all 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
        userSelect: 'none', pointerEvents: 'none',
      }}>{sv.num}</div>

      {/* Card content */}
      <div style={{ padding: '40px 32px', position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

        {/* Number badge */}
        <p className={hov ? 'service-num-active' : ''} style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 11, letterSpacing: '0.22em',
          color: hov ? '#E07820' : 'rgba(224,120,32,0.35)',
          marginBottom: 28,
          transition: 'color 0.3s',
        }}>{sv.num}</p>

        {/* Horizontal rule */}
        <div style={{
          height: 1, marginBottom: 22,
          background: hov
            ? 'linear-gradient(to right, rgba(224,120,32,0.25), transparent)'
            : 'rgba(255,255,255,0.05)',
          transition: 'background 0.5s',
        }} />

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(20px, 2.2vw, 30px)',
          letterSpacing: hov ? '0.07em' : '0.02em',
          color: hov ? '#EBEBEB' : 'rgba(235,235,235,0.72)',
          marginBottom: 14, lineHeight: 1.05,
          transition: 'letter-spacing 0.45s ease, color 0.3s',
        }}>{sv.title}</h3>

        {/* Description */}
        <p style={{
          fontSize: 13, lineHeight: 1.82,
          color: hov ? 'rgba(255,255,255,0.44)' : 'rgba(255,255,255,0.26)',
          flex: 1,
          transform: hov ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'transform 0.4s ease, color 0.35s',
        }}>{sv.desc}</p>

        {/* Arrow — slides in on hover */}
        <div style={{
          marginTop: 28,
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateX(0)' : 'translateX(-18px)',
          transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#E07820',
        }}>
          <span style={{ width: 22, height: 1, background: '#E07820', display: 'inline-block' }} />
          Keşfet
        </div>
      </div>
    </div>
  )
}

// ── Services Section ────────────────────────────────────────────────────────
function ServicesSection({ services, settings, isMobile }: { services: ServiceItem[]; settings: Record<string, string>; isMobile: boolean }) {
  const [lineVisible, setLineVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLineVisible(true); io.disconnect() }
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ padding: isMobile ? '60px 20px' : '100px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: isMobile ? 40 : 64 }}>
            <p style={{
              fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E07820',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 28, height: 1, background: '#E07820', display: 'inline-block' }} />
              {settings.services_label || 'Hizmetlerimiz'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 'clamp(44px, 6vw, 72px)', letterSpacing: '-1px', lineHeight: 1, color: '#EBEBEB',
            }}>
              {(settings.services_title || 'Uzmanlık Alanlarımız').toUpperCase().split(' ').map((w, i, arr) => (
                <span key={i}>{i === arr.length - 1 ? <em style={{ fontStyle: 'normal', color: '#E07820' }}>{w}</em> : <>{w} </>}</span>
              ))}
            </h2>
          </div>
        </Reveal>

        {/* Sweep line above grid */}
        <div style={{ position: 'relative', height: 1, marginBottom: 1, overflow: 'hidden' }}>
          <div className={lineVisible ? 'sweep-line' : ''} style={{
            height: '100%', width: lineVisible ? '100%' : '0%',
            background: 'linear-gradient(to right, #E07820, rgba(224,120,32,0.2))',
            boxShadow: '0 0 8px rgba(224,120,32,0.5)',
          }} />
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 1, background: 'rgba(255,255,255,0.04)',
        }}>
          {services.map((sv, i) => (
            <ServiceCard key={sv.num} sv={sv} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MarqueeBand({ rawItems }: { rawItems?: string }) {
  const items = rawItems
    ? rawItems.split(',').map(s => s.trim()).filter(Boolean)
    : ['İNŞAAT', 'PROJE YÖNETİMİ', 'MÜHENDİSLİK', 'ALTYAPI', 'KONUT', 'TİCARİ YAPI', 'RENOVASYON', 'PROJE GELİŞTİRME']
  const rep = [...items, ...items]
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', background: '#080808', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right,#080808,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left,#080808,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ padding: '20px 0', overflow: 'hidden' }}>
        <div className="brion-marquee" style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          {rep.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 13, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)', padding: '0 36px' }}>{item}</span>
              <span style={{ color: '#E07820', fontSize: 7, paddingRight: 36 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function isCoverVideo(url: string) {
  return /\.(mp4|mov|webm)$/i.test(url) || url.includes('/video/upload/')
}

// Single project card — fills its container
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hov, setHov] = useState(false)
  const isVid = project.coverImage ? isCoverVideo(project.coverImage) : false
  return (
    <Link href={`/projeler/${project.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#111', cursor: 'pointer' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <span style={{ position: 'absolute', top: 20, right: 24, zIndex: 3, fontFamily: 'var(--font-bebas), sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ position: 'absolute', inset: 0, transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', transform: hov ? 'scale(1.05)' : 'scale(1)' }}>
          {project.coverImage
            ? isVid
              ? <video src={project.coverImage} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0f0f0f,#1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 100, color: 'rgba(224,120,32,0.04)' }}>{project.title.charAt(0)}</span>
              </div>}
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(transparent 30%, rgba(8,8,8,0.95) 100%)', opacity: hov ? 1 : 0.55, transition: 'opacity 0.5s' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 4, background: 'linear-gradient(90deg,transparent,#E07820,transparent)', opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px', zIndex: 3, transform: hov ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07820', border: '1px solid rgba(224,120,32,0.35)', padding: '3px 7px' }}>{project.category}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(20px, 2.8vw, 36px)', color: '#EBEBEB', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 4 }}>{project.title.toUpperCase()}</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>{project.location} · {project.year}</p>
        </div>
      </div>
    </Link>
  )
}

// Row-based layout: equal heights per row, varying column widths
const ROW_CONFIGS = [
  { heights: ['58.33%', '41.67%'], rowH: 540 },
  { heights: ['41.67%', '58.33%'], rowH: 540 },
  { heights: ['50%', '50%'],       rowH: 480 },
]

function ProjectGrid({ projects, isMobile }: { projects: Project[]; isMobile: boolean }) {
  if (isMobile) {
    return (
      <div>
        {projects.map((p, i) => (
          <div key={p.id} style={{ height: 300, marginBottom: 2 }}>
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>
    )
  }

  const rows: Project[][] = []
  let i = 0
  while (i < projects.length) {
    const rowSize = i + 1 < projects.length ? 2 : 1
    rows.push(projects.slice(i, i + rowSize))
    i += rowSize
  }

  return (
    <div>
      {rows.map((rowProjects, ri) => {
        const cfg = ROW_CONFIGS[ri % ROW_CONFIGS.length]
        return (
          <div key={ri} style={{ display: 'flex', height: cfg.rowH, gap: 0 }}>
            {rowProjects.map((p, ci) => {
              const globalIdx = rows.slice(0, ri).reduce((s, r) => s + r.length, 0) + ci
              const width = rowProjects.length === 1 ? '100%' : cfg.heights[ci] || '50%'
              return (
                <div key={p.id} style={{ flex: `0 0 ${width}`, height: '100%' }}>
                  <ProjectCard project={p} index={globalIdx} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function HomeClient({
  projects = [],
  settings = {},
}: {
  projects: Project[]
  settings: Record<string, string>
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const PILLAR_DEFAULTS = [
    { title: 'İLERİ GÖRÜŞLÜ', desc: 'Yarının şehirlerini bugünden planlıyoruz. Her projede uzun vadeli değer ve sürdürülebilirlik önceliğimiz.' },
    { title: 'KALİTE ODAKLI', desc: 'Malzeme seçiminden son detaya kadar ödün vermez standartlar. İlk seferinde doğru yapmak bizim için bir alışkanlık.' },
    { title: 'ŞEFFAF ORTAKLIK', desc: 'Sürecin her adımında müşterilerimizle açık, dürüst ve güvene dayalı bir iletişim kuruyoruz.' },
    { title: 'YENİLİKÇİ ÇÖZÜMLER', desc: 'Sektörü taze bir bakış açısıyla yeniden yorumluyoruz. Geleneksel inşaatı modern teknolojiyle buluşturuyoruz.' },
  ]

  const pillars = [1, 2, 3, 4].map((n, i) => ({
    title: settings[`pillar_${n}_title`] || PILLAR_DEFAULTS[i].title,
    desc:  settings[`pillar_${n}_desc`]  || PILLAR_DEFAULTS[i].desc,
  }))

  const visionStatement = settings.vision_statement || 'Yeni Nesil\nYapım\nAnlayışı.'
  const visionText = settings.vision_text || 'Deneyimin yerini vizyon alıyor. Brion Yapı, inşaat sektörüne taze bir bakış açısı, ileri teknoloji ve müşteri odaklı anlayışla yeni bir soluk getiriyor.'

  const services = [1, 2, 3, 4].map(n => ({
    num: String(n).padStart(2, '0'),
    title: settings[`service_${n}_title`] || ['Konut İnşaatı', 'Ticari Yapılar', 'Altyapı Projeleri', 'Proje Yönetimi'][n - 1],
    desc: settings[`service_${n}_desc`] || '',
  }))

  const heroTitle = settings.hero_title || 'Güçlü\nTemeller,\nKalıcı Yapılar.'
  const heroSub = settings.hero_subtitle || 'Konut ve ticari projelerde mühendislik mükemmelliği ile değer yaratıyoruz.'
  const ctaTitle = settings.cta_title || 'PROJENİZİ\nBİRLİKTE\nGERÇEKLEŞTİRELİM.'
  const hasMedia = !!(settings.hero_video_url || settings.hero_image_url)

  return (
    <main>

      {/* ── HERO ── */}
      <section style={{
        height: '100svh', minHeight: 600,
        display: 'grid', gridTemplateRows: '1fr auto',
        padding: isMobile ? '0 20px' : '0 48px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Video */}
        {settings.hero_video_url && (
          <video src={settings.hero_video_url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.4)' }} />
        )}
        {/* Image fallback */}
        {!settings.hero_video_url && settings.hero_image_url && (
          <img src={settings.hero_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.4)' }} />
        )}

        {/* No-media: subtle animated gradient */}
        {!hasMedia && (
          <>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 80% 60% at 70% 55%, rgba(224,120,32,0.05) 0%, transparent 70%), #080808' }} />
            <div className="hero-glow-pulse" style={{ position: 'absolute', top: '35%', right: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,120,32,0.04) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(224,120,32,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(224,120,32,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
          </>
        )}

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: hasMedia ? 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0) 35%, rgba(8,8,8,0.85) 100%)' : 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, transparent 50%, rgba(8,8,8,0.65) 100%)' }} />

        {/* Ghost text — desktop only */}
        {!isMobile && (
          <div style={{ position: 'absolute', right: '-2%', top: 0, bottom: 0, zIndex: 1, display: 'flex', alignItems: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
            <span style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(160px, 24vw, 380px)', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.025)', letterSpacing: '-6px', whiteSpace: 'nowrap', userSelect: 'none' }}>BRION</span>
          </div>
        )}

        {/* EST badge — desktop only */}
        {!isMobile && (
          <div className="animate-fade-in delay-600" style={{ position: 'absolute', top: '38%', right: 48, zIndex: 2, writingMode: 'vertical-rl', fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)' }}>EST. 2009</div>
        )}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 20, paddingTop: 80 }}>
          <div className="animate-fade-in" style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E07820', marginBottom: 44, fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700 }}>
            Mühendislik · İnşaat · Proje Geliştirme
          </div>
          <h1 className="animate-fade-up delay-100" style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(56px, 13vw, 180px)', lineHeight: 0.88, letterSpacing: '-2px', color: '#EBEBEB', margin: 0 }}>
            {heroTitle.split('\n').map((line, i, arr) => (
              <span key={i} style={{ display: 'block' }}>
                {i === arr.length - 1 ? <em style={{ fontStyle: 'normal', WebkitTextStroke: '1.5px #EBEBEB', color: 'transparent' }}>{line}</em> : line}
              </span>
            ))}
          </h1>
        </div>

        {/* Bottom bar */}
        <div className="animate-fade-up delay-300" style={{
          position: 'relative', zIndex: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? 20 : 0,
          padding: isMobile ? '20px 0 40px' : '28px 0 52px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          marginTop: 28,
        }}>
          <p style={{ fontSize: 13, lineHeight: 1.9, color: 'rgba(255,255,255,0.35)', maxWidth: 320, fontFamily: 'var(--font-inter), sans-serif' }}>{heroSub}</p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            {[{ href: '/iletisim', label: 'İletişime Geç' }, { href: '/projeler', label: 'Tüm Projeler' }].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E07820')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                <span style={{ width: 32, height: 1, background: 'currentColor', display: 'inline-block' }} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <MarqueeBand rawItems={settings.marquee_items} />

      {/* ── VİZYON ── */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'var(--dark-2)' }}>
        {/* Manifesto */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Reveal>
            <div style={{
              padding: isMobile ? '48px 20px' : '80px 56px',
              borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E07820', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 28, height: 1, background: '#E07820', display: 'inline-block' }} />
                Vizyonumuz
              </p>
              <h2 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(52px, 6vw, 88px)', lineHeight: 0.9, letterSpacing: '-1px', color: '#EBEBEB' }}>
                {visionStatement.split('\n').map((line, i, arr) => (
                  <span key={i} style={{ display: 'block' }}>
                    {i === arr.length - 1
                      ? <em style={{ fontStyle: 'normal', color: '#E07820' }}>{line}</em>
                      : line}
                  </span>
                ))}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ padding: isMobile ? '40px 20px' : '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.45)', maxWidth: 420 }}>
                {visionText}
              </p>
              <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                  Brion Yapı · Kuruluş 2024
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pillar cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 1, background: 'rgba(255,255,255,0.04)',
        }}>
          {pillars.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ padding: isMobile ? '24px 16px' : '36px 28px', background: 'var(--dark-2)', height: '100%', transition: 'background 0.3s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,120,32,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--dark-2)')}
              >
                <div style={{ width: 24, height: 2, background: '#E07820', marginBottom: 20 }} />
                <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 22, letterSpacing: '0.04em', color: '#EBEBEB', marginBottom: 12, lineHeight: 1 }}>{p.title}</p>
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.3)' }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section style={{ paddingTop: isMobile ? 60 : 100 }}>
        <div style={{ padding: isMobile ? '0 20px' : '0 48px', maxWidth: 1320, margin: `0 auto ${isMobile ? 36 : 56}px` }}>
          <Reveal>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: isMobile ? 'flex-start' : 'space-between',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              gap: isMobile ? 12 : 0,
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E07820', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 28, height: 1, background: '#E07820', display: 'inline-block' }} />
                  {settings.projects_section_label || 'Seçili Çalışmalar'}
                </p>
                <h2 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(44px, 6vw, 80px)', color: '#EBEBEB', letterSpacing: '-0.5px', lineHeight: 0.95 }}>
                  {(settings.projects_section_title || 'ÖNE ÇIKAN PROJELER').toUpperCase()}
                </h2>
              </div>
              <Link href="/projeler" style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E07820')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >Tümünü Gör →</Link>
            </div>
          </Reveal>
        </div>

        {projects.length === 0
          ? <div style={{ padding: isMobile ? '40px 20px' : '60px 48px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Henüz proje eklenmemiş.</div>
          : <ProjectGrid projects={projects} isMobile={isMobile} />
        }
      </section>

      {/* ── SERVICES ── */}
      <ServicesSection services={services} settings={settings} isMobile={isMobile} />

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '72px 20px' : '120px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(224,120,32,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(52px, 9vw, 120px)', lineHeight: 0.92, letterSpacing: '-1px', color: '#EBEBEB', position: 'relative' }}>
            {ctaTitle.split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {i === 1 ? <em style={{ fontStyle: 'normal', color: '#E07820', textShadow: '0 0 40px rgba(224,120,32,0.25)' }}>{line}</em> : line}
              </span>
            ))}
          </h2>
          <Link href="/iletisim" className="btn-neon" style={{ marginTop: 48, display: 'inline-flex', position: 'relative' }}>
            Bizimle İletişime Geçin
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>
      </section>

    </main>
  )
}
