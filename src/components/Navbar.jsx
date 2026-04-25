import React, { useState, useEffect } from 'react'
import './Navbar.css'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = links.map(l => l.toLowerCase())
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActive(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}) }}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">AR</span>
          <span className="logo-bracket">/&gt;</span>
        </a>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link, i) => (
            <button
              key={link}
              className={`nav-link ${active === link.toLowerCase() ? 'active' : ''}`}
              onClick={() => scrollTo(link)}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="nav-num">0{i + 1}.</span>
              {link}
            </button>
          ))}
          <a
            href="/Abaid-ul-Rehman-CV.pdf"
            download
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume ↓
          </a>
        </div>

        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
