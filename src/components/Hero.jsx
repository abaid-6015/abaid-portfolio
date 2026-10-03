import React, { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { FiLinkedin, FiGithub, FiMail, FiArrowDown } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import { getHero, getSocials, onUpdate } from '../store/dataStore'
import './Hero.css'

const ICON_MAP = { linkedin:FiLinkedin, github:FiGithub, upwork:SiUpwork, fiverr:SiFiverr, mail:FiMail }

function ParticleField() {
  const cvs = useRef(null)
  useEffect(() => {
    const c=cvs.current; if(!c) return
    const gl=c.getContext('webgl'); if(!gl) return
    const resize=()=>{ c.width=c.clientWidth; c.height=c.clientHeight; gl.viewport(0,0,c.width,c.height) }
    resize(); window.addEventListener('resize',resize)
    const VS=`attribute vec3 a_pos; attribute float a_phase; uniform float u_t; uniform vec2 u_mouse;
    void main(){ float wave=sin(a_pos.x*3.0+u_t*0.8+a_phase)*0.05+cos(a_pos.y*2.5+u_t*0.6)*0.04;
      vec2 toMouse=vec2(a_pos.x,a_pos.y)-u_mouse; float d=length(toMouse); float repel=smoothstep(0.4,0.0,d)*0.12;
      vec2 dir=d>0.001?normalize(toMouse)*repel:vec2(0.0);
      gl_Position=vec4(a_pos.x+dir.x,a_pos.y+wave+dir.y,a_pos.z,1.0); gl_PointSize=clamp(2.5-d*1.5,0.8,2.5); }`
    const FS=`precision mediump float;
    void main(){ vec2 c=gl_PointCoord*2.0-1.0; float r=dot(c,c); if(r>1.0)discard;
      float a=1.0-r; gl_FragColor=vec4(0.36,0.31,1.0,a*0.6)+vec4(0.0,0.6,1.0,a*0.2*(1.0-r)); }`
    const mk=(t,s)=>{ const sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh }
    const prog=gl.createProgram(); gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS)); gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS)); gl.linkProgram(prog); gl.useProgram(prog)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
    const N=2200; const pos=new Float32Array(N*3); const phase=new Float32Array(N)
    for(let i=0;i<N;i++){ pos[i*3]=(Math.random()*2-1)*1.6; pos[i*3+1]=(Math.random()*2-1)*1.6; pos[i*3+2]=0; phase[i]=Math.random()*Math.PI*2 }
    const pb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,pb); gl.bufferData(gl.ARRAY_BUFFER,pos,gl.STATIC_DRAW)
    const pl=gl.getAttribLocation(prog,'a_pos'); gl.enableVertexAttribArray(pl); gl.vertexAttribPointer(pl,3,gl.FLOAT,false,0,0)
    const phb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,phb); gl.bufferData(gl.ARRAY_BUFFER,phase,gl.STATIC_DRAW)
    const phl=gl.getAttribLocation(prog,'a_phase'); gl.enableVertexAttribArray(phl); gl.vertexAttribPointer(phl,1,gl.FLOAT,false,0,0)
    const tL=gl.getUniformLocation(prog,'u_t'); const mL=gl.getUniformLocation(prog,'u_mouse')
    let mouse={x:0,y:0}; const mm=e=>{ mouse.x=(e.clientX/c.clientWidth)*2-1; mouse.y=-((e.clientY/c.clientHeight)*2-1) }
    window.addEventListener('mousemove',mm)
    let id,t0=performance.now()
    const draw=()=>{ const t=(performance.now()-t0)/1000; gl.clearColor(0.02,0.03,0.063,1); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(tL,t); gl.uniform2f(mL,mouse.x,mouse.y); gl.drawArrays(gl.POINTS,0,N); id=requestAnimationFrame(draw) }
    draw(); return()=>{ cancelAnimationFrame(id); window.removeEventListener('mousemove',mm); window.removeEventListener('resize',resize) }
  },[])
  return <canvas ref={cvs} className="hero__canvas"/>
}

