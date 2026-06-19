'use client'

import { useState } from 'react'

type Message = {
  id: number; name: string; email: string; phone?: string | null
  subject: string; message: string; read: boolean
  createdAt: string | Date
}

export default function AdminMesajlarClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<Message | null>(null)

  const markRead = async (id: number) => {
    await fetch(`/api/mesajlar/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) })
    setMessages(p => p.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const del = async (id: number) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/mesajlar/${id}`, { method: 'DELETE' })
    setMessages(p => p.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const L: React.CSSProperties = {
    fontFamily: 'var(--font-syne), sans-serif',
    fontSize: 9, fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: '#E07820', marginBottom: 6,
  }

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={L}>İletişim Formu</p>
        <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 44, color: '#EBEBEB', letterSpacing: '0.04em' }}>MESAJLAR</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 2 }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-subtle)' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>Henüz mesaj yok.</div>
          ) : messages.map(m => (
            <div
              key={m.id}
              onClick={() => { setSelected(m); if (!m.read) markRead(m.id) }}
              style={{
                padding: '16px 20px', cursor: 'pointer',
                background: selected?.id === m.id ? 'var(--dark-3)' : 'var(--dark-2)',
                borderLeft: !m.read ? '2px solid #E07820' : '2px solid transparent',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (selected?.id !== m.id) (e.currentTarget as HTMLElement).style.background = 'var(--dark-3)' }}
              onMouseLeave={e => { if (selected?.id !== m.id) (e.currentTarget as HTMLElement).style.background = 'var(--dark-2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 12, fontWeight: 700, color: m.read ? '#EBEBEB' : '#E07820' }}>{m.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600 }}>← Kapat</button>
              <button onClick={() => del(selected.id)} style={{ background: 'none', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555', cursor: 'pointer', padding: '5px 12px', fontFamily: 'var(--font-syne), sans-serif', fontSize: 10, fontWeight: 600 }}>Sil</button>
            </div>

            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 16, fontWeight: 700, color: '#EBEBEB', marginBottom: 16 }}>{selected.subject}</h2>

            {[
              { label: 'Gönderen', value: selected.name },
              { label: 'E-posta', value: selected.email },
              { label: 'Telefon', value: selected.phone || '-' },
              { label: 'Tarih', value: new Date(selected.createdAt).toLocaleString('tr-TR') },
            ].map(item => (
              <div key={item.label} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 13, color: '#EBEBEB', fontFamily: 'var(--font-inter), sans-serif' }}>{item.value}</p>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Mesaj</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-inter), sans-serif' }}>{selected.message}</p>
            </div>

            <a href={`mailto:${selected.email}`} className="btn-gold" style={{ marginTop: 24, display: 'inline-flex', fontSize: 10 }}>
              Yanıtla →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
