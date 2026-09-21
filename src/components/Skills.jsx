import React, { useRef, useEffect, useState } from 'react'
import {
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiJavascript, SiHtml5, SiCss,
  SiPython, SiPhp, SiMysql, SiFirebase, SiGit, SiWordpress, SiFigma,
  SiUnity, SiAndroid
} from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { HiOutlineDeviceMobile } from 'react-icons/hi'
import './Skills.css'

function useInView(t=0.06){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

/* ── WebGL morphing sphere ── */
function MorphSphere() {
  const cvs = useRef(null)
  useEffect(() => {
    const c = cvs.current; if (!c) return
    const gl = c.getContext('webgl'); if (!gl) return
    const W = c.width = 320, H = c.height = 320
    gl.viewport(0,0,W,H)

    const VS=`attribute vec3 a_pos; attribute vec3 a_norm; uniform float u_t;
    void main(){
      float morph=0.5+0.5*sin(u_t*0.7);
      float r=1.0+0.18*sin(a_pos.x*3.0+u_t)*morph+0.1*cos(a_pos.y*4.0+u_t*1.3);
      vec3 p=normalize(a_pos)*r;
      mat4 rot;float c2=cos(u_t*0.3),s2=sin(u_t*0.3);
      rot[0]=vec4(c2,0,s2,0);rot[1]=vec4(0,1,0,0);rot[2]=vec4(-s2,0,c2,0);rot[3]=vec4(0,0,0,1);
      vec4 rp=rot*vec4(p,1.0);
      gl_Position=vec4(rp.x*0.55,rp.y*0.55,rp.z*0.1,1.0); gl_PointSize=1.8;
    }`
    const FS=`precision mediump float; uniform float u_t;
    void main(){
      float a=0.45+0.2*sin(u_t*0.5);
      gl_FragColor=vec4(mix(vec3(0.36,0.31,1.0),vec3(0.0,0.9,1.0),0.5),a);
    }`

    const mk=(t,s)=>{ const sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh }
    const prog=gl.createProgram(); gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS)); gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS)); gl.linkProgram(prog); gl.useProgram(prog)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)

    const verts=[]; const N=48, M=96
    for(let i=0;i<=N;i++) for(let j=0;j<=M;j++){
      const ph=i/N*Math.PI, th=j/M*Math.PI*2
      verts.push(Math.sin(ph)*Math.cos(th), Math.cos(ph), Math.sin(ph)*Math.sin(th))
    }
    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW)
    const al=gl.getAttribLocation(prog,'a_pos'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al,3,gl.FLOAT,false,0,0)
    const tl=gl.getUniformLocation(prog,'u_t')

    let id, t0=performance.now()
    const draw=()=>{ const t=(performance.now()-t0)/1000; gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(tl,t); gl.drawArrays(gl.POINTS,0,verts.length/3); id=requestAnimationFrame(draw) }
    draw()
    return()=>cancelAnimationFrame(id)
  },[])
  return <canvas ref={cvs} className="skills__sphere" />
}

const SKILLS = [
  { cat:'Frontend', color:'#5B4FFF', items:[
    { Icon:SiReact,      name:'React.js',     pct:90 },
    { Icon:SiJavascript, name:'JavaScript',   pct:88 },
    { Icon:SiHtml5,      name:'HTML5',        pct:95 },
    { Icon:SiCss,        name:'CSS3',         pct:92 },
  ]},
  { cat:'Backend', color:'#00E5FF', items:[
    { Icon:SiNodedotjs,  name:'Node.js',      pct:85 },
    { Icon:SiExpress,    name:'Express.js',   pct:83 },
    { Icon:DiJava,       name:'Java',         pct:80 },
    { Icon:SiPython,     name:'Python',       pct:72 },
    { Icon:SiPhp,        name:'PHP',          pct:68 },
  ]},
  { cat:'Database', color:'#30D158', items:[
    { Icon:SiMongodb,    name:'MongoDB',      pct:86 },
    { Icon:SiMysql,      name:'MySQL',        pct:82 },
    { Icon:SiFirebase,   name:'Firebase',     pct:76 },
  ]},
  { cat:'Mobile & Game', color:'#FF9F0A', items:[
    { Icon:HiOutlineDeviceMobile, name:'React Native', pct:82 },
    { Icon:SiUnity,      name:'Unity 3D',     pct:65 },
    { Icon:SiAndroid,    name:'Mobile Dev',   pct:70 },
  ]},
  { cat:'Tools & Design', color:'#FF375F', items:[
    { Icon:SiWordpress,  name:'WordPress',    pct:90 },
    { Icon:SiFigma,      name:'Figma',        pct:85 },
    { Icon:SiGit,        name:'Git',          pct:82 },
  ]},
]

function Bar({ pct, color, active }) {
  const [w, setW] = useState(0)
  useEffect(() => { if (active) { const t=setTimeout(()=>setW(pct),150); return()=>clearTimeout(t) } }, [active,pct])
  return (
    <div className="skill-bar">
      <div className="skill-bar__fill" style={{ width:`${w}%`, background:color, boxShadow:`0 0 10px ${color}60` }}/>
    </div>
  )
}

export default function Skills() {
  const [ref,v] = useInView()
  const [active,setActive] = useState(0)

  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <div className="skills__head">
          <div className="label">Skills</div>
          <h2 className="heading skills__title">Technologies I <span className="grad-text">work with</span></h2>
        </div>

        <div className={`skills__layout ${v?'skills__layout--in':''}`} ref={ref}>
          {/* Category tabs */}
          <div className="bento skills__tabs-tile">
            {SKILLS.map((s,i)=>(
              <button key={s.cat} className={`skills__tab ${active===i?'skills__tab--on':''}`}
                onClick={()=>setActive(i)} style={{'--sc':s.color}}>
                <span className="skills__tab-dot" style={{background:s.color}}/>
                {s.cat}
              </button>
            ))}
          </div>

          {/* Skill bars */}
          <div className="bento skills__bars-tile">
            <div className="skills__cat-head">
              <span className="skills__cat-name" style={{color:SKILLS[active].color}}>{SKILLS[active].cat}</span>
              <span className="label">{SKILLS[active].items.length} skills</span>
            </div>
            <div className="skills__bars">
              {SKILLS[active].items.map(({Icon,name,pct})=>(
                <div key={name} className="skill-row">
                  <div className="skill-row__head">
                    <span className="skill-icon" style={{color:SKILLS[active].color}}><Icon size={16}/></span>
                    <span className="skill-name">{name}</span>
                    <span className="skill-pct">{pct}%</span>
                  </div>
                  <Bar pct={pct} color={SKILLS[active].color} active={v}/>
                </div>
              ))}
            </div>
          </div>

          {/* WebGL sphere */}
          <div className="bento skills__sphere-tile">
            <MorphSphere/>
            <div className="skills__sphere-label label">3D Tech Stack</div>
          </div>

          {/* All icons grid */}
          <div className="bento skills__icons-tile">
            <div className="label" style={{marginBottom:'.75rem'}}>Full Stack</div>
            <div className="skills__icons">
              {SKILLS.flatMap(s=>s.items).map(({Icon,name},i)=>(
                <div key={name} className="skill-chip" title={name} style={{animationDelay:`${i*.03}s`}}>
                  <Icon size={20}/>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
