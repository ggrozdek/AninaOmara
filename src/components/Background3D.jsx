import { useEffect, useRef } from 'react'

export default function Background3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const lines = Array.from({ length: 8 }, (_, i) => ({
      x1: Math.random() * w,
      y1: Math.random() * h,
      x2: Math.random() * w,
      y2: Math.random() * h,
      vx1: (Math.random() - 0.5) * 0.4,
      vy1: (Math.random() - 0.5) * 0.4,
      vx2: (Math.random() - 0.5) * 0.4,
      vy2: (Math.random() - 0.5) * 0.4,
      hue: i * 45,
    }))

    let lastTime = 0
    const draw = (ts = 0) => {
      animId = requestAnimationFrame(draw)
      if (ts - lastTime < 33) return  // cap at ~30fps
      lastTime = ts
      ctx.clearRect(0, 0, w, h)

      // Subtle grid
      ctx.strokeStyle = 'rgba(192,132,252,0.03)'
      ctx.lineWidth = 1
      const gridSize = 80
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Floating lines
      lines.forEach((l) => {
        l.x1 += l.vx1; l.y1 += l.vy1
        l.x2 += l.vx2; l.y2 += l.vy2
        if (l.x1 < 0 || l.x1 > w) l.vx1 *= -1
        if (l.y1 < 0 || l.y1 > h) l.vy1 *= -1
        if (l.x2 < 0 || l.x2 > w) l.vx2 *= -1
        if (l.y2 < 0 || l.y2 > h) l.vy2 *= -1

        const grad = ctx.createLinearGradient(l.x1, l.y1, l.x2, l.y2)
        grad.addColorStop(0, `hsla(${l.hue + 270}, 70%, 70%, 0.06)`)
        grad.addColorStop(1, `hsla(${l.hue + 300}, 70%, 80%, 0.01)`)
        ctx.beginPath()
        ctx.moveTo(l.x1, l.y1)
        ctx.lineTo(l.x2, l.y2)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,132,252,${p.opacity})`
        ctx.fill()
      })

      // Connect nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(192,132,252,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

    }

    draw()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
