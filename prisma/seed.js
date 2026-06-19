'use strict'
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('brion2024!', 12)

  await prisma.adminUser.upsert({
    where: { email: 'admin@brionyapi.com' },
    update: { password: hashed },
    create: { email: 'admin@brionyapi.com', password: hashed, name: 'Brion Admin' },
  })

  const projects = [
    {
      title: 'Vega Residence',
      slug: 'vega-residence',
      category: 'Konut',
      location: 'İstanbul, Ataşehir',
      year: 2024,
      area: '4.200 m²',
      description: 'Modernliği doğayla buluşturan, üst segment yaşam alanları.',
      coverImage: '',
      images: '[]',
      featured: true,
      order: 1,
    },
    {
      title: 'Nexus Business Center',
      slug: 'nexus-business-center',
      category: 'Ticari',
      location: 'İstanbul, Maslak',
      year: 2024,
      area: '9.800 m²',
      description: 'Akıllı bina teknolojileri ile donatılmış A+ ofis kompleksi.',
      coverImage: '',
      images: '[]',
      featured: true,
      order: 2,
    },
    {
      title: 'Orion Tower',
      slug: 'orion-tower',
      category: 'Karma',
      location: 'İzmir, Bayraklı',
      year: 2023,
      area: '16.500 m²',
      description: 'Konut ve ticari fonksiyonları bir arada sunan prestijli kule.',
      coverImage: '',
      images: '[]',
      featured: true,
      order: 3,
    },
    {
      title: 'Azur Villa Kompleksi',
      slug: 'azur-villa-kompleksi',
      category: 'Konut',
      location: 'Muğla, Bodrum',
      year: 2023,
      area: '2.600 m²',
      description: 'Ege\'nin eşsiz manzarasıyla bütünleşen lüks villa projesi.',
      coverImage: '',
      images: '[]',
      featured: false,
      order: 4,
    },
  ]

  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: p })
  }

  const testimonials = [
    {
      author: 'Mehmet Yılmaz',
      role: 'Genel Müdür',
      company: 'Nexus Group',
      content: 'Brion Yapı ile çalışmak hem profesyonel hem de güven verici bir deneyimdi. Taahhütlerine her zaman sadık kaldılar.',
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      author: 'Ayşe Kara',
      role: 'Mimar',
      company: 'AK Design Studio',
      content: 'Proje sürecinin her aşamasında titiz ve şeffaf bir iletişim sergilediler. Kalite standartları gerçekten üst düzey.',
      rating: 5,
      featured: true,
      order: 2,
    },
    {
      author: 'Can Demir',
      role: 'Yatırımcı',
      company: '',
      content: 'Zamanında teslim, söz verilen kalite. Brion Yapı\'nın işçiliğinden son derece memnunum.',
      rating: 5,
      featured: true,
      order: 3,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {})
  }

  const settings = [
    { key: 'hero_title', value: 'Güçlü Temeller,\nKalıcı Yapılar.' },
    { key: 'hero_subtitle', value: 'Konut ve ticari projelerde mühendislik mükemmelliği ile değer yaratıyoruz.' },
    { key: 'hero_video_url', value: '' },
    { key: 'hero_image_url', value: '' },
    { key: 'stat_1_value', value: '15+' },
    { key: 'stat_1_label', value: 'Yıl Deneyim' },
    { key: 'stat_2_value', value: '200+' },
    { key: 'stat_2_label', value: 'Tamamlanan Proje' },
    { key: 'stat_3_value', value: '120K+' },
    { key: 'stat_3_label', value: 'İnşaat Alanı m²' },
    { key: 'stat_4_value', value: '%98' },
    { key: 'stat_4_label', value: 'Müşteri Memnuniyeti' },
    { key: 'contact_phone', value: '+90 212 000 00 00' },
    { key: 'contact_email', value: 'info@brionyapi.com' },
    { key: 'contact_address', value: 'İstanbul, Türkiye' },
    { key: 'footer_phone', value: '+90 212 000 00 00' },
    { key: 'footer_email', value: 'info@brionyapi.com' },
    { key: 'footer_address', value: 'İstanbul, Türkiye' },
    { key: 'footer_tagline', value: 'Mühendislik · Güven · Kalıcılık' },
    { key: 'services_label', value: 'Hizmetlerimiz' },
    { key: 'services_title', value: 'Uzmanlık Alanlarımız' },
    { key: 'service_1_title', value: 'Konut İnşaatı' },
    { key: 'service_1_desc', value: 'Villadan rezidansa, her ölçekte prestijli konut projeleri.' },
    { key: 'service_2_title', value: 'Ticari Yapılar' },
    { key: 'service_2_desc', value: 'Ofis binaları, AVM ve endüstriyel tesisler.' },
    { key: 'service_3_title', value: 'Altyapı Projeleri' },
    { key: 'service_3_desc', value: 'Yol, köprü ve kentsel dönüşüm projeleri.' },
    { key: 'service_4_title', value: 'Proje Yönetimi' },
    { key: 'service_4_desc', value: 'Anahtar teslim çözümler ve inşaat danışmanlığı.' },
    { key: 'about_hero_title1', value: 'İnşaatı Bir' },
    { key: 'about_hero_title2', value: 'Sanat Olarak' },
    { key: 'about_hero_title3', value: 'Görüyoruz.' },
    { key: 'about_story_title', value: '15 Yılı Aşkın Deneyim' },
    { key: 'about_story_text1', value: '2009 yılında İstanbul\'da kurulan Brion Yapı, bugün konut, ticari ve karma proje alanlarında Türkiye\'nin önde gelen inşaat firmalarından biri konumundadır.' },
    { key: 'about_story_text2', value: 'Her projede mühendislik mükemmelliğini tasarım estetiğiyle buluşturuyor; zamanında teslim ve üstün kalite anlayışımızla müşterilerimize değer katıyoruz.' },
    { key: 'logo_url', value: '' },
    { key: 'favicon_url', value: '' },
  ]

  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  console.log('✅ Seed tamamlandı.')
  console.log('   Admin: admin@brionyapi.com')
  console.log('   Şifre: brion2024!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
