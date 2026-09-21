import React, { useRef, useEffect, useState } from 'react'
import { FiLinkedin, FiGithub, FiMail } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import { HiOutlineCode, HiOutlineDeviceMobile, HiOutlineDesktopComputer, HiOutlinePuzzle } from 'react-icons/hi'
import './About.css'

function useInView(t=0.1){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

const ROLES = [
  { Icon:HiOutlineCode,            label:'Web Dev',     desc:'MERN stack, REST APIs, full-stack apps' },
  { Icon:HiOutlineDeviceMobile,    label:'Mobile Dev',  desc:'React Native, Firebase, cross-platform' },
  { Icon:HiOutlineDesktopComputer, label:'Game Dev',    desc:'Unity, C#, 3D design & gameplay' },
  { Icon:HiOutlinePuzzle,          label:'UI/UX',       desc:'Figma prototypes & WordPress sites' },
]

const PLATFORMS = [
  { Icon:FiLinkedin, href:'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/', label:'LinkedIn', color:'#0a66c2' },
  { Icon:FiGithub,   href:'https://github.com/abaid-6015',                           label:'GitHub',   color:'#8b5cf6' },
  { Icon:SiUpwork,   href:'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share', label:'Upwork', color:'#6fda44' },
  { Icon:SiFiverr,   href:'https://www.fiverr.com/abaid_bse',                        label:'Fiverr',   color:'#1dbf73' },
  { Icon:FiMail,     href:'mailto:abaidbse@gmail.com',                               label:'Email',    color:'#ff9f0a' },
]

export default function About() {
  const [ref, v] = useInView()
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div className={`about__grid ${v?'about__grid--in':''}`} ref={ref}>

          {/* ── Bio tile (tall, left) ── */}
          <div className="bento about__bio-tile">
            <div className="about__bio-tag label">About Me</div>
            <h2 className="heading about__heading">
              Passionate developer &<br/>creative problem-solver
            </h2>
            <p className="about__p">
              I'm <strong>Abaid-ul-Rehman</strong> — a Software Engineering student at
              <span className="about__accent"> Gift University, Gujranwala</span> with
              hands-on experience in full-stack development, mobile apps, game development,
              and UI/UX design.
            </p>
            <p className="about__p">
              From MERN stack web applications and React Native mobile apps to a Unity 3D game
              and WordPress client sites — I love building things that are both functional and visually
              compelling.
            </p>
            <p className="about__p">
              I freelance on <span className="about__accent">Upwork & Fiverr</span>, delivering
              quality work to clients worldwide, and I'm actively seeking full-time opportunities.
            </p>

            <div className="about__platforms">
              {PLATFORMS.map(({ Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="about__platform" style={{'--pc':color}} title={label}>
                  <Icon size={15}/> {label}
                </a>
              ))}
            </div>

            <div className="about__cta">
              <button className="btn btn-fill"
                onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
                Hire Me
              </button>
              <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost">
                <FiGithub size={15}/> GitHub
              </a>
            </div>
          </div>

          {/* ── Role tiles (right col) ── */}
          <div className="about__roles">
            {ROLES.map(({Icon,label,desc},i)=>(
              <div key={label} className="bento about__role-tile"
                style={{animationDelay:`${i*.08}s`}}>
                <div className="about__role-icon"><Icon size={22}/></div>
                <div className="about__role-label">{label}</div>
                <div className="about__role-desc">{desc}</div>
              </div>
            ))}
          </div>

          {/* ── Info grid tile ── */}
          <div className="bento about__info-tile">
            <div className="label" style={{marginBottom:'1rem'}}>Quick Info</div>
            <div className="about__info-rows">
              {[
                ['Degree',   'B.Sc. Software Engineering'],
                ['University','Gift University, Gujranwala'],
                ['Location', 'Gujranwala, Pakistan'],
                ['Email',    'abaidbse@gmail.com'],
                ['Phone',    '+92 328 1632432'],
                ['Status',   '🟢 Open to work'],
              ].map(([k,v])=>(
                <div key={k} className="about__info-row">
                  <span className="about__info-key">{k}</span>
                  <span className="about__info-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
