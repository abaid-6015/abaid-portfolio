import React, { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { FiLinkedin, FiGithub, FiMail, FiArrowDown } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import './Hero.css'

/* ─── WebGL Particle Field ───────────────────────────────────── */
function ParticleField() {
  const cvs = useRef(null)
  useEffect(() => {
    const c = cvs.current; if (!c) return
    const gl = c.getContext('webgl'); if (!gl) return

    const resize = () => { c.width = c.clientWidth; c.height = c.clientHeight; gl.viewport(0,0,c.width,c.height) }
    resize(); window.addEventListener('resize', resize)

    const VS = `
      attribute vec3 a_pos; attribute float a_phase;
      uniform float u_t; uniform vec2 u_mouse;
      void main(){
        float wave = sin(a_pos.x*3.0+u_t*0.8+a_phase)*0.05
                   + cos(a_pos.y*2.5+u_t*0.6)*0.04;
        vec2 toMouse = vec2(a_pos.x,a_pos.y) - u_mouse;
        float d = length(toMouse); float repel = smoothstep(0.4,0.0,d)*0.12;
        vec2 dir = d>0.001 ? normalize(toMouse)*repel : vec2(0.0);
        gl_Position = vec4(a_pos.x+dir.x, a_pos.y+wave+dir.y, a_pos.z, 1.0);
        float alpha = 0.15 + 0.5*(1.0-d*0.8);
        gl_PointSize = clamp(2.5-d*1.5, 0.8, 2.5);
      }`
    const FS = `
      precision mediump float;
      void main(){
        vec2 c = gl_PointCoord*2.0-1.0;
        float r = dot(c,c);
        if(r>1.0) discard;
        float a = 1.0-r;
        gl_FragColor = vec4(0.36,0.31,1.0, a*0.6) + vec4(0.0,0.6,1.0, a*0.2*(1.0-r));
      }`

    const mk = (t,s) => { const sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh }
    const prog = gl.createProgram()
    gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS)); gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS))
    gl.linkProgram(prog); gl.useProgram(prog)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)

    const N = 2200
    const pos = new Float32Array(N*3), phase = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()*2-1)*1.6
      pos[i*3+1] = (Math.random()*2-1)*1.6
      pos[i*3+2] = 0
      phase[i]   = Math.random()*Math.PI*2
    }

    const pb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,pb); gl.bufferData(gl.ARRAY_BUFFER,pos,gl.STATIC_DRAW)
    const ploc=gl.getAttribLocation(prog,'a_pos'); gl.enableVertexAttribArray(ploc); gl.vertexAttribPointer(ploc,3,gl.FLOAT,false,0,0)
    const phb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,phb); gl.bufferData(gl.ARRAY_BUFFER,phase,gl.STATIC_DRAW)
    const phloc=gl.getAttribLocation(prog,'a_phase'); gl.enableVertexAttribArray(phloc); gl.vertexAttribPointer(phloc,1,gl.FLOAT,false,0,0)

    const tL=gl.getUniformLocation(prog,'u_t'), mL=gl.getUniformLocation(prog,'u_mouse')
    let mouse = { x:0, y:0 }
    const mm = e => { mouse.x=(e.clientX/c.clientWidth)*2-1; mouse.y=-((e.clientY/c.clientHeight)*2-1) }
    window.addEventListener('mousemove',mm)

    let id, t0=performance.now()
    const draw = () => {
      const t=(performance.now()-t0)/1000
      gl.clearColor(0.02,0.03,0.063,1); gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(tL,t); gl.uniform2f(mL,mouse.x,mouse.y)
      gl.drawArrays(gl.POINTS,0,N)
      id=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('mousemove',mm); window.removeEventListener('resize',resize) }
  },[])
  return <canvas ref={cvs} className="hero__canvas" />
}

/* ─── Morphing geometric SVG accent ─────────────────────────── */
function GeoAccent() {
  return (
    <div className="hero__geo" aria-hidden>
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="160" stroke="rgba(91,79,255,0.12)" strokeWidth="1"/>
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

const SOCIALS = [
  { Icon: FiLinkedin, href:'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/', label:'LinkedIn' },
  { Icon: FiGithub,   href:'https://github.com/abaid-6015',                           label:'GitHub'   },
  { Icon: SiUpwork,   href:'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share', label:'Upwork' },
  { Icon: SiFiverr,   href:'https://www.fiverr.com/abaid_bse',                        label:'Fiverr'   },
  { Icon: FiMail,     href:'mailto:abaidbse@gmail.com',                               label:'Email'    },
]

export default function Hero() {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 200); return () => clearTimeout(t) }, [])

  return (
    <section className="hero" id="home">
      <ParticleField />
      <GeoAccent />

      <div className={`hero__inner wrap ${show?'hero__inner--in':''}`}>
        {/* ── Status pill ── */}
        <div className="hero__status">
          <span className="hero__status-dot" />
          <span>Available for work</span>
          <span className="hero__status-sep">·</span>
          <span>Gujranwala, Pakistan</span>
        </div>

        {/* ── Name ── */}
        <h1 className="display hero__name">
          Abaid-ul<br/>
          <span className="grad-text">Rehman</span>
        </h1>

        {/* ── Typed role ── */}
        <div className="hero__role">
          <TypeAnimation
            sequence={[
              'Full-Stack Web Developer', 2200,
              'MERN Stack Engineer', 2000,
              'React Native Developer', 2000,
              'Game Developer — Unity', 2000,
              'UI/UX Designer — Figma', 2000,
              'WordPress Developer', 2000,
            ]}
            wrapper="span" speed={55} repeat={Infinity}
          />
          <span className="hero__cursor-blink">|</span>
        </div>

        {/* ── Bio ── */}
        <p className="hero__bio">
          Building immersive, scalable digital products — from MERN web apps and
          React Native mobile apps to 3D games and WordPress solutions.
          Based in Pakistan, working globally.
        </p>

        {/* ── CTA row ── */}
        <div className="hero__cta">
          <button className="btn btn-fill"
            onClick={() => document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>
            View Projects
          </button>
          <button className="btn btn-ghost"
            onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
            Hire Me
          </button>
        </div>

        {/* ── Social icons ── */}
        <div className="hero__socials">
          {SOCIALS.map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="hero__social" title={label}>
              <Icon size={18}/>
            </a>
          ))}
        </div>

        {/* ── Stat row ── */}
        <div className="hero__stats">
          {[
            { v:'8+',  l:'Projects Built'   },
            { v:'3+',  l:'Years Coding'     },
            { v:'12+', l:'Technologies'     },
            { v:'4',   l:'Platforms'        },
          ].map(s => (
            <div key={s.l} className="hero__stat">
              <span className="hero__stat-n">{s.v}</span>
              <span className="hero__stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Photo card ── */}
      <div className={`hero__photo-wrap ${show?'hero__photo-wrap--in':''}`}>
        <div className="hero__photo-card bento">
          <img src="/profile.jpg" alt="Abaid-ul-Rehman" className="hero__photo"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}/>
          <div className="hero__photo-fallback">AR</div>
          <div className="hero__photo-overlay" />
          {/* Floating label */}
          <div className="hero__photo-label">
            <span className="hero__photo-label-dot" />Full-Stack Dev
          </div>
        </div>
        <div className="hero__photo-glow" />
      </div>

      {/* Scroll hint */}
      <button className="hero__scroll" onClick={() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}
        aria-label="scroll">
        <FiArrowDown size={14}/>
        <span>scroll</span>
      </button>
    </section>
  )
}
