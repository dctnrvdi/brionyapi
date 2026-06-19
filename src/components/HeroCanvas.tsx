'use client'
import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    let W = 0, H = 0
    let animId: number
    const mouse = { x: -9999, y: -9999 }
    const COUNT = window.innerWidth < 768 ? 60 : 110
    const MAX_DIST = 140
    const ACCENT = '224,120,32'

    type Particle = { x: number; y: number; vx: number; vy: number; r: number }
    let particles: Particle[] = []

    function resize() {
      W = canvas!.width = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
    }
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMouseMove)

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * (W || window.innerWidth),
        y: Math.random() * (H || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.4,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / MAX_DIST) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        // Mouse lines
        const mdx = particles[i].x - mouse.x
        const mdy = particles[i].y - mouse.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < MAX_DIST * 1.6) {
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - md / (MAX_DIST * 1.6)) * 0.35})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      particles.forEach(p => {
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < 100) { p.vx += (mdx / md) * 0.012; p.vy += (mdy / md) * 0.012 }
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.1) { p.vx = (p.vx / spd) * 1.1; p.vy = (p.vy / spd) * 1.1 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        p.x = Math.max(0, Math.min(W, p.x))
        p.y = Math.max(0, Math.min(H, p.y))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT},0.55)`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, opacity: 0.55,
        pointerEvents: 'none',
      }}
    />
  )
}
