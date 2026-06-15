import React, { useEffect, useRef } from 'react'

interface AnimatedNetworkBackgroundProps {
  theme: 'light' | 'dark'
}

export const AnimatedNetworkBackground: React.FC<AnimatedNetworkBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // ── Config — tuned for large, dramatic, full-height bundles ──────────────
    const LINES_PER_SIDE = 32  // midpoint density
    const STEPS = 340          // smoothness

    let time = 0

    // Energy envelope: smoothstep fade from corner toward center.
    // Waves extend up to 68% across the width (was 52%) — much more present.
    const ENERGY_REACH = 0.60

    const energy = (px: number, side: 'left' | 'right') => {
      const ratio = side === 'left' ? px / width : (width - px) / width
      if (ratio >= ENERGY_REACH) return 0
      const x = ratio / ENERGY_REACH
      // smooth-step: starts and ends gently, stays strong in the middle
      return 1 - x * x * (3 - 2 * x)
    }

    const drawBundle = (side: 'left' | 'right', isDark: boolean) => {
      for (let i = 0; i < LINES_PER_SIDE; i++) {
        const t = i / (LINES_PER_SIDE - 1)  // 0 = outermost, 1 = topmost

        // Vertical range: outermost lines at screen bottom, innermost reach ~42% from top
        const baseY  = height * (1.05 - t * 0.63)  // 105% down to 42% of height

        // Amplitude: outer lines swing boldly, inner lines tighter
        const amp1   = 26 + (1 - t) * 112          // 26–138 px
        const amp2   = 8  + (1 - t) * 44           // secondary harmonic
        const amp3   = 4  + (1 - t) * 16           // tertiary micro-wobble

        const freq1  = 1.1 + t * 0.9               // 1.1–2.0 cycles
        const freq2  = freq1 * 2.2
        const freq3  = freq1 * 4.0

        const speed  = 0.11 + t * 0.14             // gentle movement
        const phase1 = t * Math.PI * 2.4
        const phase2 = t * Math.PI * 1.2 + 1.0
        const phase3 = t * Math.PI * 0.9 + 2.0

        // Opacity: outer lines are bold, inner lines whisper
        const maxOpacity = (isDark ? 0.28 : 0.35) * (1 - t * 0.59)
        const lw = 0.5 + (1 - t) * 1.35           // 0.5–1.85 px

        for (let s = 0; s < STEPS; s++) {
          const tx0 = s / STEPS
          const tx1 = (s + 1) / STEPS

          const px0 = side === 'left' ? tx0 * width : (1 - tx0) * width
          const px1 = side === 'left' ? tx1 * width : (1 - tx1) * width

          const e0 = energy(px0, side)
          const e1 = energy(px1, side)
          const avgE = (e0 + e1) * 0.5

          if (avgE <= 0.002) continue

          const alpha = maxOpacity * avgE

          const y0 = baseY
            + Math.sin(tx0 * freq1 * Math.PI * 2 + phase1 + time * speed)          * amp1 * e0
            + Math.sin(tx0 * freq2 * Math.PI * 2 - phase2 + time * speed * 1.7)    * amp2 * e0
            + Math.sin(tx0 * freq3 * Math.PI * 2 + phase3 + time * speed * 0.6)    * amp3 * e0

          const y1v = baseY
            + Math.sin(tx1 * freq1 * Math.PI * 2 + phase1 + time * speed)          * amp1 * e1
            + Math.sin(tx1 * freq2 * Math.PI * 2 - phase2 + time * speed * 1.7)    * amp2 * e1
            + Math.sin(tx1 * freq3 * Math.PI * 2 + phase3 + time * speed * 0.6)    * amp3 * e1

          ctx.beginPath()
          ctx.moveTo(px0, y0)
          ctx.lineTo(px1, y1v)
          ctx.strokeStyle = isDark
            ? `rgba(249,115,22,${alpha})`
            : `rgba(195,52,5,${alpha})`
          ctx.lineWidth = lw
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      time += 0.004
      const isDark = themeRef.current === 'dark'

      ctx.fillStyle = isDark ? '#0c0a09' : '#fdf9f6'
      ctx.fillRect(0, 0, width, height)

      drawBundle('left',  isDark)
      drawBundle('right', isDark)

      // ── Soft top fade — uses real bg color so no black fringe ─────────────
      // Only covers the top 35% so the waves can show tall & large.
      const bgR = isDark ? 12  : 253
      const bgG = isDark ? 10  : 249
      const bgB = isDark ? 9   : 246

      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.49)
      topFade.addColorStop(0,    `rgba(${bgR},${bgG},${bgB},1)`)
      topFade.addColorStop(0.60, `rgba(${bgR},${bgG},${bgB},0.65)`)
      topFade.addColorStop(1,    `rgba(${bgR},${bgG},${bgB},0)`)
      ctx.fillStyle = topFade
      ctx.fillRect(0, 0, width, height * 0.49)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none block"
    />
  )
}
