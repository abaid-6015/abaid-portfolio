import React,{useState,useEffect,useRef} from 'react'
import {FiGithub,FiExternalLink,FiImage,FiX,FiChevronLeft,FiChevronRight,FiMaximize2} from 'react-icons/fi'
import {SiReact,SiMongodb,SiNodedotjs,SiMysql,SiFirebase,SiUnity,SiWordpress,SiFigma,SiPhp,SiPython,SiJavascript,SiCss3,SiHtml5} from 'react-icons/si'
import {DiJava} from 'react-icons/di'
import {HiOutlineGlobeAlt,HiOutlineCube,HiOutlineDesktopComputer,HiOutlineServer,HiOutlineAcademicCap,HiOutlinePencil,HiOutlineCollection} from 'react-icons/hi'
import {getProjects,onUpdate,getProjectImages,saveProjectImage,deleteProjectImage} from '../store/dataStore'

const TECH_ICONS={'React.js':SiReact,'React Native':SiReact,MongoDB:SiMongodb,'Node.js':SiNodedotjs,MySQL:SiMysql,Firebase:SiFirebase,Unity:SiUnity,WordPress:SiWordpress,Figma:SiFigma,PHP:SiPhp,Python:SiPython,Java:DiJava,JavaScript:SiJavascript,'CSS3':SiCss3,'HTML5':SiHtml5}
const TYPE_ICONS={'Web + Mobile':HiOutlineGlobeAlt,'Desktop App':HiOutlineDesktopComputer,'WebGL · 3D':HiOutlineCube,'Game Dev':HiOutlineCube,'Web App':HiOutlineServer,'Networking':HiOutlineAcademicCap,'Design':HiOutlinePencil,'WordPress':HiOutlineGlobeAlt}

const toBase64=(file)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})

function useInView(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.04});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}

