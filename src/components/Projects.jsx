import React, { useState, useRef, useEffect } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { SiReact, SiMongodb, SiNodedotjs, SiMysql, SiFirebase, SiUnity, SiWordpress, SiFigma, SiPhp } from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { HiOutlineCube, HiOutlineGlobeAlt, HiOutlineDeviceMobile, HiOutlineDesktopComputer, HiOutlinePencil, HiOutlineDocumentText, HiOutlineServer, HiOutlineAcademicCap } from 'react-icons/hi'
import './Projects.css'

function useInView(t=0.05){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

const TECH_ICONS = { 'React.js':SiReact, 'MongoDB':SiMongodb, 'Node.js':SiNodedotjs, 'MySQL':SiMysql, 'Firebase':SiFirebase, 'Unity':SiUnity, 'WordPress':SiWordpress, 'Figma':SiFigma, 'PHP':SiPhp, 'Java':DiJava, 'React Native':SiReact }

const PROJECTS = [
  {
    id:'p1', span:'large', featured:true,
    Icon:HiOutlineGlobeAlt,
    title:'Restaurant Reservation System',
    desc:'Full-stack restaurant management platform with real-time table booking, order management, and push notifications. Built as web app (React.js) and mobile app (React Native) sharing a common backend.',
    tech:['React.js','React Native','MongoDB','Firebase','Node.js'],
    color:'#5B4FFF',
    github:'https://github.com/abaid-6015',
    live:'https://restaurant-reservation-system-react-seven.vercel.app/home',
    tag:'Featured · Live',
  },
  {
    id:'p2', span:'normal',
    Icon:HiOutlineDesktopComputer,
    title:'Inventory Management — Java',
    desc:'Desktop application for comprehensive inventory tracking with MySQL. Handles stock, suppliers, and PDF report generation.',
    tech:['Java','MySQL'],
    color:'#FF9F0A',
    github:'https://github.com/abaid-6015',
    tag:'Desktop App',
  },
  {
    id:'p3', span:'normal',
    Icon:HiOutlineCube,
    title:'3D Home Design Architecture',
    desc:'Interactive 3D architectural visualization tool. Users design and explore home layouts in real-time 3D with MySQL backend.',
    tech:['Three.js','JavaScript','MySQL'],
    color:'#00E5FF',
    github:'https://github.com/abaid-6015',
    tag:'WebGL · 3D',
  },
  {
    id:'p6', span:'normal', featured:true,
    Icon:HiOutlineCube,
    title:'Sight & Might — Unity 3D Game',
    desc:'Third-person action game featuring Player and Alien characters on terrain with AI-controlled animals. Complete game loop with physics and custom 3D environment.',
    tech:['Unity','C#'],
    color:'#FF375F',
    github:'https://github.com/abaid-6015',
    tag:'Game Dev',
  },
  {
    id:'p4', span:'normal',
    Icon:HiOutlineServer,
    title:'Inventory System — Web',
    desc:'Web-based inventory management with PHP and MySQL. Clean dashboard, CRUD operations, and user authentication.',
    tech:['PHP','MySQL','HTML5','CSS3'],
    color:'#30D158',
    github:'https://github.com/abaid-6015',
    tag:'Web App',
  },
  {
    id:'p5', span:'normal',
    Icon:HiOutlineAcademicCap,
    title:'University Network Topology',
    desc:'Complete campus network topology designed in Cisco Packet Tracer — VLANs, subnetting, OSPF routing, and security policies.',
    tech:['Cisco Packet Tracer','VLAN','OSPF'],
    color:'#8b5cf6',
    tag:'Networking',
  },
  {
    id:'p7', span:'normal',
    Icon:HiOutlinePencil,
    title:'UI/UX Figma Prototypes',
    desc:'High-fidelity interactive prototypes for all major projects — design systems, user flows, and component libraries.',
    tech:['Figma'],
    color:'#FF9F0A',
    tag:'Design',
  },
  {
    id:'wp1', span:'normal',
    Icon:HiOutlineGlobeAlt,
    title:'WordPress Client Sites',
    desc:'Responsive business websites built with WordPress, custom CSS, and plugin integrations including an ad-serving platform.',
    tech:['WordPress','PHP','CSS3'],
    color:'#21759b',
    tag:'WordPress · Client Work',
  },
]

function ProjectCard({ p, inView, i }) {
  const [hov, setHov] = useState(false)
  const techIcons = p.tech.map(t => ({ name:t, Icon:TECH_ICONS[t] })).filter(x=>x.Icon)
  return (
    <div className={`bento proj-card proj-card--${p.span} ${p.featured?'proj-card--feat':''}
      ${inView?'proj-card--in':''}`}
      style={{ '--pc':p.color, animationDelay:`${i*.07}s` }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>

      <div className="proj-card__glow" style={{opacity:hov?.18:0}}/>

      <div className="proj-card__top">
        <div className="proj-card__icon" style={{background:`${p.color}18`,border:`1px solid ${p.color}30`}}>
          <p.Icon size={20} style={{color:p.color}}/>
        </div>
        <span className="proj-card__tag" style={{color:p.color,background:`${p.color}12`}}>{p.tag}</span>
      </div>

      <h3 className="proj-card__title">{p.title}</h3>
      <p className="proj-card__desc">{p.desc}</p>

      <div className="proj-card__tech">
        {techIcons.slice(0,5).map(({name,Icon})=>(
          <span key={name} className="proj-card__tech-item" title={name} style={{color:p.color}}>
            <Icon size={14}/>
          </span>
        ))}
        {p.tech.filter(t=>!TECH_ICONS[t]).map(t=>(
          <span key={t} className="chip" style={{fontSize:'.64rem',padding:'.2rem .5rem'}}>{t}</span>
        ))}
      </div>

      <div className="proj-card__links">
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-card__link">
            <FiGithub size={14}/> Code
          </a>
        )}
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="proj-card__link proj-card__link--live"
            style={{color:p.color,borderColor:`${p.color}50`,background:`${p.color}0e`}}>
            <FiExternalLink size={14}/> Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const [ref,v] = useInView()
  return (
    <section id="projects" className="projects">
      <div className="wrap">
        <div className="projects__head">
          <div className="label">Projects</div>
          <h2 className="heading proj__title">Things I've <span className="grad-text">built</span></h2>
          <p className="projects__sub">Real-world applications from concept to deployment</p>
        </div>

        <div className={`projects__grid ${v?'projects__grid--in':''}`} ref={ref}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.id} p={p} inView={v} i={i}/>)}
        </div>

        <div className="projects__cta">
          <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <FiGithub size={16}/> View all on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
