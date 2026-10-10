import React,{useState,useEffect,useRef} from 'react'
import {FiGithub,FiLinkedin,FiMail} from 'react-icons/fi'
import {SiUpwork,SiFiverr} from 'react-icons/si'
import {getAbout,getSocials,onUpdate} from '../store/dataStore'
const ICON_MAP={linkedin:FiLinkedin,github:FiGithub,upwork:SiUpwork,fiverr:SiFiverr,mail:FiMail}
function useInView(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.08});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}
export default function About(){
  const[ref,v]=useInView()
  const[about,setAbout]=useState(getAbout)
  const[socials,setSocials]=useState(getSocials)
  useEffect(()=>onUpdate(()=>{setAbout(getAbout());setSocials(getSocials())}),[])
  return(
    <section id="about" style={{background:'var(--depth)',padding:'100px 0'}}>
      <div className="wrap" ref={ref} style={{opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .7s,transform .7s'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 240px',gridTemplateRows:'auto auto',gap:'1.25rem'}}>
          {/* Bio tile */}
          <div className="bento" style={{gridRow:'1/3',padding:'2.5rem',display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <div className="label">About Me</div>
            <h2 className="heading">{about.heading?.split('&')[0]}&amp;<span className="grad-text">{about.heading?.split('&')[1]||' problem-solver'}</span></h2>
            {[about.bio1,about.bio2,about.bio3].filter(Boolean).map((b,i)=>(
              <p key={i} style={{fontSize:'.95rem',color:'var(--text2)',lineHeight:1.8,maxWidth:'56ch'}}>{b}</p>
            ))}
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {socials.filter(s=>s.show&&s.url).map(s=>{const Icon=ICON_MAP[s.icon]||FiMail;return(
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.35rem .85rem',borderRadius:'100px',fontSize:'.75rem',fontWeight:500,color:'var(--text2)',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',textDecoration:'none',transition:'all .2s'}} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.borderColor='rgba(91,79,255,.3)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text2)';e.currentTarget.style.borderColor='rgba(255,255,255,.08)'}}>
                  <Icon size={13}/>{s.platform}
                </a>
              )})}
            </div>
            <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
              <button className="btn btn-fill" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Hire Me</button>
              <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><FiGithub size={15}/>GitHub</a>
            </div>
          </div>
          {/* Role tiles */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
            {[{icon:'⚛️',label:'Web Dev',desc:'MERN stack, REST APIs'},{icon:'📱',label:'Mobile Dev',desc:'React Native, Firebase'},{icon:'🎮',label:'Game Dev',desc:'Unity, C#, 3D Design'},{icon:'🎨',label:'UI/UX',desc:'Figma, WordPress, CSS'}].map((item,i)=>(
              <div key={i} className="bento" style={{padding:'1.5rem 1.25rem',display:'flex',flexDirection:'column',gap:'.5rem',cursor:'default'}}>
                <div style={{fontSize:'1.35rem'}}>{item.icon}</div>
                <div style={{fontWeight:700,fontSize:'.9rem',color:'var(--text)'}}>{item.label}</div>
                <div style={{fontSize:'.74rem',color:'var(--text3)',lineHeight:1.5}}>{item.desc}</div>
              </div>
            ))}
          </div>
          {/* Info tile */}
          <div className="bento" style={{padding:'1.75rem'}}>
            <div className="label" style={{marginBottom:'1rem'}}>Quick Info</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
              {(about.info||[]).map((row,i)=>(
                <div key={i} style={{display:'flex',flexDirection:'column',gap:'.12rem'}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:'.63rem',color:'var(--text3)',letterSpacing:'.08em'}}>{row.label}</span>
                  <span style={{fontSize:'.8rem',color:'var(--text)',fontWeight:500}}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