function Lightbox({images,startIndex,onClose}){
  const[idx,setIdx]=useState(startIndex)
  useEffect(()=>{const fn=e=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')setIdx(i=>(i+1)%images.length);if(e.key==='ArrowLeft')setIdx(i=>(i-1+images.length)%images.length)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[images.length,onClose])
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.93)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:99999,padding:'1rem'}}>
      <button onClick={onClose} style={{position:'absolute',top:'1.25rem',right:'1.25rem',background:'rgba(255,255,255,.1)',border:'none',color:'#fff',width:'40px',height:'40px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}><FiX size={20}/></button>
      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',maxWidth:'min(1200px,95vw)',maxHeight:'85vh'}}>
        {images.length>1&&<button onClick={()=>setIdx(i=>(i-1+images.length)%images.length)} style={{position:'absolute',left:'-52px',background:'rgba(255,255,255,.12)',border:'none',color:'#fff',width:'44px',height:'44px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiChevronLeft size={24}/></button>}
        <img src={images[idx]?.src} alt={`Screenshot ${idx+1}`} style={{maxWidth:'100%',maxHeight:'80vh',objectFit:'contain',borderRadius:'12px',boxShadow:'0 0 60px rgba(0,0,0,.5)'}}/>
        {images.length>1&&<button onClick={()=>setIdx(i=>(i+1)%images.length)} style={{position:'absolute',right:'-52px',background:'rgba(255,255,255,.12)',border:'none',color:'#fff',width:'44px',height:'44px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiChevronRight size={24}/></button>}
      </div>
      {images.length>1&&<div style={{position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'.4rem'}}>{images.map((_,i)=><button key={i} onClick={()=>setIdx(i)} style={{width:'7px',height:'7px',borderRadius:'50%',background:i===idx?'#fff':'rgba(255,255,255,.3)',border:'none',cursor:'pointer'}}/>)}</div>}
      <div style={{position:'absolute',bottom:'1rem',right:'1rem',fontSize:'.72rem',color:'rgba(255,255,255,.4)',fontFamily:'var(--mono)'}}>{idx+1}/{images.length}</div>
    </div>
  )
}

function ImageUploader({projectId,onClose}){
  const[images,setImages]=useState(()=>getProjectImages(projectId))
  const[dragging,setDrag]=useState(false)
  const[loading,setLoad]=useState(false)
  const inputRef=useRef(null)
  const handleFiles=async(files)=>{
    setLoad(true)
    for(const file of Array.from(files)){
      if(!file.type.startsWith('image/'))continue
      try{
        const b64=await toBase64(file)
        const img=new Image();img.src=b64;await new Promise(r=>img.onload=r)
        const MAX=1200,scale=Math.min(1,MAX/img.width)
        const canvas=document.createElement('canvas');canvas.width=img.width*scale;canvas.height=img.height*scale
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height)
        const compressed=canvas.toDataURL('image/jpeg',.75)
        const nextIdx=Date.now()
        saveProjectImage(projectId,nextIdx,compressed)
        setImages(getProjectImages(projectId))
        await new Promise(r=>setTimeout(r,50))
      }catch(e){console.error(e)}
    }
    setLoad(false)
    window.dispatchEvent(new CustomEvent('portfolio:updated'))
  }
  const del=(idx)=>{deleteProjectImage(projectId,idx);setImages(getProjectImages(projectId));window.dispatchEvent(new CustomEvent('portfolio:updated'))}
  return(
    <div style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:'1rem',marginTop:'.25rem',display:'flex',flexDirection:'column',gap:'.75rem',zIndex:2,position:'relative'}} onClick={e=>e.stopPropagation()}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'.82rem',fontWeight:600,color:'var(--text)'}}>
        <span>📸 Project Screenshots ({images.length})</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',display:'flex',alignItems:'center'}}><FiX size={16}/></button>
      </div>
      <div onClick={()=>!loading&&inputRef.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files)}}
        style={{border:`1.5px dashed ${dragging?'rgba(91,79,255,.5)':'rgba(255,255,255,.1)'}`,borderRadius:'10px',padding:'1.25rem',textAlign:'center',cursor:'pointer',background:dragging?'rgba(91,79,255,.06)':'rgba(255,255,255,.02)',display:'flex',flexDirection:'column',alignItems:'center',gap:'.4rem',color:'var(--text3)',fontSize:'.82rem',transition:'all .2s'}}>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>handleFiles(e.target.files)}/>
        <FiImage size={24} style={{opacity:.6}}/>
        {loading?<span>Processing...</span>:<span>Drop images here or click to browse</span>}
        <small style={{fontSize:'.68rem',opacity:.6}}>PNG, JPG, WebP · Multiple allowed</small>
      </div>
      {images.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:'.5rem'}}>
          {images.map((img,i)=>(
            <div key={img.index} style={{position:'relative',aspectRatio:1,borderRadius:'7px',overflow:'hidden',border:'1px solid rgba(255,255,255,.08)'}}>
              <img src={img.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              <button onClick={()=>del(img.index)} style={{position:'absolute',top:'3px',right:'3px',background:'rgba(0,0,0,.75)',border:'none',color:'#fff',width:'18px',height:'18px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem'}}>×</button>
            </div>
          ))}
        </div>
      )}
      <p style={{fontSize:'.68rem',color:'var(--text3)',fontStyle:'italic'}}>Images saved in browser. Use Admin → Settings → Export to back up.</p>
    </div>
  )
}

