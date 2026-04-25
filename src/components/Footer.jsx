import React from 'react'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

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
            <p className="footer-tagline">
              Building digital experiences with passion &amp; precision
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-link-group">
              <div className="footer-link-title">Navigation</div>
              {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(link => (
                <button
                  key={link}
                  className="footer-link"
                  onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {link}
                </button>
              ))}
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
            <span>using React &amp; Three.js</span>
          </div>
          <div className="footer-stack">
            <span>React</span>
            <span className="footer-sep">·</span>
            <span>Node.js</span>
            <span className="footer-sep">·</span>
            <span>MongoDB</span>
            <span className="footer-sep">·</span>
            <span>Vercel</span>
          </div>
        </div>
      </div>

      <div className="footer-glow" />
    </footer>
  )
}
