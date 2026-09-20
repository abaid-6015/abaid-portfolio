import React from 'react'
import './Footer.css'

const socials = [
  { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/' },
  { icon: '🐙', label: 'GitHub', href: 'https://github.com/abaid-6015' },
  { icon: '💰', label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share' },
  { icon: '🟢', label: 'Fiverr', href: 'https://www.fiverr.com/abaid_bse' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="footer-inner section-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-bracket">&lt;</span>
              <span>AR</span>
              <span className="logo-bracket">/&gt;</span>
            </div>
            <p className="footer-tagline">Building digital experiences with passion &amp; precision</p>
            <div className="footer-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social" title={s.label}>
                  <span>{s.icon}</span><span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-link-group">
              <div className="footer-link-title">Navigation</div>
              {['About','Skills','Projects','Experience','Contact'].map(link => (
                <button key={link} className="footer-link"
                  onClick={() => scrollTo(link.toLowerCase())}>{link}</button>
              ))}
            </div>
            <div className="footer-link-group">
              <div className="footer-link-title">Live Projects</div>
              <a href="https://restaurant-reservation-system-react-seven.vercel.app/home"
                target="_blank" rel="noopener noreferrer" className="footer-link">
                Restaurant Reservation ↗
              </a>
              <a href="https://github.com/abaid-6015" target="_blank"
                rel="noopener noreferrer" className="footer-link">GitHub Repos ↗</a>
            </div>
            <div className="footer-link-group">
              <div className="footer-link-title">Contact</div>
              <a href="mailto:abaidbse@gmail.com" className="footer-link">abaidbse@gmail.com</a>
              <a href="tel:+923281632432" className="footer-link">+92 328 1632432</a>
              <span className="footer-link no-link">Gujranwala, Pakistan</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">
            <span>© {year} Abaid-ul-Rehman. Crafted with</span>
            <span className="footer-heart">❤</span>
            <span>using React &amp; Node.js</span>
          </div>
          <div className="footer-stack">
            <span>React</span><span className="footer-sep">·</span>
            <span>Node.js</span><span className="footer-sep">·</span>
            <span>MongoDB</span><span className="footer-sep">·</span>
            <span>Vercel</span>
          </div>
        </div>
      </div>
      <div className="footer-glow" />
    </footer>
  )
}