function ProjectCard({project,index,inView}){
  const[hov,setHov]=useState(false)
  const[showUploader,setShowUploader]=useState(false)
  const[lightbox,setLightbox]=useState(null)
  const[images,setImages]=useState(()=>getProjectImages(project.id))
  useEffect(()=>onUpdate(()=>setImages(getProjectImages(project.id))),[project.id])
  const TypeIcon=TYPE_ICONS[project.type]||HiOutlineCollection
  const techIcons=(project.tech||[]).map(t=>({name:t,Icon:TECH_ICONS[t]})).filter(x=>x.Icon)
  return(
    <div className="bento" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',flexDirection:'column',gap:'.85rem',padding:'1.5rem',position:'relative',overflow:'hidden',opacity:inView?1:0,transform:inView?'translateY(0)':'translateY(20px)',transition:`opacity .5s ease ${Math.min(index*.06,.5)}s,transform .5s ease ${Math.min(index*.06,.5)}s,border-color .28s,box-shadow .28s`,borderColor:hov?`${project.color}50`:'var(--border)',boxShadow:hov?`0 0 40px ${project.color}18`:'none'}}>
      {/* Glow */}
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at top left,${project.color},transparent 60%)`,opacity:hov?.16:0,pointerEvents:'none',transition:'opacity .4s',zIndex:0}}/>
      {/* Screenshot preview */}
      {images.length>0&&(
        <div onClick={()=>setLightbox(0)} style={{position:'relative',borderRadius:'10px',overflow:'hidden',aspectRatio:'16/9',background:'rgba(255,255,255,.03)',cursor:'pointer',flexShrink:0,zIndex:1}}>
          <img src={images[0].src} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .35s ease'}} onMouseEnter={e=>e.target.style.transform='scale(1.03)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
          {images.length>1&&<div style={{position:'absolute',bottom:'.5rem',right:'.5rem',display:'flex',alignItems:'center',gap:'.3rem',background:'rgba(0,0,0,.65)',backdropFilter:'blur(8px)',color:'#fff',fontSize:'.68rem',padding:'.25rem .6rem',borderRadius:'50px'}}><FiMaximize2 size={11}/> +{images.length} photos</div>}
        </div>
      )}
      {/* Head */}
      <div style={{display:'flex',alignItems:'center',gap:'.7rem',position:'relative',zIndex:1}}>
        <div style={{width:'36px',height:'36px',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',background:`${project.color}18`,border:`1px solid ${project.color}30`,flexShrink:0}}>
          <TypeIcon size={18} style={{color:project.color}}/>
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:'.63rem',padding:'.22rem .6rem',borderRadius:'50px',fontWeight:500,color:project.color,background:`${project.color}12`}}>{project.tag||project.type}</span>
        {project.featured&&<span style={{marginLeft:'auto',fontSize:'.8rem',opacity:.8}}>⭐</span>}
      </div>
      <h3 style={{fontSize:'1rem',fontWeight:700,color:'var(--text)',lineHeight:1.3,position:'relative',zIndex:1}}>{project.title}</h3>
      <p style={{fontSize:'.82rem',color:'var(--text2)',lineHeight:1.68,flex:1,position:'relative',zIndex:1}}>{project.desc}</p>
      {/* Tech */}
      <div style={{display:'flex',alignItems:'center',gap:'.45rem',flexWrap:'wrap',position:'relative',zIndex:1}}>
        {techIcons.slice(0,6).map(({name,Icon})=><span key={name} title={name} style={{color:project.color,opacity:.75,display:'flex',alignItems:'center'}}><Icon size={14}/></span>)}
        {(project.tech||[]).filter(t=>!TECH_ICONS[t]).map(t=><span key={t} className="chip" style={{fontSize:'.65rem',padding:'.2rem .5rem'}}>{t}</span>)}
      </div>
      {/* Actions */}
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',position:'relative',zIndex:1,marginTop:'auto',paddingTop:'.25rem'}}>
        {project.github&&<a href={project.github} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'.35rem',padding:'.35rem .8rem',borderRadius:'7px',fontSize:'.73rem',fontWeight:500,color:'var(--text2)',border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.04)',textDecoration:'none',transition:'all .2s'}}><FiGithub size={13}/>Code</a>}
        {project.live&&<a href={project.live} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'.35rem',padding:'.35rem .8rem',borderRadius:'7px',fontSize:'.73rem',fontWeight:600,color:project.color,border:`1px solid ${project.color}45`,background:`${project.color}0e`,textDecoration:'none',transition:'all .2s'}}><FiExternalLink size={13}/>Live Demo</a>}
        <button onClick={()=>setShowUploader(v=>!v)} style={{display:'inline-flex',alignItems:'center',gap:'.35rem',padding:'.35rem .8rem',borderRadius:'7px',fontSize:'.73rem',fontWeight:images.length>0?600:500,color:images.length>0?'var(--accent2)':'var(--text2)',border:`1px solid ${images.length>0?'rgba(91,79,255,.35)':'rgba(255,255,255,.1)'}`,background:images.length>0?'rgba(91,79,255,.08)':'rgba(255,255,255,.04)',cursor:'none',transition:'all .2s'}}>
          <FiImage size={13}/>{images.length>0?`${images.length} Photo${images.length>1?'s':''}`:'Add Photos'}
        </button>
      </div>
      {showUploader&&<ImageUploader projectId={project.id} onClose={()=>setShowUploader(false)}/>}
      {lightbox!==null&&<Lightbox images={images} startIndex={lightbox} onClose={()=>setLightbox(null)}/>}
    </div>
  )
}

export default function Projects(){
  const[ref,inView]=useInView()
  const[projects,setProjects]=useState(getProjects)
  const[filter,setFilter]=useState('All')
  const[search,setSearch]=useState('')
  useEffect(()=>onUpdate(()=>setProjects(getProjects())),[])
  const visible=projects.filter(p=>{
    const matchType=filter==='All'||p.type===filter||p.tag===filter
    const matchSearch=!search.trim()||p.title.toLowerCase().includes(search.toLowerCase())||p.desc?.toLowerCase().includes(search.toLowerCase())||(p.tech||[]).some(t=>t.toLowerCase().includes(search.toLowerCase()))
    return matchType&&matchSearch
  })
  const featured=visible.filter(p=>p.featured)
  const others=visible.filter(p=>!p.featured)
  const types=['All',...new Set(projects.map(p=>p.type||p.tag).filter(Boolean))]
  return(
    <section id="projects" style={{background:'var(--depth)',padding:'100px 0'}}>
      <div className="wrap">
        <div className="label">Projects</div>
        <h2 className="heading" style={{marginTop:'.5rem'}}>Things I've <span className="grad-text">built</span></h2>
        <p style={{fontSize:'.95rem',color:'var(--text2)',marginTop:'.5rem',marginBottom:'2rem'}}>Real-world applications from concept to deployment — <strong style={{color:'var(--accent2)'}}>{projects.length} projects</strong> total</p>
        {/* Controls */}
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'1.5rem'}}>
          <div style={{position:'relative',maxWidth:'420px'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects, tech, keywords..." style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'50px',padding:'.65rem 2.5rem .65rem 1.2rem',color:'var(--text)',fontFamily:'var(--sans)',fontSize:'.875rem',outline:'none'}}/>
            {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:'.75rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text3)',cursor:'pointer',display:'flex',alignItems:'center'}}><FiX size={14}/></button>}
          </div>
          <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{padding:'.38rem .9rem',borderRadius:'50px',fontSize:'.75rem',fontWeight:500,color:filter===t?'var(--accent2)':'var(--text2)',background:filter===t?'rgba(91,79,255,.12)':'rgba(255,255,255,.03)',border:`1px solid ${filter===t?'rgba(91,79,255,.3)':'rgba(255,255,255,.08)'}`,cursor:'none',transition:'all .2s'}}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {(search||filter!=='All')&&<p style={{fontSize:'.78rem',color:'var(--text3)',marginBottom:'1rem',fontFamily:'var(--mono)'}}>Showing <strong style={{color:'var(--text2)'}}>{visible.length}</strong> of <strong style={{color:'var(--text2)'}}>{projects.length}</strong> projects</p>}
        {/* Featured */}
        {featured.length>0&&(<>
          <div style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--text2)',letterSpacing:'.08em',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',padding:'.3rem .85rem',borderRadius:'50px',display:'inline-block',marginBottom:'1.25rem'}}>⭐ Featured</div>
          <div ref={ref} style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'1.25rem',marginBottom:'1.25rem'}}>
            {featured.map((p,i)=><ProjectCard key={p.id} project={p} index={i} inView={inView}/>)}
          </div>
        </>)}
        {/* Others */}
        {others.length>0&&(<>
          <div style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'var(--text2)',letterSpacing:'.08em',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',padding:'.3rem .85rem',borderRadius:'50px',display:'inline-block',marginBottom:'1.25rem',marginTop:featured.length>0?'1rem':0}}>📁 {featured.length>0?'Other Projects':'All Projects'}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'1.25rem'}}>
            {others.map((p,i)=><ProjectCard key={p.id} project={p} index={featured.length+i} inView={inView}/>)}
          </div>
        </>)}
        {visible.length===0&&(
          <div style={{textAlign:'center',padding:'4rem 2rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
            <div style={{fontSize:'3rem',opacity:.4}}>🔍</div>
            <div style={{fontSize:'1.1rem',fontWeight:600,color:'var(--text2)'}}>No projects found</div>
            <button onClick={()=>{setFilter('All');setSearch('')}} style={{padding:'.4rem 1rem',borderRadius:'50px',fontSize:'.8rem',color:'var(--accent2)',border:'1px solid rgba(91,79,255,.3)',background:'rgba(91,79,255,.1)',cursor:'none'}}>Clear filters</button>
          </div>
        )}
        <div style={{textAlign:'center',marginTop:'2.5rem'}}>
          <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><FiGithub size={15}/>View all on GitHub</a>
        </div>
      </div>
    </section>
  )
}
