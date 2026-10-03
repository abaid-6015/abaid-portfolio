import React, { useState, useEffect } from 'react'
import { FiLinkedin, FiGithub, FiMail, FiHeart } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import { getContact, getSocials, onUpdate } from '../store/dataStore'
import './Footer.css'

const NAV=['About','Skills','Projects','Experience','Contact']
const ICON_MAP = { linkedin:FiLinkedin, github:FiGithub, upwork:SiUpwork, fiverr:SiFiverr, mail:FiMail }

export default function Footer() {
  const [cd, setCd]       = useState(getContact)
  const [socials, setSoc] = useState(getSocials)
  useEffect(()=>onUpdate(()=>{ setCd(getContact()); setSoc(getSocials()) }),[])
  const go = id => document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:'smooth'})
  const liveProject = socials.find(s=>s.platform==='GitHub')

  return (
    <footer className="footer">
      <div className="footer__inner wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <button className="footer__logo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 3L29 27H3L16 3Z" stroke="url(#fl)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/><defs><linearGradient id="fl" x1="3" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse"><stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/></linearGradient></defs></svg>
              <span>AR</span>
            </button>
            <p className="footer__tagline">Building digital experiences<br/>with precision &amp; passion.</p>
            <div className="footer__socials">
              {socials.filter(s=>s.show&&s.url).map(s=>{ const Icon=ICON_MAP[s.icon]||FiMail; return <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="footer__social" title={s.platform}><Icon size={16}/></a> })}
            </div>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__col-head">Navigate</div>
              {NAV.map(n=><button key={n} className="footer__link" onClick={()=>go(n)}>{n}</button>)}
            </div>
            <div className="footer__col">
              <div className="footer__col-head">Links</div>
              {socials.filter(s=>s.show&&s.url).map(s=>(
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="footer__link">{s.platform} ↗</a>
              ))}
            </div>
            <div className="footer__col">
              <div className="footer__col-head">Contact</div>
              <a href={`mailto:${cd.email}`} className="footer__link">{cd.email}</a>
              <a href={`tel:${cd.phone?.replace(/\s/g,'')}`} className="footer__link">{cd.phone}</a>
              <span className="footer__link" style={{cursor:'default'}}>{cd.location}</span>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__copy">© {new Date().getFullYear()} Abaid-ul-Rehman — Crafted with <FiHeart size={12} style={{color:'var(--rose)',display:'inline',verticalAlign:'middle'}}/> using React &amp; Node.js</div>
          <div className="footer__stack">React · MERN · Three.js · Unity · WordPress · Vercel</div>
        </div>
      </div>
      <div className="footer__glow"/>
    </footer>
  )
}
