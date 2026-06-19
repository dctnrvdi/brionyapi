'use client'

import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--dark-3)',
  border: '1px solid var(--border-subtle)',
  padding: '14px 16px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.25s ease',
}

export default function IletisimClient({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const phone   = settings.contact_phone   || '+90 212 000 00 00'
  const email   = settings.contact_email   || 'info@brionyapi.com'
  const address = settings.contact_address || 'İstanbul, Türkiye'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }
  const focus = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = '#E07820' }
  const blur  = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setError('Ad, e-posta ve mesaj zorunludur.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSent(true); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }
      else setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } catch { setError('Bir hata oluştu.') }
    setLoading(false)
  }

  return (
    <main>
      {/* Header */}
      <section style={{ paddingTop: 160, paddingBottom: 64 }}>
        <div className="container-site">
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: '#E07820' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E07820' }}>Bize Ulaşın</span>
          </div>
          <h1 className="animate-fade-up" style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 'clamp(52px, 9vw, 120px)', color: '#EBEBEB', lineHeight: 0.92, letterSpacing: '0.02em' }}>
            İLETİŞİME<br /><span style={{ color: '#E07820' }}>GEÇİN.</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>

            {/* Info */}
            <div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 48, fontFamily: 'var(--font-inter), sans-serif' }}>
                Projeniz için bir görüşme ayarlamak ya da bilgi almak istiyorsanız, formu doldurun — size 24 saat içinde dönelim.
              </p>
              {[
                { label: 'Telefon', value: phone },
                { label: 'E-posta', value: email },
                { label: 'Adres', value: address },
              ].map(item => (
                <div key={item.label} style={{ padding: '20px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07820', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 14, color: '#EBEBEB', fontFamily: 'var(--font-inter), sans-serif' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Ad Soyad *</label>
                  <input name="name" value={form.name} onChange={handleChange} onFocus={focus} onBlur={blur} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>E-posta *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} onFocus={focus} onBlur={blur} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Telefon</label>
                  <input name="phone" value={form.phone} onChange={handleChange} onFocus={focus} onBlur={blur} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Konu</label>
                  <input name="subject" value={form.subject} onChange={handleChange} onFocus={focus} onBlur={blur} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Mesajınız *</label>
                <textarea name="message" value={form.message} onChange={handleChange} onFocus={focus} onBlur={blur} rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {error && <p style={{ fontSize: 13, color: '#ff5555', fontFamily: 'var(--font-inter), sans-serif' }}>{error}</p>}
              {sent && <p style={{ fontSize: 13, color: '#E07820', fontFamily: 'var(--font-inter), sans-serif' }}>Mesajınız iletildi. En kısa sürede dönüş yapacağız.</p>}

              <button type="submit" disabled={loading} className="btn-neon" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', justifyContent: 'center' }}>
                {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
