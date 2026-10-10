import React,{useState,useEffect,useRef} from 'react'
import {SiReact,SiNodedotjs,SiMongodb,SiMysql,SiFirebase,SiJavascript,SiHtml5,SiCss3,SiPython,SiPhp,SiWordpress,SiFigma,SiGit,SiUnity} from 'react-icons/si'
import {DiJava} from 'react-icons/di'
import {HiOutlineDeviceMobile} from 'react-icons/hi'
import {getSkills,onUpdate} from '../store/dataStore'
const ICONS={React:SiReact,'React.js':SiReact,'React Native':SiReact,'Node.js':SiNodedotjs,MongoDB:SiMongodb,MySQL:SiMysql,Firebase:SiFirebase,JavaScript:SiJavascript,HTML5:SiHtml5,'CSS3':SiCss3,Python:SiPython,PHP:SiPhp,WordPress:SiWordpress,Figma:SiFigma,Git:SiGit,Java:DiJava,'Unity 3D':SiUnity,'Mobile Dev':HiOutlineDeviceMobile}
function useInView(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.06});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}
function Bar({pct,color,active}){const[w,setW]=useState(0);useEffect(()=>{if(active){const t=setTimeout(()=>setW(pct),200);return()=>clearTimeout(t)}},[active,pct]);return(<div style={{height:'3px',background:'rgba(255,255,255,.06)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',background:color,borderRadius:'2px',width:`${w}%`,boxShadow:`0 0 10px ${color}55`,transition:'width 1s cubic-bezier(.4,0,.2,1)'}}/></div>)}
export default function Skills(){
  const[ref,v]=useInView()
  const[cats,setCats]=useState(getSkills)
  const[active,setActive]=useState(0)
  useEffect(()=>onUpdate(()=>{const s=getSkills();setCats(s);setActive(a=>Math.min(a,s.length-1))}),[])
  const cat=cats[active]||cats[0]
  return(
    <section id="skills" style={{background:'var(--void)',padding:'100px 0'}}>
      <div className="wrap">
        <div className="label">Skills</div>
        <h2 className="heading" style={{marginTop:'.5rem',marginBottom:'2.5rem'}}>Technologies I <span className="grad-text">work with</span></h2>
        <div ref={ref} style={{display:'grid',gridTemplateColumns:'190px 1fr 240px',gap:'1.25rem',opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .7s,transform .7s'}}>
          {/* Category tabs */}
          <div className="bento" style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'.375rem'}}>
            {cats.map((g,i)=>(
              <button key={g.id} onClick={()=>setActive(i)} style={{display:'flex',alignItems:'center',gap:'.6rem',padding:'.6rem .9rem',borderRadius:'10px',fontSize:'.82rem',fontWeight:500,color:active===i?g.color:'var(--text2)',background:active===i?`${g.color}14`:'transparent',border:`1px solid ${active===i?`${g.color}30`:'transparent'}`,cursor:'none',textAlign:'left',transition:'all .2s'}}>
                <span style={{width:'7px',height:'7px',borderRadius:'50%',background:g.color,flexShrink:0}}/>
                {g.category}
              </button>
            ))}
          </div>
          {/* Bars */}
          {cat&&(
            <div className="bento" style={{padding:'2rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
                <span style={{fontSize:'1.1rem',fontWeight:700,color:cat.color}}>{cat.category}</span>
                <span className="label">{cat.items.length} skills</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'1.1rem'}}>
                {cat.items.map((it,i)=>{const Icon=ICONS[it.name];return(
                  <div key={i} style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                      {Icon&&<Icon size={15} style={{color:cat.color}}/>}
                      <span style={{fontSize:'.85rem',fontWeight:500,flex:1,color:'var(--text)'}}>{it.name}</span>
                      <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'var(--text3)'}}>{it.pct}%</span>
                    </div>
                    <Bar pct={it.pct} color={cat.color} active={v}/>
                  </div>
                )})}
              </div>
            </div>
          )}
          {/* Icon grid */}
          <div className="bento" style={{padding:'1.5rem',gridRow:'1/3'}}>
            <div className="label" style={{marginBottom:'.75rem'}}>All Skills</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {cats.flatMap(c=>c.items).map((it,i)=>{const Icon=ICONS[it.name];return(
                <div key={i} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.32rem .72rem',borderRadius:'100px',fontSize:'.72rem',fontWeight:500,color:'var(--text2)',background:'var(--glass)',border:'1px solid var(--border)',cursor:'default',transition:'all .2s'}} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.borderColor='rgba(91,79,255,.3)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text2)';e.currentTarget.style.borderColor='var(--border)'}}>
                  {Icon&&<Icon size={13}/>}{it.name}
                </div>
              )})}
            </div>
          </div>
          {/* Full icon grid bottom */}
          <div className="bento" style={{padding:'1.5rem'}}>
            <div className="label" style={{marginBottom:'.75rem'}}>Tech Stack</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {cats.flatMap(c=>c.items).slice(0,12).map((it,i)=>{const Icon=ICONS[it.name];return Icon?(
                <div key={i} title={it.name} style={{display:'flex',alignItems:'center',justifyContent:'center',width:'36px',height:'36px',borderRadius:'9px',background:'var(--glass)',border:'1px solid var(--border)',color:'var(--text3)',fontSize:'1.1rem',cursor:'default',transition:'all .2s'}} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.borderColor='rgba(91,79,255,.3)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text3)';e.currentTarget.style.borderColor='var(--border)'}}>
                  <Icon size={18}/>
                </div>
              ):null})}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
