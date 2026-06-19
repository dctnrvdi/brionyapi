import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100svh', background: '#080808', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-bebas, sans-serif)',
        fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
        color: '#E07820', marginBottom: 24,
      }}>404</p>
      <h1 style={{
        fontFamily: 'var(--font-bebas, sans-serif)',
        fontSize: 'clamp(64px, 10vw, 120px)', letterSpacing: '-2px',
        color: '#EBEBEB', textAlign: 'center', marginBottom: 16,
      }}>Sayfa Bulunamadı</h1>
      <p style={{
        fontSize: 14, color: 'rgba(255,255,255,0.35)',
        marginBottom: 40, textAlign: 'center', maxWidth: 400, lineHeight: 1.7,
      }}>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        style={{
          padding: '13px 36px', background: '#E07820', textDecoration: 'none',
          color: '#080808', fontFamily: 'var(--font-syne, sans-serif)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', display: 'inline-block',
        }}
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  )
}
