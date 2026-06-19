'use client'

import { useState, useRef } from 'react'

type Props = {
  value: string
  onChange: (url: string) => void
  accept?: 'image' | 'video' | 'all'
}

export default function MediaUpload({ value, onChange, accept = 'all' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptStr = accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'

  const handleFile = async (file: File) => {
    setLoading(true); setError('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
      else setError('Yükleme başarısız.')
    } catch { setError('Yükleme başarısız.') }
    setLoading(false)
  }

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{
          border: '1px dashed rgba(255,255,255,0.12)',
          padding: '20px 16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          background: 'var(--dark-3)',
          transition: 'border-color 0.25s ease',
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.borderColor = '#E07820' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
      >
        <input ref={inputRef} type="file" accept={acceptStr} onChange={onInput} style={{ display: 'none' }} />
        {loading ? (
          <p style={{ fontSize: 12, color: '#E07820', fontFamily: 'var(--font-syne), sans-serif' }}>Yükleniyor...</p>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-syne), sans-serif', marginBottom: 4 }}>
              Dosyayı buraya sürükleyin veya tıklayın
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>
              {accept === 'image' ? 'JPG, PNG, WEBP' : accept === 'video' ? 'MP4, MOV' : 'Resim veya Video'}
            </p>
          </>
        )}
      </div>

      {error && <p style={{ marginTop: 6, fontSize: 11, color: '#ff5555' }}>{error}</p>}

      {value && (
        <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
          {value.match(/\.(mp4|mov|webm)$/i) ? (
            <video src={value} style={{ height: 60, maxWidth: 120, objectFit: 'cover', display: 'block' }} />
          ) : (
            <img src={value} alt="Önizleme" style={{ height: 60, maxWidth: 120, objectFit: 'cover', display: 'block' }} />
          )}
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: -6, right: -6,
              width: 18, height: 18, borderRadius: '50%',
              background: '#ff5555', border: 'none', cursor: 'pointer',
              fontSize: 10, color: '#fff', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}
    </div>
  )
}
