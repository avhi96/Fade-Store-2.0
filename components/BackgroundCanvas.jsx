"use client"
import { useEffect, useRef } from "react"

export default function BackgroundCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const cx = cv.getContext("2d")

    let W, H

    const resize = () => {
      W = cv.width = window.innerWidth
      H = cv.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    class Pt {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.r = Math.random() * 1.5 + 0.5
        this.a = Math.random() * 0.5 + 0.1
        this.c = ["#63b3ed", "#9f7aea", "#4fd1c5"][Math.floor(Math.random()*3)]
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        cx.beginPath()
        cx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        cx.fillStyle = this.c
        cx.globalAlpha = this.a
        cx.fill()
        cx.globalAlpha = 1
      }
    }

    const pts = Array.from({ length: 120 }, () => new Pt())

    function lines() {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            cx.beginPath()
            cx.moveTo(pts[i].x, pts[i].y)
            cx.lineTo(pts[j].x, pts[j].y)
            cx.strokeStyle = "#63b3ed"
            cx.globalAlpha = (1 - d / 100) * 0.06
            cx.lineWidth = 0.5
            cx.stroke()
            cx.globalAlpha = 1
          }
        }
      }
    }

    function animate() {
      cx.clearRect(0, 0, W, H)
      lines()
      pts.forEach(p => {
        p.update()
        p.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}