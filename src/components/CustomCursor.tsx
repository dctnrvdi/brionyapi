'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    dot.style.display = 'block'
    ring.style.display = 'block'
    document.body.style.cursor = 'none'

    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove)

    let animId: number
    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      animId = requestAnimationFrame(tick)
    }
    tick()

    const grow = () => { dot.style.transform = 'translate(-50%,-50%) scale(3)' }
    const shrink = () => { dot.style.transform = 'translate(-50%,-50%) scale(1)' }

    const attach = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attach()

    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      observer.disconnect()
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        display: 'none',
        position: 'fixed',
        width: 8, height: 8,
        background: '#E07820',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.15s ease',
        left: 0, top: 0,
        willChange: 'left, top',
      }} />
      <div ref={ringRef} style={{
        display: 'none',
        position: 'fixed',
        width: 32, height: 32,
        border: '1px solid rgba(224,120,32,0.35)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        left: 0, top: 0,
        willChange: 'left, top',
      }} />
    </>
  )
}