function GeoAccent() {
  return (
    <div className="hero__geo" aria-hidden>
      <svg viewBox="0 0 400 400" fill="none"><circle cx="200" cy="200" r="160" stroke="rgba(91,79,255,0.12)" strokeWidth="1"/>
        <circle cx="200" cy="200" r="110" stroke="rgba(0,229,255,0.08)" strokeWidth="1"/>
        <polygon points="200,60 330,275 70,275" stroke="rgba(91,79,255,0.15)" strokeWidth="1" fill="none"/>
        <polygon points="200,340 70,125 330,125" stroke="rgba(0,229,255,0.1)" strokeWidth="1" fill="none"/>
        <circle cx="200" cy="200" r="6" fill="rgba(91,79,255,0.5)"/>
        <circle cx="200" cy="60" r="3" fill="rgba(0,229,255,0.6)" className="hero__geo-dot"/>
        <circle cx="330" cy="275" r="3" fill="rgba(91,79,255,0.6)" className="hero__geo-dot"/>
        <circle cx="70" cy="275" r="3" fill="rgba(255,159,10,0.6)" className="hero__geo-dot"/>
      </svg>
    </div>
  )
}

export default function Hero() {
  const [show, setShow] = useState(false)
  const [hero, setHero] = useState(getHero)
  const [socials, setSocials] = useState(getSocials)

  useEffect(() => { const t=setTimeout(()=>setShow(true),200); return()=>clearTimeout(t) },[])

  useEffect(() => onUpdate(() => { setHero(getHero()); setSocials(getSocials()) }), [])

  const roles = hero.roles || []
  const seq = roles.flatMap(r => [r, 2000])

  return (
    <section className="hero" id="home">
      <ParticleField/>
      <GeoAccent/>

      <div className={`hero__inner wrap ${show?'hero__inner--in':''}`}>
        <div className="hero__status">
          <span className="hero__status-dot" style={{background: hero.available ? '#30D158' : '#FF375F', boxShadow:`0 0 8px ${hero.available?'#30D158':'#FF375F'}`}}/>
          <span>{hero.available ? 'Available for work' : 'Not currently available'}</span>
          <span className="hero__status-sep">·</span>
          <span>{hero.location}</span>
        </div>

        <h1 className="display hero__name">
          {hero.name?.split(' ')[0] || 'Abaid-ul'}<br/>
          <span className="grad-text">{hero.name?.split(' ').slice(1).join(' ') || 'Rehman'}</span>
        </h1>

        <div className="hero__role">
          {seq.length > 0 && (
            <TypeAnimation key={JSON.stringify(roles)} sequence={seq} wrapper="span" speed={55} repeat={Infinity}/>
          )}
          <span className="hero__cursor-blink">|</span>
        </div>

        <p className="hero__bio">{hero.bio}</p>

        <div className="hero__cta">
          <button className="btn btn-fill" onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>View Projects</button>
          <button className="btn btn-ghost" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Hire Me</button>
        </div>

        <div className="hero__socials">
          {socials.filter(s=>s.show && s.url).map(s => {
            const Icon = ICON_MAP[s.icon] || FiMail
            return (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hero__social" title={s.platform}>
                <Icon size={18}/>
              </a>
            )
          })}
        </div>

        <div className="hero__stats">
          {(hero.stats||[]).map((s,i) => (
            <div key={i} className="hero__stat">
              <span className="hero__stat-n">{s.value}</span>
              <span className="hero__stat-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`hero__photo-wrap ${show?'hero__photo-wrap--in':''}`}>
        <div className="hero__photo-card bento">
          <img src="/profile.jpg" alt={hero.name} className="hero__photo"
            onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
          <div className="hero__photo-fallback">AR</div>
          <div className="hero__photo-overlay"/>
          <div className="hero__photo-label"><span className="hero__photo-label-dot"/>Full-Stack Dev</div>
        </div>
        <div className="hero__photo-glow"/>
      </div>

      <button className="hero__scroll" onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})} aria-label="scroll">
        <FiArrowDown size={14}/><span>scroll</span>
      </button>
    </section>
  )
}
