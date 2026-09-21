import React from 'react'
import { FiLinkedin, FiGithub, FiMail, FiHeart } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import './Footer.css'

const SOCIALS = [
  { Icon:FiLinkedin, href:'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/', label:'LinkedIn' },
  { Icon:FiGithub,   href:'https://github.com/abaid-6015',                           label:'GitHub'   },
  { Icon:SiUpwork,   href:'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share', label:'Upwork' },
  { Icon:SiFiverr,   href:'https://www.fiverr.com/abaid_bse',                        label:'Fiverr'   },
  { Icon:FiMail,     href:'mailto:abaidbse@gmail.com',                               label:'Email'    },
]
const NAV=['About','Skills','Projects','Experience','Contact']

export default function Footer() {
  const go = id => document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:'smooth'})
  return (
    <footer className="footer">
      <div className="footer__inner wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <button className="footer__logo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 3L29 27H3L16 3Z" stroke="url(#fl)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
                <defs><linearGradient id="fl" x1="3" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/>
                </linearGradient></defs>
              </svg>
              <span>AR</span>
            </button>
            <p className="footer__tagline">Building digital experiences<br/>with precision & passion.</p>
            <div className="footer__socials">
              {SOCIALS.map(({Icon,href,label})=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="footer__social" title={label}><Icon size={16}/></a>
              ))}
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <div className="footer__col-head">Navigate</div>
              {NAV.map(n=><button key={n} className="footer__link" onClick={()=>go(n)}>{n}</button>)}
            </div>
            <div className="footer__col">
              <div className="footer__col-head">Live Work</div>
              <a href="https://restaurant-reservation-system-react-seven.vercel.app/home"
                target="_blank" rel="noopener noreferrer" className="footer__link">Restaurant App ↗</a>
              <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer" className="footer__link">GitHub Repos ↗</a>
              <a href="https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share"
                target="_blank" rel="noopener noreferrer" className="footer__link">Upwork Profile ↗</a>
            </div>
            <div className="footer__col">
              <div className="footer__col-head">Contact</div>
              <a href="mailto:abaidbse@gmail.com" className="footer__link">abaidbse@gmail.com</a>
              <a href="tel:+923281632432" className="footer__link">+92 328 1632432</a>
              <span className="footer__link" style={{cursor:'default'}}>Gujranwala, Pakistan</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copy">
            © {new Date().getFullYear()} Abaid-ul-Rehman — Crafted with <FiHeart size={12} style={{color:'var(--rose)',display:'inline',verticalAlign:'middle'}}/> using React & Node.js
          </div>
          <div className="footer__stack">
            {['React','MERN','Three.js','Unity','WordPress','Vercel'].map((t,i)=>(
              <span key={t}>{t}{i<5 && <span style={{color:'var(--text3)',margin:'0 .35rem'}}>·</span>}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="footer__glow"/>
    </footer>
  )
}
