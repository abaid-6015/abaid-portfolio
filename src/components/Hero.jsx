import React,{useEffect,useRef,useState} from 'react'
import {TypeAnimation} from 'react-type-animation'
import {FiLinkedin,FiGithub,FiMail,FiArrowDown} from 'react-icons/fi'
import {SiUpwork,SiFiverr} from 'react-icons/si'
import {getHero,getSocials,onUpdate} from '../store/dataStore'
const ICON_MAP={linkedin:FiLinkedin,github:FiGithub,upwork:SiUpwork,fiverr:SiFiverr,mail:FiMail}
function ParticleField(){
  const cvs=useRef(null)
  useEffect(()=>{
    const c=cvs.current;if(!c)return;const gl=c.getContext('webgl');if(!gl)return
    const resize=()=>{c.width=c.clientWidth;c.height=c.clientHeight;gl.viewport(0,0,c.width,c.height)}
    resize();window.addEventListener('resize',resize)
    const VS=`attribute vec3 a_pos;attribute float a_phase;uniform float u_t;uniform vec2 u_mouse;void main(){float wave=sin(a_pos.x*3.0+u_t*0.8+a_phase)*0.05+cos(a_pos.y*2.5+u_t*0.6)*0.04;vec2 toMouse=vec2(a_pos.x,a_pos.y)-u_mouse;float d=length(toMouse);float repel=smoothstep(0.4,0.0,d)*0.12;vec2 dir=d>0.001?normalize(toMouse)*repel:vec2(0.0);gl_Position=vec4(a_pos.x+dir.x,a_pos.y+wave+dir.y,a_pos.z,1.0);gl_PointSize=clamp(2.5-d*1.5,0.8,2.5);}`
    const FS=`precision mediump float;void main(){vec2 c=gl_PointCoord*2.0-1.0;float r=dot(c,c);if(r>1.0)discard;float a=1.0-r;gl_FragColor=vec4(0.36,0.31,1.0,a*0.6)+vec4(0.0,0.6,1.0,a*0.2*(1.0-r));}`
    const mk=(t,s)=>{const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh}
    const prog=gl.createProgram();gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS));gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);gl.useProgram(prog)
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
    const N=2000;const pos=new Float32Array(N*3);const phase=new Float32Array(N)
    for(let i=0;i<N;i++){pos[i*3]=(Math.random()*2-1)*1.6;pos[i*3+1]=(Math.random()*2-1)*1.6;pos[i*3+2]=0;phase[i]=Math.random()*Math.PI*2}
    const pb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.STATIC_DRAW)
    const pl=gl.getAttribLocation(prog,'a_pos');gl.enableVertexAttribArray(pl);gl.vertexAttribPointer(pl,3,gl.FLOAT,false,0,0)
    const phb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,phb);gl.bufferData(gl.ARRAY_BUFFER,phase,gl.STATIC_DRAW)
    const phl=gl.getAttribLocation(prog,'a_phase');gl.enableVertexAttribArray(phl);gl.vertexAttribPointer(phl,1,gl.FLOAT,false,0,0)
    const tL=gl.getUniformLocation(prog,'u_t'),mL=gl.getUniformLocation(prog,'u_mouse')
    let mouse={x:0,y:0};const mm=e=>{mouse.x=(e.clientX/c.clientWidth)*2-1;mouse.y=-((e.clientY/c.clientHeight)*2-1)}
    window.addEventListener('mousemove',mm)
    let id,t0=performance.now()
    const draw=()=>{const t=(performance.now()-t0)/1000;gl.clearColor(0.02,0.03,0.063,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(tL,t);gl.uniform2f(mL,mouse.x,mouse.y);gl.drawArrays(gl.POINTS,0,N);id=requestAnimationFrame(draw)}
    draw();return()=>{cancelAnimationFrame(id);window.removeEventListener('mousemove',mm);window.removeEventListener('resize',resize)}
  },[])
  return <canvas ref={cvs} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.6}}/>
}
export default function Hero(){
  const [show,setShow]=useState(false)
  const [hero,setHero]=useState(getHero)
  const [socials,setSocials]=useState(getSocials)
  useEffect(()=>{const t=setTimeout(()=>setShow(true),200);return()=>clearTimeout(t)},[])
  useEffect(()=>onUpdate(()=>{setHero(getHero());setSocials(getSocials())}),[])
  const roles=hero.roles||[]
  const seq=roles.flatMap(r=>[r,2000])
  const nameParts=hero.name?.split(' ')||['Abaid-ul','Rehman']
  return(
    <section id="home" style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr auto',alignItems:'center',gap:'3rem',padding:'120px 0 80px',position:'relative',overflow:'hidden'}}>
      <ParticleField/>
      {/* Geo decoration */}
      <div style={{position:'absolute',right:'-5%',top:'10%',width:'min(420px,45vw)',opacity:.5,zIndex:1,pointerEvents:'none',animation:'geo-spin 40s linear infinite'}}>
        <style>{`@keyframes geo-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}`}</style>
        <svg viewBox="0 0 400 400" fill="none"><circle cx="200" cy="200" r="160" stroke="rgba(91,79,255,0.12)" strokeWidth="1"/><circle cx="200" cy="200" r="110" stroke="rgba(0,229,255,0.08)" strokeWidth="1"/><polygon points="200,60 330,275 70,275" stroke="rgba(91,79,255,0.15)" strokeWidth="1" fill="none"/><polygon points="200,340 70,125 330,125" stroke="rgba(0,229,255,0.1)" strokeWidth="1" fill="none"/><circle cx="200" cy="60" r="3" fill="rgba(0,229,255,0.6)"/><circle cx="330" cy="275" r="3" fill="rgba(91,79,255,0.6)"/><circle cx="70" cy="275" r="3" fill="rgba(255,159,10,0.6)"/></svg>
      </div>
      {/* Content */}
      <div className="wrap" style={{display:'flex',flexDirection:'column',gap:'1.5rem',alignItems:'flex-start',position:'relative',zIndex:2,opacity:show?1:0,transform:show?'translateY(0)':'translateY(28px)',transition:'opacity .9s ease,transform .9s ease'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',padding:'.35rem .9rem',background:'rgba(91,79,255,.1)',border:'1px solid rgba(91,79,255,.22)',borderRadius:'100px',fontSize:'.75rem',fontWeight:500,color:'var(--text2)'}}>
          <span style={{width:'7px',height:'7px',borderRadius:'50%',background:hero.available?'#30D158':'#FF375F',boxShadow:`0 0 8px ${hero.available?'#30D158':'#FF375F'}`,animation:'pulse 2s ease infinite'}}/>
          <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}`}</style>
          {hero.available?'Available for work':'Not available'}<span style={{color:'var(--text3)'}}>·</span>{hero.location}
        </div>
        <h1 className="display" style={{lineHeight:.95}}>
          {nameParts[0]}<br/><span className="grad-text">{nameParts.slice(1).join(' ')}</span>
        </h1>
        <div style={{fontFamily:'var(--mono)',fontSize:'clamp(.85rem,1.6vw,1.1rem)',color:'var(--accent2)',letterSpacing:'.02em',minHeight:'1.6rem'}}>
          {seq.length>0&&<TypeAnimation key={JSON.stringify(roles)} sequence={seq} wrapper="span" speed={55} repeat={Infinity}/>}
          <span style={{display:'inline-block',color:'var(--cyan,#00E5FF)',marginLeft:'2px',animation:'blink 1.1s step-end infinite'}}>|</span>
        </div>
        <p style={{fontSize:'1.05rem',color:'var(--text2)',maxWidth:'540px',lineHeight:1.7}}>{hero.bio}</p>
        <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
          <button className="btn btn-fill" onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>View Projects</button>
          <button className="btn btn-ghost" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Hire Me</button>
        </div>
        <div style={{display:'flex',gap:'.5rem'}}>
          {socials.filter(s=>s.show&&s.url).map(s=>{const Icon=ICON_MAP[s.icon]||FiMail;return(
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'38px',height:'38px',borderRadius:'50%',color:'var(--text3)',border:'1px solid var(--border)',background:'var(--glass)',transition:'all .22s'}} title={s.platform} onMouseEnter={e=>{e.currentTarget.style.color='var(--accent2)';e.currentTarget.style.borderColor='rgba(91,79,255,.35)';e.currentTarget.style.background='rgba(91,79,255,.1)'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--text3)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--glass)'}}>
              <Icon size={18}/>
            </a>
          )})}
        </div>
        <div style={{display:'flex',gap:'2rem',paddingTop:'.5rem',borderTop:'1px solid var(--border)',width:'100%'}}>
          {(hero.stats||[]).map((s,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',gap:'.15rem'}}>
              <span style={{fontFamily:'var(--sans)',fontSize:'1.75rem',fontWeight:800,letterSpacing:'-.03em',background:'linear-gradient(135deg,var(--accent2),var(--cyan,#00E5FF))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{s.value}</span>
              <span style={{fontSize:'.7rem',color:'var(--text3)',fontWeight:500}}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Photo */}
      <div style={{opacity:show?1:0,transform:show?'translateX(0)':'translateX(32px)',transition:'opacity .9s .3s ease,transform .9s .3s ease',zIndex:2,position:'relative',flexShrink:0,paddingRight:'2rem'}}>
        <div style={{position:'relative',width:'clamp(200px,20vw,280px)',aspectRatio:'.8/1',borderRadius:'var(--r)',overflow:'hidden',border:'1px solid rgba(91,79,255,.3)',boxShadow:'0 0 40px rgba(91,79,255,.2)'}}>
          <img src="/profile.jpg" alt={hero.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
          <div style={{display:'none',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,var(--surface),var(--depth))',fontSize:'3rem',fontWeight:800,color:'var(--accent2)'}}>AR</div>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,8,16,.7) 0%,transparent 55%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'1rem',left:'1rem',display:'flex',alignItems:'center',gap:'.4rem',fontSize:'.7rem',fontWeight:600,color:'#fff',background:'rgba(91,79,255,.7)',backdropFilter:'blur(8px)',padding:'.28rem .8rem',borderRadius:'100px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#30D158',animation:'pulse 2s ease infinite'}}/>Full-Stack Dev
          </div>
        </div>
        <div style={{position:'absolute',bottom:'-40px',left:'50%',transform:'translateX(-50%)',width:'180px',height:'80px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(91,79,255,.3),transparent 70%)',pointerEvents:'none'}}/>
      </div>
      <button onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})} style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'.35rem',color:'var(--text3)',fontSize:'.62rem',letterSpacing:'.14em',textTransform:'uppercase',cursor:'none',animation:'bob 2.5s ease-in-out infinite',zIndex:2,background:'none',border:'none'}}>
        <FiArrowDown size={14}/><span>scroll</span>
      </button>
    </section>
  )
}
