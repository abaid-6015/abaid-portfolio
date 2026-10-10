import React,{useState,useEffect} from 'react'
import {FiLinkedin,FiGithub,FiMail} from 'react-icons/fi'
import {SiUpwork,SiFiverr} from 'react-icons/si'
import {getSocials,onUpdate} from '../store/dataStore'
const NAV=['About','Skills','Projects','Experience','Contact']
const ICON_MAP={linkedin:FiLinkedin,github:FiGithub,upwork:SiUpwork,fiverr:SiFiverr,mail:FiMail}
export default function Navbar(){
  const [scrolled,setScrolled]=useState(false)
  const [open,setOpen]=useState(false)
  const [active,setActive]=useState('')
  const [socials,setSocials]=useState(getSocials)
  useEffect(()=>{
    const fn=()=>{setScrolled(window.scrollY>50);for(let i=NAV.length-1;i>=0;i--){const el=document.getElementById(NAV[i].toLowerCase());if(el&&window.scrollY>=el.offsetTop-160){setActive(NAV[i].toLowerCase());break}}}
    window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn)
  },[])
  useEffect(()=>onUpdate(()=>setSocials(getSocials())),[])
  const go=id=>{document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:'smooth'});setOpen(false)}
  return(
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,padding:scrolled?'.9rem 0':'1.25rem 0',background:scrolled?'rgba(5,8,16,0.88)':'transparent',backdropFilter:scrolled?'blur(20px)':'none',borderBottom:scrolled?'1px solid var(--border)':'none',transition:'all .35s'}}>
      <div className="wrap" style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{display:'flex',alignItems:'center',gap:'.5rem',cursor:'none',flexShrink:0}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 3L29 27H3L16 3Z" stroke="url(#nl)" strokeWidth="1.8" fill="none" strokeLinejoin="round"/><defs><linearGradient id="nl" x1="3" y1="3" x2="29" y2="27" gradientUnits="userSpaceOnUse"><stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/></linearGradient></defs></svg>
          <span style={{fontFamily:'var(--sans)',fontWeight:800,fontSize:'1.05rem',color:'var(--text)'}}>AR</span>
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'.25rem',marginLeft:'auto',flexWrap:'wrap'}}>
          {NAV.map(n=>(
            <button key={n} onClick={()=>go(n)} style={{padding:'.45rem .9rem',borderRadius:'100px',fontSize:'.85rem',fontWeight:500,color:active===n.toLowerCase()?'var(--accent2)':'var(--text2)',background:active===n.toLowerCase()?'rgba(91,79,255,.12)':'transparent',cursor:'none',transition:'all .2s'}}>
              {n}
            </button>
          ))}
          <div style={{width:'1px',height:'20px',background:'var(--border)',margin:'0 .25rem'}}/>
          {socials.filter(s=>s.show&&s.url).map(s=>{const Icon=ICON_MAP[s.icon]||FiMail;return(
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px',borderRadius:'8px',color:'var(--text3)',border:'1px solid transparent',transition:'all .2s'}} title={s.platform} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.background='rgba(91,79,255,.1)';e.currentTarget.style.borderColor='rgba(91,79,255,.25)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text3)';e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='transparent'}}>
              <Icon size={16}/>
            </a>
          )})}
        </div>
      </div>
    </nav>
  )
}
