'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Project = {
  id: number; title: string; slug: string; category: string
  location: string; year: number; featured: boolean; order: number; coverImage: string
}

export default function AdminProjelerClient({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial)
  const [deleting, setDeleting] = useState<number | null>(null)
  const router = useRouter()

  const deleteProject = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return
    setDeleting(id)
    await fetch(`/api/projeler/${id}`, { method: 'DELETE' })
    setProjects(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= projects.length) return
    const updated = [...projects]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    // Sırayı güncelle
    const newOrders = updated.map((p, i) => ({ id: p.id, order: i + 1 }))
    setProjects(updated.map((p, i) => ({ ...p, order: i + 1 })))
    for (const { id, order } of newOrders) {
      await fetch(`/api/projeler/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated.find(p => p.id === id), order }),
      })
    }
    router.refresh()
  }

  const L: React.CSSProperties = {
    fontFamily: 'var(--font-syne), sans-serif',
    fontSize: 9, fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: '#E07820', marginBottom: 6,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={L}>Portföy</p>
          <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 44, color: '#EBEBEB', letterSpacing: '0.04em' }}>PROJELER</h1>
        </div>
        <Link href="/studio/projeler/yeni" className="btn-gold">+ Yeni Proje</Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Henüz proje eklenmemiş.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-subtle)' }}>
          {projects.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'var(--dark-2)', padding: '16px 20px',
              transition: 'background 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--dark-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--dark-2)')}
            >
              {/* Order buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button onClick={() => moveOrder(i, -1)} disabled={i === 0} style={{ background: 'none', border: '1px solid var(--border-subtle)', color: i === 0 ? 'var(--text-muted)' : '#E07820', cursor: i === 0 ? 'not-allowed' : 'pointer', width: 20, height: 18, fontSize: 9, lineHeight: 1 }}>▲</button>
                <button onClick={() => moveOrder(i, 1)} disabled={i === projects.length - 1} style={{ background: 'none', border: '1px solid var(--border-subtle)', color: i === projects.length - 1 ? 'var(--text-muted)' : '#E07820', cursor: i === projects.length - 1 ? 'not-allowed' : 'pointer', width: 20, height: 18, fontSize: 9, lineHeight: 1 }}>▼</button>
              </div>

              {/* Thumbnail */}
              <div style={{ width: 56, height: 40, flexShrink: 0, background: 'var(--dark-4)', overflow: 'hidden' }}>
                {p.coverImage && <img src={p.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 12, fontWeight: 700, color: '#EBEBEB', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>{p.category} · {p.location} · {p.year}</p>
              </div>

              {/* Featured badge */}
              {p.featured && (
                <div style={{ padding: '3px 8px', background: 'rgba(224,120,32,0.08)', border: '1px solid rgba(224,120,32,0.2)', flexShrink: 0 }}>
                  <span style={{ fontSize: 8, fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E07820' }}>Öne Çıkan</span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link href={`/studio/projeler/${p.id}`} style={{
                  padding: '7px 14px',
                  background: 'var(--dark-4)', border: '1px solid var(--border-subtle)',
                  color: '#EBEBEB', textDecoration: 'none',
                  fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600,
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#E07820')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >Düzenle</Link>
                <button onClick={() => deleteProject(p.id)} disabled={deleting === p.id} style={{
                  padding: '7px 14px',
                  background: 'none', border: '1px solid rgba(255,85,85,0.2)',
                  color: '#ff5555', cursor: 'pointer',
                  fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600,
                  transition: 'border-color 0.2s',
                  opacity: deleting === p.id ? 0.5 : 1,
                }}>
                  {deleting === p.id ? '...' : 'Sil'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
