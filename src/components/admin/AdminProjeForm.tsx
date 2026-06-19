'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import MediaUpload from './MediaUpload'

type Project = {
  id: number; title: string; slug: string; category: string
  location: string; year: number; area: string; description: string
  coverImage: string; images: string; featured: boolean; order: number
}

const I: React.CSSProperties = {
  width: '100%', background: 'var(--dark-3)',
  border: '1px solid var(--border-subtle)',
  padding: '12px 14px', color: '#EBEBEB',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: 13, outline: 'none',
  transition: 'border-color 0.25s ease',
}
const L: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-syne), sans-serif',
  fontSize: 9, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase' as const,
  color: 'var(--text-muted)', marginBottom: 6,
}

// Upload multiple files in parallel, show per-file progress
function MultiUpload({ onAdd, accept = 'all' }: { onAdd: (urls: string[]) => void; accept?: 'all' | 'image' | 'video' }) {
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(0)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const busy = total > 0 && done + errors < total

  const acceptStr = accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'

  const uploadAll = async (files: File[]) => {
    setDone(0); setErrors(0); setTotal(files.length)
    const results = await Promise.all(
      files.map(async file => {
        try {
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (data.url) { setDone(d => d + 1); return data.url as string }
          setErrors(e => e + 1); return null
        } catch { setErrors(e => e + 1); return null }
      })
    )
    const urls = results.filter((u): u is string => !!u)
    onAdd(urls)
    setTimeout(() => setTotal(0), 1200)
  }

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) uploadAll(files)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length) uploadAll(files)
  }

  return (
    <div>
      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{
          border: '1px dashed rgba(255,255,255,0.12)',
          padding: '20px 16px', cursor: busy ? 'not-allowed' : 'pointer',
          textAlign: 'center', background: 'var(--dark-3)', transition: 'border-color 0.25s',
        }}
        onMouseEnter={e => { if (!busy) (e.currentTarget as HTMLElement).style.borderColor = '#E07820' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
      >
        <input ref={inputRef} type="file" multiple accept={acceptStr} onChange={onInput} style={{ display: 'none' }} />
        {busy ? (
          <div>
            <p style={{ fontSize: 12, color: '#E07820', fontFamily: 'var(--font-syne), sans-serif', marginBottom: 8 }}>
              {done + errors} / {total} yüklendi
            </p>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
              <div style={{
                height: '100%', borderRadius: 1, background: '#E07820',
                width: `${((done + errors) / total) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            {errors > 0 && <p style={{ fontSize: 10, color: '#ff5555', marginTop: 6 }}>{errors} dosya yüklenemedi</p>}
          </div>
        ) : total > 0 ? (
          <p style={{ fontSize: 12, color: '#E07820', fontFamily: 'var(--font-syne), sans-serif' }}>
            ✓ {done} dosya yüklendi
          </p>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-syne), sans-serif', marginBottom: 4 }}>
              Birden fazla dosya seçin veya buraya sürükleyin
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>
              {accept === 'image' ? 'JPG, PNG, WEBP' : accept === 'video' ? 'MP4, MOV' : 'Resim + Video — Çoklu seçim desteklenir'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function slugify(str: string) {
  return str.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminProjeForm({ mode, project }: { mode: 'create' | 'edit'; project?: Project }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coverImage, setCoverImage] = useState(project?.coverImage || '')
  const [extraImages, setExtraImages] = useState<string[]>(() => {
    try { return JSON.parse(project?.images || '[]') } catch { return [] }
  })

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    category: project?.category || 'Konut',
    location: project?.location || '',
    year: project?.year?.toString() || new Date().getFullYear().toString(),
    area: project?.area || '',
    description: project?.description || '',
    featured: project?.featured ?? false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
    if (name === 'title' && mode === 'create') {
      setForm(p => ({ ...p, slug: slugify(value) }))
    }
  }

  const addExtraImage = (url: string) => { if (url) setExtraImages(p => [...p, url]) }
  const removeExtra = (i: number) => setExtraImages(p => p.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.location) { setError('Başlık, slug ve konum zorunludur.'); return }
    setLoading(true); setError('')
    const payload = { ...form, year: Number(form.year), coverImage, images: JSON.stringify(extraImages) }

    try {
      const url = mode === 'create' ? '/api/projeler' : `/api/projeler/${project!.id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { router.refresh(); router.push('/studio/projeler') }
      else setError('Kayıt başarısız.')
    } catch { setError('Sunucu hatası.') }
    setLoading(false)
  }

  const foc = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = '#E07820' }
  const blu = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)' }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 20, color: '#EBEBEB', letterSpacing: '0.06em', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
      {children}
    </p>
  )

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07820', marginBottom: 6 }}>
          {mode === 'create' ? 'Yeni Proje' : 'Proje Düzenle'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 40, color: '#EBEBEB', letterSpacing: '0.04em' }}>
          {mode === 'create' ? 'PROJE EKLE' : form.title.toUpperCase() || 'DÜZENLE'}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Temel Bilgiler */}
        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: 28 }}>
          <SectionTitle>Temel Bilgiler</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={L}>Proje Adı *</label>
                <input name="title" value={form.title} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
              <div>
                <label style={L}>Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={L}>Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} onFocus={foc} onBlur={blu} style={I}>
                  {['Konut', 'Ticari', 'Karma', 'Altyapı'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={L}>Yıl</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
              </div>
              <div>
                <label style={L}>Alan</label>
                <input name="area" value={form.area} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} placeholder="ör. 4.200 m²" />
              </div>
            </div>
            <div>
              <label style={L}>Konum *</label>
              <input name="location" value={form.location} onChange={handleChange} onFocus={foc} onBlur={blu} style={I} />
            </div>
            <div>
              <label style={L}>Açıklama</label>
              <textarea name="description" value={form.description} onChange={handleChange} onFocus={foc} onBlur={blu} rows={4} style={{ ...I, resize: 'vertical' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: '#E07820', width: 14, height: 14 }} />
              <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 600, color: '#EBEBEB' }}>Ana sayfada öne çıkar</span>
            </label>
          </div>
        </div>

        {/* Medya */}
        <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: 28 }}>
          <SectionTitle>Medya</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Cover */}
            <div>
              <label style={L}>Kapak Görseli veya Videosu</label>
              <MediaUpload value={coverImage} onChange={setCoverImage} accept="all" />
            </div>

            {/* Extra media */}
            <div>
              <label style={L}>Ek Görseller / Videolar</label>

              {/* Existing list */}
              {extraImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 6, marginBottom: 12 }}>
                  {extraImages.map((url, i) => {
                    const isVid = /\.(mp4|mov|webm)$/i.test(url) || url.includes('/video/upload/')
                    return (
                      <div key={i} style={{ position: 'relative' }}>
                        {isVid
                          ? <video src={url} style={{ width: '100%', height: 60, objectFit: 'cover', display: 'block' }} />
                          : <img src={url} alt="" style={{ width: '100%', height: 60, objectFit: 'cover', display: 'block' }} />
                        }
                        <button
                          onClick={() => removeExtra(i)}
                          style={{
                            position: 'absolute', top: -5, right: -5,
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#ff5555', border: 'none', cursor: 'pointer',
                            fontSize: 11, color: '#fff', lineHeight: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >×</button>
                        {isVid && (
                          <div style={{ position: 'absolute', bottom: 2, left: 3, fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>▶</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Multi-upload drop zone */}
              <MultiUpload
                accept="all"
                onAdd={urls => urls.forEach(addExtraImage)}
              />
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-inter), sans-serif' }}>
                Ctrl/Cmd ile birden fazla dosya seçebilirsiniz
              </p>
            </div>
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: '#ff5555', fontFamily: 'var(--font-inter), sans-serif' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Proje Ekle' : 'Değişiklikleri Kaydet'}
          </button>
          <button onClick={() => router.push('/studio/projeler')} className="btn-dark">İptal</button>
        </div>
      </div>
    </div>
  )
}
