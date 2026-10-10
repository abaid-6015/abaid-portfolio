import React,{useState,useEffect} from 'react'
import {FiLinkedin,FiGithub,FiMail,FiHeart} from 'react-icons/fi'
import {SiUpwork,SiFiverr} from 'react-icons/si'
import {getContact,getSocials,onUpdate} from '../store/dataStore'
const NAV=['About','Skills','Projects','Experience','Contact']
const ICON_MAP={linkedin:FiLinkedin,github:FiGithub,upwork:SiUpwork,fiverr:SiFiverr,mail:FiMail}
export default function Footer(){
  const[cd,setCd]=useState(getContact)
  const[soc,setSoc]=useState(getSocials)
  useEffect(()=>onUpdate(()=>{setCd(getContact());setSoc(getSocials())}),[])
  const go=id=>document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:'smooth'})
  return(
    <footer style={{background:'var(--surface)',borderTop:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
      <div className="wrap" style={{padding:'4rem 2rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'3rem',marginBottom:'3rem'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{display:'inline-flex',alignItems:'center',gap:'.5rem',cursor:'none',background:'none',border:'none',fontFamily:'var(--sans)',fontSize:'1.05rem',fontWeight:800,color:'var(--text)'}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 3L29 27H3L16 3Z" stroke="url(#fl)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/><defs><linearGradient id="fl" x1="3" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse"><stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/></linearGradient></defs></svg>
              AR
            </button>
            <p style={{fontSize:'.82rem',color:'var(--text3)',lineHeight:1.7}}>Building digital experiences with precision &amp; passion.</p>
            <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
              {soc.filter(s=>s.show&&s.url).map(s=>{const Icon=ICON_MAP[s.icon]||FiMail;return(
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'36px',height:'36px',borderRadius:'8px',color:'var(--text3)',border:'1px solid var(--border)',background:'var(--glass)',transition:'all .2s'}} title={s.platform} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.borderColor='rgba(91,79,255,.3)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text3)';e.currentTarget.style.borderColor='var(--border)'}}>
                  <Icon size={16}/>
                </a>
              )})}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'2rem'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'.64rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'.25rem'}}>Navigate</div>
              {NAV.map(n=><button key={n} onClick={()=>go(n)} style={{fontSize:'.85rem',color:'var(--text2)',cursor:'none',textAlign:'left',background:'none',border:'none',fontFamily:'var(--sans)',transition:'color .2s',padding:0}} onMouseEnter={e=>e.target.style.color='var(--accent2)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>{n}</button>)}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'.64rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'.25rem'}}>Profiles</div>
              {soc.filter(s=>s.show&&s.url).map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:'.85rem',color:'var(--text2)',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>e.target.style.color='var(--accent2)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>{s.platform} ↗</a>)}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'.64rem',color:'var(--text3)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'.25rem'}}>Contact</div>
              <a href={`mailto:${cd.email}`} style={{fontSize:'.85rem',color:'var(--text2)',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>e.target.style.color='var(--accent2)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>{cd.email}</a>
              <a href={`tel:${(cd.phone||'').replace(/\s/g,'')}`} style={{fontSize:'.85rem',color:'var(--text2)',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>e.target.style.color='var(--accent2)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>{cd.phone}</a>
              <span style={{fontSize:'.85rem',color:'var(--text3)'}}>{cd.location}</span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'1.5rem',borderTop:'1px solid var(--border)',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{fontSize:'.78rem',color:'var(--text3)',display:'flex',alignItems:'center',gap:'.35rem'}}>
            © {new Date().getFullYear()} Abaid-ul-Rehman — Crafted with <FiHeart size={12} style={{color:'#FF375F'}}/> using React &amp; Node.js
          </div>
          <div style={{fontSize:'.75rem',color:'var(--text3)',fontFamily:'var(--mono)'}}>React · MERN · Three.js · Unity · Vercel</div>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',width:'400px',height:'100px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(91,79,255,.12),transparent 70%)',pointerEvents:'none'}}/>
    </footer>
  )
}
