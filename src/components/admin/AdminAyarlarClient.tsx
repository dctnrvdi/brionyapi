'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MediaUpload from './MediaUpload'

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border-subtle)', padding: 28 }}>
      <p style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 20, color: '#EBEBEB', letterSpacing: '0.06em', marginBottom: 22, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}

export default function AdminAyarlarClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const init = (key: string, fallback = '') => settings[key] || fallback
  const [form, setForm] = useState<Record<string, string>>({
    logo_url: init('logo_url'),
    favicon_url: init('favicon_url'),
    hero_title: init('hero_title', 'Güçlü\nTemeller,\nKalıcı Yapılar.'),
    hero_subtitle: init('hero_subtitle'),
    hero_video_url: init('hero_video_url'),
    hero_image_url: init('hero_image_url'),
    cta_title: init('cta_title', 'PROJENİZİ\nBİRLİKTE\nGERÇEKLEŞTİRELİM.'),
    projects_section_label: init('projects_section_label', 'Seçili Çalışmalar'),
    projects_section_title: init('projects_section_title', 'ÖNE ÇIKAN PROJELER'),
    marquee_items: init('marquee_items', 'İNŞAAT,PROJE YÖNETİMİ,MÜHENDİSLİK,ALTYAPI,KONUT,TİCARİ YAPI,RENOVASYON,PROJE GELİŞTİRME'),
    vision_statement: init('vision_statement', 'Yeni Nesil\nYapım\nAnlayışı.'),
    vision_text: init('vision_text', 'Deneyimin yerini vizyon alıyor. Brion Yapı, inşaat sektörüne taze bir bakış açısı, ileri teknoloji ve müşteri odaklı anlayışla yeni bir soluk getiriyor.'),
    pillar_1_title: init('pillar_1_title', 'İLERİ GÖRÜŞLÜ'),
    pillar_1_desc: init('pillar_1_desc', 'Yarının şehirlerini bugünden planlıyoruz. Her projede uzun vadeli değer ve sürdürülebilirlik önceliğimiz.'),
    pillar_2_title: init('pillar_2_title', 'KALİTE ODAKLI'),
    pillar_2_desc: init('pillar_2_desc', 'Malzeme seçiminden son detaya kadar ödün vermez standartlar. İlk seferinde doğru yapmak bizim için bir alışkanlık.'),
    pillar_3_title: init('pillar_3_title', 'ŞEFFAF ORTAKLIK'),
    pillar_3_desc: init('pillar_3_desc', 'Sürecin her adımında müşterilerimizle açık, dürüst ve güvene dayalı bir iletişim kuruyoruz.'),
    pillar_4_title: init('pillar_4_title', 'YENİLİKÇİ ÇÖZÜMLER'),
    pillar_4_desc: init('pillar_4_desc', 'Sektörü taze bir bakış açısıyla yeniden yorumluyoruz. Geleneksel inşaatı modern teknolojiyle buluşturuyoruz.'),
    services_label: init('services_label', 'Hizmetlerimiz'),
    services_title: init('services_title', 'Uzmanlık Alanlarımız'),
    service_1_title: init('service_1_title'), service_1_desc: init('service_1_desc'),
    service_2_title: init('service_2_title'), service_2_desc: init('service_2_desc'),
    service_3_title: init('service_3_title'), service_3_desc: init('service_3_desc'),
    service_4_title: init('service_4_title'), service_4_desc: init('service_4_desc'),
    about_page_title: init('about_page_title', 'İNŞA ET\n+ TESLİM ET'),
    about_page_subtitle: init('about_page_subtitle', 'Tasarımdan teslimata kadar her adımı sahiplenen bir inşaat şirketi.'),
    about_tab_1_label: init('about_tab_1_label', 'NEDEN?'),
    about_tab_1_body:  init('about_tab_1_body',  'Yapı kalitesi tartışılmaz. Biz bunu standart kabul ediyoruz. Her projede müşterimizin güvenini kazanmak için işe mükemmeliyetten başlıyoruz.'),
    about_tab_1_video: init('about_tab_1_video'),
    about_tab_1_image: init('about_tab_1_image'),
    about_tab_2_label: init('about_tab_2_label', 'YAKLAŞIM'),
    about_tab_2_body:  init('about_tab_2_body',  'Her proje özgün. Arsamı, programı, yaşam biçimini dinliyoruz. Tek tip çözümler değil, size özel bir strateji geliştiriyoruz.'),
    about_tab_2_video: init('about_tab_2_video'),
    about_tab_2_image: init('about_tab_2_image'),
    about_tab_3_label: init('about_tab_3_label', 'SÜREÇ'),
    about_tab_3_body:  init('about_tab_3_body',  'Projelendirmeden teslimata tek elden. Sürpriz yok, gecikme yok. Sürecin her adımında sizi bilgilendiriyor, şeffaf bir ortaklık kuruyoruz.'),
    about_tab_3_video: init('about_tab_3_video'),
    about_tab_3_image: init('about_tab_3_image'),
    about_tab_4_label: init('about_tab_4_label', 'TASARIM'),
    about_tab_4_body:  init('about_tab_4_body',  'Modern mimari. Kalıcı malzeme. Uzun ömürlü yatırım. Estetik ile fonksiyonelliği bir arada sunan mekanlar tasarlıyoruz.'),
    about_tab_4_video: init('about_tab_4_video'),
    about_tab_4_image: init('about_tab_4_image'),
    contact_phone: init('contact_phone'), contact_email: init('contact_email'), contact_address: init('contact_address'),
    footer_phone: init('footer_phone'), footer_email: init('footer_email'), footer_address: init('footer_address'), footer_tagline: init('footer_tagline'),
    social_instagram: init('social_instagram'),
    social_linkedin:  init('social_linkedin'),
    social_x:         init('social_x'),
  })

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const foc = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = '#E07820' }
  const blu = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)' }
  const setUrl = (key: string) => (url: string) => setForm(p => ({ ...p, [key]: url }))

  const [saveError, setSaveError] = useState('')

  const handleSubmit = async () => {
    setLoading(true); setSaved(false); setSaveError('')
    try {
      const res = await fetch('/api/ayarlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSaved(true); router.refresh(); setTimeout(() => setSaved(false), 3000) }
      else { const d = await res.json().catch(() => ({})); setSaveError(d.error || `Hata: ${res.status}`) }
    } catch (e) { setSaveError('Bağlantı hatası.') }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07820', marginBottom: 6 }}>Yönetim</p>
        <h1 style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 44, color: '#EBEBEB', letterSpacing: '0.04em' }}>SİTE AYARLARI</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860 }}>

        {/* Marka */}
        <Section title="Marka Kimliği">
          <div><label style={L}>Logo</label><MediaUpload value={form.logo_url} onChange={setUrl('logo_url')} accept="image" /></div>
          <div><label style={L}>Favicon</label><MediaUpload value={form.favicon_url} onChange={setUrl('favicon_url')} accept="image" /></div>
        </Section>

        {/* Hero */}
        <Section title="Ana Sayfa Hero">
          <div><label style={L}>Başlık (satır için \n kullanın)</label><textarea name="hero_title" value={form.hero_title} onChange={hc} rows={2} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'none' }} /></div>
          <div><label style={L}>Alt Başlık</label><textarea name="hero_subtitle" value={form.hero_subtitle} onChange={hc} rows={3} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'vertical' }} /></div>
          <div><label style={L}>Hero Video (öncelikli)</label><MediaUpload value={form.hero_video_url} onChange={setUrl('hero_video_url')} accept="video" /></div>
          <div><label style={L}>Hero Görsel (video yoksa)</label><MediaUpload value={form.hero_image_url} onChange={setUrl('hero_image_url')} accept="image" /></div>
        </Section>

        {/* Marquee */}
        <Section title="Marquee Bandı">
          <div>
            <label style={L}>Öğeler (virgülle ayırın)</label>
            <input name="marquee_items" value={form.marquee_items} onChange={hc} onFocus={foc} onBlur={blu} style={I} placeholder="İNŞAAT,PROJE YÖNETİMİ,MÜHENDİSLİK..." />
          </div>
        </Section>

        {/* Projects section */}
        <Section title="Öne Çıkan Projeler Bölümü">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div><label style={L}>Üst Etiket</label><input name="projects_section_label" value={form.projects_section_label} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            <div><label style={L}>Bölüm Başlığı</label><input name="projects_section_title" value={form.projects_section_title} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          </div>
        </Section>

        {/* CTA */}
        <Section title="CTA Bölümü (Alt Alan)">
          <div>
            <label style={L}>CTA Başlığı (satır için \n kullanın)</label>
            <textarea name="cta_title" value={form.cta_title} onChange={hc} rows={3} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'none' }} />
          </div>
        </Section>

        {/* Vizyon */}
        <Section title="Vizyon Bölümü">
          <div><label style={L}>Manifesto Başlığı (satır için \n kullanın)</label><textarea name="vision_statement" value={form.vision_statement} onChange={hc} rows={3} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'none' }} /></div>
          <div><label style={L}>Açıklama Metni</label><textarea name="vision_text" value={form.vision_text} onChange={hc} rows={3} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'vertical' }} /></div>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <div><label style={L}>Başlık {n}</label><input name={`pillar_${n}_title`} value={form[`pillar_${n}_title`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
              <div><label style={L}>Açıklama {n}</label><input name={`pillar_${n}_desc`} value={form[`pillar_${n}_desc`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            </div>
          ))}
        </Section>

        {/* Services */}
        <Section title="Hizmetlerimiz">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={L}>Bölüm Etiketi</label><input name="services_label" value={form.services_label} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            <div><label style={L}>Bölüm Başlığı</label><input name="services_title" value={form.services_title} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          </div>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <div><label style={L}>Hizmet {n} Başlık</label><input name={`service_${n}_title`} value={form[`service_${n}_title`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
              <div><label style={L}>Hizmet {n} Açıklama</label><input name={`service_${n}_desc`} value={form[`service_${n}_desc`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            </div>
          ))}
        </Section>

        {/* Hakkımızda */}
        <Section title="Hakkımızda Sayfası">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={L}>Sayfa Başlığı (\n ile satır böl)</label><textarea name="about_page_title" value={form.about_page_title} onChange={hc} rows={2} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'none' }} /></div>
            <div><label style={L}>Alt Başlık</label><textarea name="about_page_subtitle" value={form.about_page_subtitle} onChange={hc} rows={2} onFocus={foc} onBlur={blu} style={{ ...I, resize: 'none' }} /></div>
          </div>
          <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>Sekmeler (01 – 04)</p>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div><label style={L}>Sekme {n} Başlık</label><input name={`about_tab_${n}_label`} value={form[`about_tab_${n}_label`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
                <div><label style={L}>Sekme {n} Metin</label><input name={`about_tab_${n}_body`} value={form[`about_tab_${n}_body`]} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={L}>Sekme {n} Video</label><MediaUpload value={form[`about_tab_${n}_video`]} onChange={setUrl(`about_tab_${n}_video`)} accept="video" /></div>
                <div><label style={L}>Sekme {n} Görsel (video yoksa)</label><MediaUpload value={form[`about_tab_${n}_image`]} onChange={setUrl(`about_tab_${n}_image`)} accept="image" /></div>
              </div>
            </div>
          ))}
        </Section>

        {/* İletişim */}
        <Section title="İletişim Bilgileri">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={L}>Telefon</label><input name="contact_phone" value={form.contact_phone} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            <div><label style={L}>E-posta</label><input name="contact_email" value={form.contact_email} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          </div>
          <div><label style={L}>Adres</label><input name="contact_address" value={form.contact_address} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
        </Section>

        {/* Footer */}
        <Section title="Footer">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={L}>Telefon</label><input name="footer_phone" value={form.footer_phone} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
            <div><label style={L}>E-posta</label><input name="footer_email" value={form.footer_email} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          </div>
          <div><label style={L}>Adres</label><input name="footer_address" value={form.footer_address} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          <div><label style={L}>Alt Slogan</label><input name="footer_tagline" value={form.footer_tagline} onChange={hc} onFocus={foc} onBlur={blu} style={I} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div><label style={L}>Instagram URL</label><input name="social_instagram" value={form.social_instagram} onChange={hc} onFocus={foc} onBlur={blu} style={I} placeholder="https://instagram.com/..." /></div>
            <div><label style={L}>LinkedIn URL</label><input name="social_linkedin" value={form.social_linkedin} onChange={hc} onFocus={foc} onBlur={blu} style={I} placeholder="https://linkedin.com/..." /></div>
            <div><label style={L}>X (Twitter) URL</label><input name="social_x" value={form.social_x} onChange={hc} onFocus={foc} onBlur={blu} style={I} placeholder="https://x.com/..." /></div>
          </div>
        </Section>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', padding: '13px 36px' }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {saved && <p style={{ fontSize: 12, color: '#E07820', fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600 }}>✓ Kaydedildi</p>}
          {saveError && <p style={{ fontSize: 12, color: '#ff5555', fontFamily: 'var(--font-syne), sans-serif' }}>✗ {saveError}</p>}
        </div>
      </div>
    </div>
  )
}
