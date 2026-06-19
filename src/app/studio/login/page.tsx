'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const I: React.CSSProperties = {
  width: '100%', background: 'var(--dark-3)',
  border: '1px solid var(--border-subtle)',
  padding: '14px 16px', color: '#EBEBEB',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: 14, outline: 'none',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) { setError('E-posta ve şifre zorunludur.'); return }
    setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.ok) router.push('/studio')
    else { setError('E-posta veya şifre hatalı.'); setLoading(false) }
  }

  const foc = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = '#E07820' }
  const blu = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 32, letterSpacing: '0.12em', color: '#EBEBEB', marginBottom: 4 }}>BRION YAPI</p>
          <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07820' }}>Admin Panel</p>
        </div>

        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: '44px 36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} onFocus={foc} onBlur={blu} style={I} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} onFocus={foc} onBlur={blu} style={I} />
            </div>

            {error && <p style={{ fontSize: 12, color: '#ff5555', fontFamily: 'var(--font-inter), sans-serif' }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: 16,
              background: loading ? 'rgba(224,120,32,0.7)' : '#E07820',
              border: 'none', color: '#080808',
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-syne), sans-serif' }}>
          © {new Date().getFullYear()} Brion Yapı
        </p>
      </div>
    </div>
  )
}
