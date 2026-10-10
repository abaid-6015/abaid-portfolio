import React,{useState,useEffect,useRef} from 'react'
import {getExperiences,getEducation,onUpdate} from '../store/dataStore'
function useInView(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.06});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}
export default function Experience(){
  const[ref,v]=useInView()
  const[exps,setExps]=useState(getExperiences)
  const[edus,setEdus]=useState(getEducation)
  const[tab,setTab]=useState('exp')
  useEffect(()=>onUpdate(()=>{setExps(getExperiences());setEdus(getEducation())}),[])
  return(
    <section id="experience" style={{background:'var(--void)',padding:'100px 0'}}>
      <div className="wrap">
        <div className="label">Background</div>
        <h2 className="heading" style={{marginTop:'.5rem',marginBottom:'2rem'}}>Experience &amp; <span className="grad-text">Education</span></h2>
        <div style={{display:'flex',gap:'.5rem',marginBottom:'2rem'}}>
          {[['exp','💼','Work Experience'],['edu','🎓','Education']].map(([key,ico,lbl])=>(
            <button key={key} onClick={()=>setTab(key)} style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.65rem 1.4rem',borderRadius:'100px',fontSize:'.85rem',fontWeight:500,color:tab===key?'var(--accent2)':'var(--text2)',background:tab===key?'rgba(91,79,255,.12)':'var(--glass)',border:`1px solid ${tab===key?'rgba(91,79,255,.28)':'var(--border)'}`,cursor:'none',transition:'all .22s'}}>
              {ico} {lbl}
            </button>
          ))}
        </div>
        <div ref={ref} style={{opacity:v?1:0,transform:v?'translateY(0)':'translateY(20px)',transition:'opacity .6s,transform .6s'}}>
          {tab==='exp'?(
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {exps.map((e,i)=>(
                <div key={e.id} className="bento" style={{padding:0,overflow:'hidden',display:'flex',flexDirection:'row'}}>
                  <div style={{width:'3px',background:e.color,flexShrink:0,borderRadius:'3px 0 0 3px'}}/>
                  <div style={{padding:'1.75rem',flex:1,display:'flex',flexDirection:'column',gap:'1rem'}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
                      <div>
                        <div style={{fontSize:'1.05rem',fontWeight:700,color:'var(--text)',marginBottom:'.2rem'}}>{e.role}</div>
                        <div style={{fontSize:'.85rem',color:'var(--text2)'}}>{e.company}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'.35rem',alignItems:'flex-end'}}>
                        <span className="chip" style={{color:e.color,background:`${e.color}12`,border:`1px solid ${e.color}28`,fontSize:'.65rem'}}>{e.period}</span>
                        <span className="chip" style={{fontSize:'.65rem'}}>{e.type}</span>
                      </div>
                    </div>
                    <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'}}>
                      {(e.points||[]).map((pt,j)=>(
                        <li key={j} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.84rem',color:'var(--text2)',lineHeight:1.6}}>
                          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:e.color,flexShrink:0,marginTop:'.45rem'}}/>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
              {edus.map(e=>(
                <div key={e.id} className="bento" style={{padding:'2rem',display:'flex',gap:'1.25rem',alignItems:'flex-start',borderColor:`${e.color}20`}}>
                  <div style={{fontSize:'2.2rem',lineHeight:1,flexShrink:0}}>🎓</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                    <div style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',lineHeight:1.3}}>{e.degree}</div>
                    <div style={{fontSize:'.82rem',color:'var(--text2)'}}>{e.school}</div>
                    {e.detail&&<div style={{fontSize:'.76rem',color:'var(--text3)',fontStyle:'italic'}}>{e.detail}</div>}
                    <span className="chip" style={{marginTop:'.75rem',color:e.color,background:`${e.color}10`,border:`1px solid ${e.color}25`,fontSize:'.65rem',alignSelf:'flex-start'}}>{e.period}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
