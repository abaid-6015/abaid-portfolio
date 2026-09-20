import React, { useState, useEffect } from 'react'
import './Navbar.css'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

const socials = [
  { icon: '💼', href: 'https://www.linkedin.com/in/abaid-ul-rehman6a8bb023a/', title: 'LinkedIn' },
  { icon: '🐙', href: 'https://github.com/abaid-6015', title: 'GitHub' },
  { icon: '💰', href: 'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share', title: 'Upwork' },
  { icon: '🟢', href: 'https://www.fiverr.com/abaidulrehman6', title: 'Fiverr' },
]

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
        if (el && window.scrollY >= el.offsetTop - 200) { setActive(sections[i]); break }
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
        <a href="#" className="nav-logo"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">AR</span>
          <span className="logo-bracket">/&gt;</span>
        </a>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link, i) => (
            <button key={link}
              className={`nav-link ${active === link.toLowerCase() ? 'active' : ''}`}
              onClick={() => scrollTo(link)}
              style={{ animationDelay: `${i * 0.07}s` }}>
              <span className="nav-num">0{i + 1}.</span>
              {link}
            </button>
          ))}
          <div className="nav-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="nav-social-icon" title={s.title}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <button className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}