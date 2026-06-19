'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Testimonial = {
  id: number; author: string; role: string; company?: string | null
  content: string; rating: number; featured: boolean; order: number
}

const I: React.CSSProperties = {
  width: '100%', background: 'var(--dark-3)',
  border: '1px solid var(--border-subtle)',
  padding: '11px 13px', color: '#EBEBEB',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: 13, outline: 'none',
  transition: 'border-color 0.25s ease',
}
const L: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-syne), sans-serif',
  fontSize: 9, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase' as const,
  color: 'var(--text-muted)', marginBottom: 5,
}

const empty = { author: '', role: '', company: '', content: '', rating: 5, featured: true }

export default function AdminTestimonialsClient({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [list, setList] = useState(initial)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const foc = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = '#E07820' }
  const blu = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)' }

  const openCreate = () => { setForm(empty); setCreating(true); setEditing(null); setError('') }
  const openEdit = (t: Testimonial) => {
    setForm({ author: t.author, role: t.role, company: t.company || '', content: t.content, rating: t.rating, featured: t.featured })
    setEditing(t); setCreating(false); setError('')
  }
  const cancel = () => { setCreating(false); setEditing(null); setError('') }

  const save = async () => {
    if (!form.author || !form.content) { setError('Ad ve içerik zorunludur.'); return }
    setLoading(true); setError('')
    try {
      if (creating) {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const data = await res.json()
          setList(p => [...p, data])
          setCreating(false)
        } else setError('Kayıt başarısız.')
      } else if (editing) {
        const res = await fetch(`/api/testimonials/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: editing.order }),
        })
        if (res.ok) {
          const data = await res.json()
          setList(p => p.map(x => x.id === editing.id ? data : x))
          setEditing(null)
        } else setError('Kayıt başarısız.')
      }
    } catch { setError('Sunucu hatası.') }
    setLoading(false)
  }

  const del = async (id: number) => {
    if (!confirm('Bu referansı silmek istediğinizden emin misiniz?')) return
    setDeleting(id)
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    setList(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  const LD: React.CSSProperties = {
    fontFamily: 'var(--font-syne), sans-serif',
    fontSize: 9, fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: '#E07820', marginBottom: 6,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={LD}>Müşteri Görüşleri</p>
          <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 44, color: '#EBEBEB', letterSpacing: '0.04em' }}>REFERANSLAR</h1>
        </div>
        {!creating && !editing && (
          <button onClick={openCreate} className="btn-gold">+ Yeni Referans</button>
        )}
      </div>

      {/* Form */}
      {(creating || editing) && (
        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: 28, marginBottom: 28 }}>
          <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 20, color: '#EBEBEB', letterSpacing: '0.06em', marginBottom: 20 }}>
            {creating ? 'YENİ REFERANS' : 'DÜZENLE'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={L}>Ad Soyad *</label>
                <input name="author" value={form.author} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
              <div>
                <label style={L}>Unvan *</label>
                <input name="role" value={form.role} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
              <div>
                <label style={L}>Şirket</label>
                <input name="company" value={form.company} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
            </div>
            <div>
              <label style={L}>Yorum *</label>
              <textarea name="content" value={form.content} onChange={handleChange} onFocus={foc} onBlur={blu} rows={4} style={{ ...I, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={L}>Puan (1-5)</label>
                <select name="rating" value={form.rating} onChange={handleChange as any} onFocus={foc} onBlur={blu} style={{ ...I, width: 80 }}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 14 }}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: '#E07820', width: 14, height: 14 }} />
                <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 600, color: '#EBEBEB' }}>Ana sayfada göster</span>
              </label>
            </div>
            {error && <p style={{ fontSize: 12, color: '#ff5555' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={loading} className="btn-gold" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button onClick={cancel} className="btn-dark">İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {list.length === 0 && !creating ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Henüz referans eklenmemiş.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-subtle)' }}>
          {list.map(t => (
            <div key={t.id} style={{
              background: 'var(--dark-2)', padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--dark-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--dark-2)')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 12, fontWeight: 700, color: '#EBEBEB' }}>{t.author}</p>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>{t.role}{t.company ? ` · ${t.company}` : ''}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: t.rating }).map((_, i) => <span key={i} style={{ color: '#E07820', fontSize: 10 }}>★</span>)}
                  </div>
                  {t.featured && <span style={{ fontSize: 7, fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E07820', border: '1px solid rgba(224,120,32,0.2)', padding: '2px 6px' }}>Gösteriliyor</span>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: 'var(--font-inter), sans-serif' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(t)} style={{ padding: '6px 12px', background: 'var(--dark-4)', border: '1px solid var(--border-subtle)', color: '#EBEBEB', cursor: 'pointer', fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600 }}>
                  Düzenle
                </button>
                <button onClick={() => del(t.id)} disabled={deleting === t.id} style={{ padding: '6px 12px', background: 'none', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555', cursor: 'pointer', fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600, opacity: deleting === t.id ? 0.5 : 1 }}>
                  {deleting === t.id ? '...' : 'Sil'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
