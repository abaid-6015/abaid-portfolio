import React, { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import './Hero.css'

const socials = [
  { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/abaid-ul-rehman6a8bb023a/' },
  { icon: '🐙', label: 'GitHub', href: 'https://github.com/abaid-6015' },
  { icon: '💰', label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share' },
  { icon: '🟢', label: 'Fiverr', href: 'https://www.fiverr.com/abaidulrehman6' },
]

function ProfilePhoto() {
  return (
    <div className="hero-photo-wrap">
      <div className="hero-photo-ring hero-photo-ring-1" />
      <div className="hero-photo-ring hero-photo-ring-2" />
      <div className="hero-photo-orb" />
      <div className="hero-photo-container">
        <img src="/profile.jpg" alt="Abaid-ul-Rehman" className="hero-photo"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        <div className="hero-photo-fallback" style={{ display: 'none' }}><span>AR</span></div>
      </div>
      <div className="hero-status-badge">
        <span className="status-dot" />
        <span>Available for work</span>
      </div>
    </div>
  )
}

function FloatingIcons() {
  const icons = [
    { icon: '⚛', label: 'React', x: 8, y: 18, size: 2.3, delay: 0 },
    { icon: '🍃', label: 'MongoDB', x: 82, y: 12, size: 2, delay: 0.5 },
    { icon: '🟨', label: 'JS', x: 90, y: 58, size: 2.2, delay: 1 },
    { icon: '☕', label: 'Java', x: 6, y: 68, size: 2, delay: 0.8 },
    { icon: '🐘', label: 'Node', x: 48, y: 8, size: 1.8, delay: 0.3 },
    { icon: '🎮', label: 'Unity', x: 78, y: 82, size: 1.9, delay: 1.2 },
    { icon: '📱', label: 'ReactNative', x: 18, y: 88, size: 2, delay: 0.6 },
    { icon: '🔷', label: 'Three.js', x: 55, y: 90, size: 1.7, delay: 1.5 },
    { icon: '🎨', label: 'Figma', x: 70, y: 30, size: 1.6, delay: 0.9 },
  ]
  return (
    <div className="hero-icons">
      {icons.map((ic, i) => (
        <div key={i} className="hero-icon"
          style={{ left: `${ic.x}%`, top: `${ic.y}%`, fontSize: `${ic.size}rem`, animationDelay: `${ic.delay}s` }}>
          <span>{ic.icon}</span>
          <span className="icon-label">{ic.label}</span>
        </div>
      ))}
    </div>
  )
}

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
      nodes = Array.from({ length: 70 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.45)'; ctx.fill()
      })
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 130)})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="hero-canvas" />
}

export default function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="hero">
      <GridCanvas />
      <FloatingIcons />
      <div className={`hero-inner section-container ${visible ? 'visible' : ''}`}>
        <div className="hero-content">
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
                'Full-Stack Web Developer', 2000,
                'MERN Stack Engineer', 2000,
                'React Native Developer', 2000,
                'UI/UX Enthusiast', 2000,
                'Java Developer', 2000,
                'Game Developer (Unity)', 2000,
              ]}
              wrapper="span" speed={50} repeat={Infinity} className="role-text"
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
          <div className="hero-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="hero-social" title={s.label}
                style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                <span>{s.icon}</span>
                <span className="social-label">{s.label}</span>
              </a>
            ))}
          </div>
          <div className="hero-stats">
            {[
              { num: '8+', label: 'Projects' },
              { num: '3+', label: 'Years Coding' },
              { num: '12+', label: 'Technologies' },
            ].map((s, i) => (
              <div key={i} className="hero-stat" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-right">
          <ProfilePhoto />
        </div>
      </div>
      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}