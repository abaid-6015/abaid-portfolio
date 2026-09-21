import React, { useRef, useState, useEffect } from 'react'
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi'
import './Experience.css'

function useInView(t=0.06){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

const EXP = [
  { role:'Web Development & Designing', company:'Creative Solution', period:'2024 — Present', type:'Full-time', color:'#5B4FFF',
    points:['Designed responsive sites with WordPress & custom CSS','Built scalable ad-serving platform backend','Managed DB administration and backend ops','Created Figma wireframes for client presentations'] },
  { role:'Programming & Tech Projects', company:'Freelance / Self-employed', period:'2023 — 2026', type:'Self-employed', color:'#00E5FF',
    points:['Built full-stack MERN web applications with REST APIs','Developed 3D home design tool with Three.js & MySQL','Created Unity 3D game (Sight & Might) with C#','Built React Native mobile apps with Firebase integration','Designed UI/UX prototypes for all projects in Figma'] },
  { role:'Type Writing & Data Entry', company:'Creative Solution', period:'2023 — 2025', type:'Contract', color:'#FF9F0A',
    points:['Formatted exam sheets and result reports','Generated statistical performance reports','Designed PowerPoint slides for academic lectures'] },
]

const EDU = [
  { degree:'B.Sc. Software Engineering', school:'Gift University, Gujranwala', period:'2024 — Present', icon:'🎓', color:'#5B4FFF' },
  { degree:'Matriculation (Secondary)', school:'City Cardinal High School', period:'2008 — 2021', icon:'🏫', color:'#00E5FF' },
]

export default function Experience() {
  const [ref,v] = useInView()
  const [tab, setTab] = useState('exp')

  return (
    <section id="experience" className="exp">
      <div className="wrap">
        <div className="exp__head">
          <div className="label">Background</div>
          <h2 className="heading exp__title">Experience & <span className="grad-text">Education</span></h2>
        </div>

        <div className="exp__tabs">
          <button className={`exp__tab-btn ${tab==='exp'?'exp__tab-btn--on':''}`} onClick={()=>setTab('exp')}>
            <HiOutlineBriefcase size={16}/> Work Experience
          </button>
          <button className={`exp__tab-btn ${tab==='edu'?'exp__tab-btn--on':''}`} onClick={()=>setTab('edu')}>
            <HiOutlineAcademicCap size={16}/> Education
          </button>
        </div>

        <div className={`exp__content ${v?'exp__content--in':''}`} ref={ref}>
          {tab==='exp' ? (
            <div className="exp__list">
              {EXP.map((e,i)=>(
                <div key={e.role} className="bento exp__card" style={{'--ec':e.color, animationDelay:`${i*.1}s`}}>
                  <div className="exp__card-bar" />
                  <div className="exp__card-body">
                    <div className="exp__card-meta">
                      <div>
                        <div className="exp__role">{e.role}</div>
                        <div className="exp__company">{e.company}</div>
                      </div>
                      <div className="exp__badges">
                        <span className="chip" style={{color:e.color,background:`${e.color}14`,border:`1px solid ${e.color}30`}}>
                          <HiOutlineCalendar size={11}/> {e.period}
                        </span>
                        <span className="chip">{e.type}</span>
                      </div>
                    </div>
                    <ul className="exp__points">
                      {e.points.map((p,j)=>(
                        <li key={j} className="exp__point">
                          <span className="exp__dot" style={{background:e.color}}/>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="edu__list">
              {EDU.map((e,i)=>(
                <div key={e.degree} className="bento edu__card" style={{'--ec':e.color, animationDelay:`${i*.1}s`}}>
                  <div className="edu__icon">{e.icon}</div>
                  <div className="edu__body">
                    <div className="edu__degree">{e.degree}</div>
                    <div className="edu__school">
                      <HiOutlineLocationMarker size={12}/> {e.school}
                    </div>
                    <span className="chip" style={{marginTop:'.75rem',color:e.color,background:`${e.color}12`,border:`1px solid ${e.color}28`}}>
                      <HiOutlineCalendar size={11}/> {e.period}
                    </span>
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
