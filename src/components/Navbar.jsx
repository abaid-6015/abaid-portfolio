import React, { useState, useEffect } from 'react'
import { FiLinkedin, FiGithub, FiMail } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import { getSocials, onUpdate } from '../store/dataStore'
import './Navbar.css'

const NAV = ['About','Skills','Projects','Experience','Contact']
const ICON_MAP = { linkedin:FiLinkedin, github:FiGithub, upwork:SiUpwork, fiverr:SiFiverr, mail:FiMail }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [active, setActive]     = useState('')
  const [socials, setSocials]   = useState(getSocials)

  useEffect(() => { const fn=()=>{ setScrolled(window.scrollY>50); for(let i=NAV.length-1;i>=0;i--){ const el=document.getElementById(NAV[i].toLowerCase()); if(el&&window.scrollY>=el.offsetTop-160){setActive(NAV[i].toLowerCase());break} } }; window.addEventListener('scroll',fn); return()=>window.removeEventListener('scroll',fn) },[])
  useEffect(() => onUpdate(()=>setSocials(getSocials())), [])

  const go = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:'smooth'}); setOpen(false) }

  return (
    <nav className={`nav ${scrolled?'nav--solid':''}`}>
      <div className="nav__inner wrap">
        <button className="nav__logo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L29 27H3L16 3Z" stroke="url(#nl)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
            <defs><linearGradient id="nl" x1="3" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse"><stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/></linearGradient></defs>
          </svg>
          <span className="nav__logo-text">AR</span>
        </button>
        <div className={`nav__links ${open?'nav__links--open':''}`}>
          {NAV.map(n=>(
            <button key={n} className={`nav__link ${active===n.toLowerCase()?'nav__link--on':''}`} onClick={()=>go(n)}>{n}</button>
          ))}
          <div className="nav__divider"/>
          {socials.filter(s=>s.show && s.url).map(s=>{
            const Icon = ICON_MAP[s.icon] || FiMail
            return <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="nav__icon" title={s.platform}><Icon size={16}/></a>
          })}
        </div>
        <button className={`nav__burger ${open?'nav__burger--x':''}`} onClick={()=>setOpen(!open)} aria-label="menu">
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  )
}
