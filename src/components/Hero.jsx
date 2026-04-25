import React, { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import './Hero.css'

/* ── Animated 3D-style floating tech icons ── */
function FloatingIcons() {
  const icons = [
    { icon: '⚛', label: 'React', x: 15, y: 20, size: 2.5, delay: 0 },
    { icon: '🍃', label: 'MongoDB', x: 80, y: 15, size: 2, delay: 0.5 },
    { icon: '🟨', label: 'JS', x: 88, y: 60, size: 2.2, delay: 1 },
    { icon: '☕', label: 'Java', x: 10, y: 70, size: 2, delay: 0.8 },
    { icon: '🐘', label: 'Node', x: 50, y: 10, size: 1.8, delay: 0.3 },
    { icon: '🎨', label: 'Figma', x: 75, y: 80, size: 1.9, delay: 1.2 },
    { icon: '📱', label: 'ReactNative', x: 20, y: 85, size: 2, delay: 0.6 },
    { icon: '🔷', label: 'Three.js', x: 55, y: 88, size: 1.7, delay: 1.5 },
  ]

  return (
    <div className="hero-icons">
      {icons.map((ic, i) => (
        <div
          key={i}
          className="hero-icon"
          style={{
            left: `${ic.x}%`,
            top: `${ic.y}%`,
            fontSize: `${ic.size}rem`,
            animationDelay: `${ic.delay}s`,
          }}
        >
          <span>{ic.icon}</span>
          <span className="icon-label">{ic.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Animated grid canvas ── */
function GridCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, nodes, animId

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      initNodes()
    }

    const initNodes = () => {
      nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.5)'
        ctx.fill()
      })
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 130)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" />
}

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="hero">
      <GridCanvas />
      <FloatingIcons />

      <div className={`hero-content section-container ${visible ? 'visible' : ''}`}>
        <div className="hero-greeting">
          <span className="hero-greeting-line" />
          <span>Hello, World! I'm</span>
        </div>

        <h1 className="hero-name">
          <span>Abaid-ul</span>
          <span className="hero-name-accent">Rehman</span>
        </h1>

        <div className="hero-role">
          <span className="role-prefix">// </span>
          <TypeAnimation
            sequence={[
              'Full-Stack Web Developer',
              2000,
              'MERN Stack Engineer',
              2000,
              'React Native Developer',
              2000,
              'UI/UX Enthusiast',
              2000,
              'Java Developer',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="role-text"
          />
        </div>

        <p className="hero-bio">
          Crafting <span className="highlight">immersive digital experiences</span> with modern web 
          technologies. From responsive frontends to robust backends — I build solutions that scale.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo('projects')}>
            View My Work <span>→</span>
          </button>
          <button className="btn-outline" onClick={() => scrollTo('contact')}>
            Get In Touch
          </button>
        </div>

        <div className="hero-stats">
          {[
            { num: '7+', label: 'Projects' },
            { num: '3+', label: 'Years Coding' },
            { num: '10+', label: 'Technologies' },
          ].map((s, i) => (
            <div key={i} className="hero-stat" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}
