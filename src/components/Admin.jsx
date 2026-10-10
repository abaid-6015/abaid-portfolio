import React,{useState,useEffect,useRef} from 'react'
import {getHero,saveHero,getSocials,saveSocials,getAbout,saveAbout,getContact,saveContact,getSkills,addSkill,updateSkill,deleteSkill,getProjects,addProject,updateProject,deleteProject,getExperiences,addExperience,updateExperience,deleteExperience,getEducation,addEducation,updateEducation,deleteEducation,resetAll,exportData,importData,DEFAULTS,getProjectImages,saveProjectImage,deleteProjectImage} from '../store/dataStore'

const uid=()=>Math.random().toString(36).slice(2,9)
const toB64=(f)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})
const COLORS=['#5B4FFF','#00E5FF','#FF375F','#FF9F0A','#30D158','#A78BFA','#C2727A','#D4A85A','#7FB5A0','#8b5cf6']

// Shared sub-components
function Saved({show}){return show?<span style={{fontSize:'.75rem',color:'#30D158',fontFamily:'monospace',animation:'fadein .3s ease'}}>✓ Saved</span>:null}
function ColorPicker({value,onChange}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'.4rem',flexWrap:'wrap'}}>
      {COLORS.map(c=><button key={c} type="button" onClick={()=>onChange(c)} style={{width:'26px',height:'26px',borderRadius:'50%',background:c,border:value===c?'2px solid #fff':'2px solid transparent',cursor:'none',boxShadow:value===c?`0 0 0 3px rgba(255,255,255,.15)`:'none',transition:'all .15s'}}/>)}
      <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{width:'36px',height:'26px',borderRadius:'6px',border:'1px solid rgba(255,255,255,.1)',cursor:'none',padding:0,background:'none'}} title="Custom color"/>
    </div>
  )
}
function TagInput({value,onChange,placeholder}){
  const[inp,setInp]=useState('')
  const add=()=>{const items=inp.split(',').map(s=>s.trim()).filter(Boolean);if(!items.length)return;onChange([...new Set([...value,...items])]);setInp('')}
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
      <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem',minHeight:'28px'}}>
        {value.map((t,i)=><span key={i} style={{display:'inline-flex',alignItems:'center',gap:'.3rem',padding:'.22rem .6rem',borderRadius:'100px',background:'rgba(91,79,255,.12)',border:'1px solid rgba(91,79,255,.25)',fontSize:'.72rem',color:'var(--accent2,#7B6FFF)'}}>{t}<button type="button" onClick={()=>onChange(value.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'#4a5568',cursor:'none',fontSize:'.9rem',lineHeight:1}}>×</button></span>)}
      </div>
      <div style={{display:'flex',gap:'.5rem'}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} placeholder={placeholder||'Type and press Enter'} onKeyDown={e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();add()}}} style={inp_s}/>
        <button type="button" onClick={add} style={btn_sm}>Add</button>
      </div>
    </div>
  )
}
function Modal({title,onClose,children}){
  useEffect(()=>{const fn=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',fn);return()=>document.removeEventListener('keydown',fn)},[onClose])
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'1rem'}}>
      <div style={{background:'#0c1128',border:'1px solid rgba(91,79,255,.25)',borderRadius:'16px',width:'100%',maxWidth:'560px',maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 0 60px rgba(91,79,255,.15)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.25rem 1.5rem',borderBottom:'1px solid rgba(255,255,255,.07)',flexShrink:0}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,color:'#EDF2FF'}}>{title}</h3>
          <button onClick={onClose} style={{width:'28px',height:'28px',borderRadius:'6px',background:'none',border:'none',color:'#6a7f99',cursor:'none',fontSize:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
        <div style={{overflowY:'auto',padding:'1.5rem',flex:1}}>{children}</div>
      </div>
    </div>
  )
}

// Shared input styles
const inp_s={background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'8px',padding:'.7rem .9rem',color:'#EDF2FF',fontFamily:'inherit',fontSize:'.88rem',outline:'none',width:'100%'}
const ta_s={...inp_s,resize:'vertical',minHeight:'80px'}
const lbl_s={fontFamily:'monospace',fontSize:'.7rem',fontWeight:600,color:'#8892a4',letterSpacing:'.06em',textTransform:'uppercase',display:'block',marginBottom:'.35rem'}
const btn_sm={padding:'.45rem .85rem',background:'rgba(91,79,255,.12)',borderWidth:'1px',borderStyle:'solid',borderColor:'rgba(91,79,255,.25)',borderRadius:'6px',fontSize:'.78rem',fontWeight:600,color:'#7B6FFF',cursor:'none',whiteSpace:'nowrap',flexShrink:0}
const btn_save={padding:'.6rem 1.4rem',background:'rgba(91,79,255,.9)',border:'none',borderRadius:'8px',fontSize:'.85rem',fontWeight:600,color:'#fff',cursor:'none'}
const btn_cancel={padding:'.6rem 1.2rem',background:'transparent',border:'1px solid rgba(255,255,255,.1)',borderRadius:'8px',fontSize:'.85rem',color:'#6a7f99',cursor:'none'}
const card_s={background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'12px',padding:'1.25rem',marginBottom:'0'}
const row_s={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}

// ── HERO PANEL ──────────────────────────────────────────
function HeroPanel(){
  const[d,setD]=useState(getHero);const[saved,setSaved]=useState(false)
  const persist=(next)=>{setD(next);saveHero(next);setSaved(true);setTimeout(()=>setSaved(false),2000)}
  const upd=(k,v)=>persist({...d,[k]:v})
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Hero Section</h2><Saved show={saved}/></div>
      <div style={row_s}>
        <div><label style={lbl_s}>Full Name</label><input style={inp_s} value={d.name} onChange={e=>upd('name',e.target.value)}/></div>
        <div><label style={lbl_s}>Location</label><input style={inp_s} value={d.location} onChange={e=>upd('location',e.target.value)}/></div>
      </div>
      <div><label style={lbl_s}>Tagline</label><input style={inp_s} value={d.tagline} onChange={e=>upd('tagline',e.target.value)}/></div>
      <div><label style={lbl_s}>Bio Paragraph</label><textarea style={ta_s} rows="3" value={d.bio} onChange={e=>upd('bio',e.target.value)}/></div>
      <div><label style={lbl_s}>Animated Roles (one per line)</label><textarea style={ta_s} rows="6" value={(d.roles||[]).join('\n')} onChange={e=>upd('roles',e.target.value.split('\n').filter(Boolean))}/><p style={{fontSize:'.7rem',color:'#4a5568',marginTop:'.4rem'}}>Each line cycles in the typing animation</p></div>
      <label style={{...lbl_s,display:'flex',alignItems:'center',gap:'.5rem',textTransform:'none',letterSpacing:0,cursor:'none'}}>
        <input type="checkbox" checked={d.available} onChange={e=>upd('available',e.target.checked)}/>
        <span style={{fontFamily:'inherit',color:'#8892a4',fontSize:'.85rem'}}>Show "Available for work" badge</span>
      </label>
      <div><label style={lbl_s}>Stats</label>
        <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
          {(d.stats||[]).map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
              <input style={{...inp_s,width:'80px',flexShrink:0}} value={s.value} placeholder="8+" onChange={e=>{const ns=[...d.stats];ns[i]={...s,value:e.target.value};upd('stats',ns)}}/>
              <input style={{...inp_s,flex:1}} value={s.label} placeholder="Projects Built" onChange={e=>{const ns=[...d.stats];ns[i]={...s,label:e.target.value};upd('stats',ns)}}/>
              <button type="button" onClick={()=>upd('stats',d.stats.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'#4a5568',cursor:'none',fontSize:'1.1rem'}}>×</button>
            </div>
          ))}
          <button type="button" onClick={()=>upd('stats',[...(d.stats||[]),{value:'',label:''}])} style={btn_sm}>+ Add Stat</button>
        </div>
      </div>
    </div>
  )
}

// ── SOCIALS PANEL ────────────────────────────────────────
const PLAT=['LinkedIn','GitHub','Upwork','Fiverr','Email','Twitter/X','Instagram','YouTube','Website','Other']
function SocialsPanel(){
  const[socials,setSocials]=useState(getSocials);const[saved,setSaved]=useState(false)
  const persist=(next)=>{setSocials(next);saveSocials(next);setSaved(true);setTimeout(()=>setSaved(false),2000)}
  const upd=(id,k,v)=>persist(socials.map(s=>s.id===id?{...s,[k]:v}:s))
  const add=()=>persist([...socials,{id:uid(),platform:'New Link',url:'',icon:'link',show:true}])
  const del=(id)=>persist(socials.filter(s=>s.id!==id))
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Social & Profile Links</h2><Saved show={saved}/></div>
      <p style={{fontSize:'.85rem',color:'#6a7f99'}}>These links appear everywhere — Navbar, Hero, About, Contact, Footer.</p>
      <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
        {socials.map(s=>(
          <div key={s.id} style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1rem',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px'}}>
            <select value={s.platform} onChange={e=>upd(s.id,'platform',e.target.value)} style={{...inp_s,width:'130px',flexShrink:0,padding:'.55rem .7rem',fontSize:'.8rem'}}>
              {PLAT.map(p=><option key={p}>{p}</option>)}
            </select>
            <input value={s.url} onChange={e=>upd(s.id,'url',e.target.value)} placeholder="https://..." style={{...inp_s,flex:1}}/>
            <label style={{position:'relative',width:'38px',height:'20px',flexShrink:0,cursor:'none'}}>
              <input type="checkbox" checked={s.show} onChange={e=>upd(s.id,'show',e.target.checked)} style={{opacity:0,width:0,height:0,position:'absolute'}}/>
              <span style={{position:'absolute',inset:0,background:s.show?'rgba(48,209,88,.3)':'rgba(255,255,255,.1)',borderRadius:'100px',transition:'.25s',cursor:'none'}}/>
              <span style={{position:'absolute',width:'14px',height:'14px',borderRadius:'50%',background:s.show?'#30D158':'#6a7f99',left:'3px',top:'3px',transform:s.show?'translateX(18px)':'translateX(0)',transition:'.25s'}}/>
            </label>
            <button type="button" onClick={()=>del(s.id)} style={{background:'none',border:'none',color:'#4a5568',cursor:'none',fontSize:'1.1rem',opacity:.65}}>🗑️</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={btn_sm}>+ Add Link</button>
    </div>
  )
}

// ── ABOUT PANEL ──────────────────────────────────────────
function AboutPanel(){
  const[d,setD]=useState(getAbout);const[saved,setSaved]=useState(false)
  const persist=(next)=>{setD(next);saveAbout(next);setSaved(true);setTimeout(()=>setSaved(false),2000)}
  const upd=(k,v)=>persist({...d,[k]:v})
  const updInfo=(i,k,v)=>{const ni=[...d.info];ni[i]={...ni[i],[k]:v};upd('info',ni)}
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>About Section</h2><Saved show={saved}/></div>
      <div><label style={lbl_s}>Section Heading</label><input style={inp_s} value={d.heading} onChange={e=>upd('heading',e.target.value)}/></div>
      {['bio1','bio2','bio3'].map((k,i)=>(<div key={k}><label style={lbl_s}>Bio Paragraph {i+1}</label><textarea style={ta_s} rows="3" value={d[k]||''} onChange={e=>upd(k,e.target.value)}/></div>))}
      <div><label style={lbl_s}>Info Card Rows</label>
        <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
          {(d.info||[]).map((row,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
              <input style={{...inp_s,width:'120px',flexShrink:0}} value={row.label} placeholder="Label" onChange={e=>updInfo(i,'label',e.target.value)}/>
              <input style={{...inp_s,flex:1}} value={row.value} placeholder="Value" onChange={e=>updInfo(i,'value',e.target.value)}/>
              <button type="button" onClick={()=>upd('info',d.info.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'#4a5568',cursor:'none',fontSize:'1.1rem'}}>×</button>
            </div>
          ))}
          <button type="button" onClick={()=>upd('info',[...(d.info||[]),{label:'',value:''}])} style={btn_sm}>+ Add Row</button>
        </div>
      </div>
    </div>
  )
}

// ── CONTACT PANEL ────────────────────────────────────────
function ContactPanel(){
  const[d,setD]=useState(getContact);const[saved,setSaved]=useState(false);const[ts,setTs]=useState('idle')
  const persist=(next)=>{setD(next);saveContact(next);setSaved(true);setTimeout(()=>setSaved(false),2000)}
  const upd=(k,v)=>persist({...d,[k]:v})
  const test=async()=>{
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test((d.scriptUrl||'').trim()))return alert('Enter a valid Google Apps Script /exec URL first')
    setTs('sending')
    try{await fetch(d.scriptUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({name:'Admin Test',email:d.email,subject:'Test from Admin Panel',message:'✅ Your contact form is working correctly!'})});setTs('ok');setTimeout(()=>setTs('idle'),4000)}
    catch{setTs('err');setTimeout(()=>setTs('idle'),4000)}
  }
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Contact Section</h2><Saved show={saved}/></div>
      <div><label style={lbl_s}>Section Heading</label><input style={inp_s} value={d.heading} onChange={e=>upd('heading',e.target.value)}/></div>
      <div><label style={lbl_s}>Sub-text</label><input style={inp_s} value={d.subtext} onChange={e=>upd('subtext',e.target.value)}/></div>
      <div style={row_s}>
        <div><label style={lbl_s}>Email</label><input style={inp_s} type="email" value={d.email} onChange={e=>upd('email',e.target.value)}/></div>
        <div><label style={lbl_s}>Phone</label><input style={inp_s} value={d.phone} onChange={e=>upd('phone',e.target.value)}/></div>
      </div>
      <div><label style={lbl_s}>Location</label><input style={inp_s} value={d.location} onChange={e=>upd('location',e.target.value)}/></div>
      <div><label style={lbl_s}>Google Apps Script URL</label><input style={inp_s} value={d.scriptUrl} onChange={e=>upd('scriptUrl',e.target.value)} placeholder="https://script.google.com/macros/s/.../exec"/><p style={{fontSize:'.7rem',color:'#4a5568',marginTop:'.4rem'}}>All contact form messages are sent to this URL</p></div>
      <button type="button" onClick={test} style={{...btn_sm,color:ts==='ok'?'#30D158':ts==='err'?'#FF375F':'#00E5FF',borderColor:ts==='ok'?'rgba(48,209,88,.3)':ts==='err'?'rgba(255,55,95,.3)':'rgba(0,229,255,.25)',background:ts==='ok'?'rgba(48,209,88,.1)':ts==='err'?'rgba(255,55,95,.1)':'rgba(0,229,255,.1)',alignSelf:'flex-start',padding:'.7rem 1.4rem'}}>
        {ts==='idle'&&'📧 Send Test Email'}{ts==='sending'&&'⏳ Sending...'}{ts==='ok'&&'✅ Test submitted — check inbox'}{ts==='err'&&'❌ Failed — check URL'}
      </button>
    </div>
  )
}

// ── SKILLS PANEL ─────────────────────────────────────────
function SkillsPanel(){
  const[cats,setCats]=useState(getSkills);const[modal,setModal]=useState(null);const[form,setForm]=useState({category:'',color:'#5B4FFF',items:[]});const[newName,setNewName]=useState('');const[newPct,setNewPct]=useState(80)
  const openAdd=()=>{setForm({category:'',color:'#5B4FFF',items:[]});setNewName('');setNewPct(80);setModal({mode:'add'})}
  const openEdit=g=>{setForm({...g,items:[...g.items]});setNewName('');setNewPct(80);setModal({mode:'edit',id:g.id})}
  const addItem=()=>{if(!newName.trim())return;setForm(f=>({...f,items:[...f.items,{name:newName.trim(),pct:+newPct}]}));setNewName('');setNewPct(80)}
  const save=()=>{if(!form.category.trim())return;const next=modal.mode==='add'?addSkill(form):updateSkill(modal.id,form);setCats(next);setModal(null)}
  const del=id=>{if(!confirm('Delete skill group?'))return;setCats(deleteSkill(id))}
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Skills <span style={{fontSize:'.72rem',color:'#4a5568',fontFamily:'monospace'}}>{cats.length} groups</span></h2><button style={btn_sm} onClick={openAdd}>+ Add Group</button></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
        {cats.map(g=>(
          <div key={g.id} style={{...card_s,border:`1px solid ${g.color}25`}}>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.75rem'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:g.color,flexShrink:0}}/>
              <span style={{fontSize:'.9rem',fontWeight:600,color:'#EDF2FF',flex:1}}>{g.category}</span>
              <span style={{fontSize:'.7rem',color:'#4a5568',fontFamily:'monospace'}}>{g.items.length}</span>
              <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>openEdit(g)}>✏️</button>
              <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>del(g.id)}>🗑️</button>
            </div>
            {g.items.map((it,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.5rem'}}>
                <span style={{fontSize:'.78rem',color:'#8892a4',flex:1}}>{it.name}</span>
                <div style={{flex:2,height:'3px',background:'rgba(255,255,255,.07)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',background:g.color,width:`${it.pct}%`,borderRadius:'2px'}}/></div>
                <span style={{fontSize:'.68rem',color:'#4a5568',fontFamily:'monospace',width:'30px',textAlign:'right'}}>{it.pct}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title={modal.mode==='add'?'Add Skill Group':'Edit Skill Group'} onClose={()=>setModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={lbl_s}>Category Name *</label><input style={inp_s} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="e.g. Frontend"/></div>
            <div><label style={lbl_s}>Color</label><ColorPicker value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/></div>
            <div><label style={lbl_s}>Add Skill</label>
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                <input style={inp_s} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Skill name" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addItem()}}}/>
                <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                  <input type="range" min="1" max="100" value={newPct} onChange={e=>setNewPct(e.target.value)} style={{flex:1}}/>
                  <span style={{fontFamily:'monospace',fontSize:'.78rem',color:'#8892a4',width:'36px'}}>{newPct}%</span>
                </div>
                <button type="button" style={btn_sm} onClick={addItem}>Add Skill</button>
              </div>
            </div>
            {form.items.length>0&&<div>
              {form.items.map((it,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.4rem .6rem',background:'rgba(255,255,255,.02)',borderRadius:'6px',marginBottom:'.35rem'}}>
                  <span style={{fontSize:'.82rem',color:'#8892a4',flex:1}}>{it.name}</span>
                  <input type="range" min="1" max="100" value={it.pct} onChange={e=>setForm(f=>({...f,items:f.items.map((x,j)=>j===i?{...x,pct:+e.target.value}:x)}))} style={{flex:1}}/>
                  <span style={{fontFamily:'monospace',fontSize:'.72rem',color:'#4a5568',width:'30px'}}>{it.pct}%</span>
                  <button type="button" style={{background:'none',border:'none',color:'#4a5568',cursor:'none'}} onClick={()=>setForm(f=>({...f,items:f.items.filter((_,j)=>j!==i)}))}>×</button>
                </div>
              ))}
            </div>}
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
              <button type="button" style={btn_cancel} onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" style={btn_save} onClick={save}>{modal.mode==='add'?'Add Group':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── PROJECTS PANEL ───────────────────────────────────────
const EP={title:'',desc:'',tech:[],type:'',color:'#5B4FFF',featured:false,github:'',live:'',tag:''}
function ProjectsPanel(){
  const[projects,setProjects]=useState(getProjects);const[modal,setModal]=useState(null);const[form,setForm]=useState(EP);const[imgFor,setImgFor]=useState(null);const[loading,setLoad]=useState(false);const inputRef=useRef(null)
  const openAdd=()=>{setForm({...EP,tech:[]});setModal({mode:'add'})}
  const openEdit=p=>{setForm({...p,tech:[...p.tech]});setModal({mode:'edit',id:p.id})}
  const save=()=>{if(!form.title.trim())return;const next=modal.mode==='add'?addProject(form):updateProject(modal.id,form);setProjects(next);setModal(null)}
  const del=id=>{if(!confirm('Delete project?'))return;setProjects(deleteProject(id))}
  const toggle=id=>setProjects(updateProject(id,{featured:!projects.find(p=>p.id===id).featured}))
  const getImgCount=id=>{try{return JSON.parse(localStorage.getItem(`proj_imgs_${id}`)||'[]').length}catch{return 0}}
  const handleFiles=async(files,projectId)=>{
    setLoad(true)
    for(const file of Array.from(files)){
      if(!file.type.startsWith('image/'))continue
      try{
        const b64=await toB64(file);const img=new Image();img.src=b64;await new Promise(r=>img.onload=r)
        const MAX=1200,scale=Math.min(1,MAX/img.width)
        const canvas=document.createElement('canvas');canvas.width=img.width*scale;canvas.height=img.height*scale
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height)
        saveProjectImage(projectId,Date.now(),canvas.toDataURL('image/jpeg',.75))
        await new Promise(r=>setTimeout(r,50))
      }catch(e){console.error(e)}
    }
    setLoad(false);window.dispatchEvent(new CustomEvent('portfolio:updated'))
  }
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Projects <span style={{fontSize:'.72rem',color:'#4a5568',fontFamily:'monospace'}}>{projects.length} total — all displayed</span></h2><button style={btn_sm} onClick={openAdd}>+ Add Project</button></div>
      <p style={{fontSize:'.83rem',color:'#6a7f99'}}>All projects are shown on the portfolio. Add screenshots with 📸. Use ⭐ to mark as featured (shown first).</p>
      <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
        {projects.map((p,i)=>{
          const imgCount=getImgCount(p.id)
          return(
            <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',padding:'.85rem 1rem',background:'rgba(255,255,255,.03)',border:`1px solid rgba(255,255,255,.06)`,borderLeft:`3px solid ${p.color}`,borderRadius:'10px',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.65rem',flex:1,minWidth:0}}>
                <span style={{fontFamily:'monospace',fontSize:'.7rem',color:'#4a5568',flexShrink:0}}>#{String(i+1).padStart(2,'0')}</span>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:p.color,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:'.88rem',fontWeight:600,color:'#EDF2FF'}}>{p.title}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'.4rem',flexWrap:'wrap',marginTop:'.2rem'}}>
                    <span style={{fontSize:'.65rem',padding:'.2rem .55rem',borderRadius:'100px',background:'rgba(255,255,255,.06)',color:'#6a7f99'}}>{p.type||p.tag}</span>
                    {p.featured&&<span style={{fontSize:'.65rem',padding:'.2rem .55rem',borderRadius:'100px',background:'rgba(255,159,10,.1)',color:'#FF9F0A'}}>⭐ Featured</span>}
                    {p.live&&<span style={{fontSize:'.65rem',padding:'.2rem .55rem',borderRadius:'100px',background:'rgba(48,209,88,.1)',color:'#30D158'}}>🔴 Live</span>}
                    {imgCount>0&&<span style={{fontSize:'.65rem',padding:'.2rem .55rem',borderRadius:'100px',background:'rgba(91,79,255,.1)',color:'#7B6FFF'}}>📸 {imgCount}</span>}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.4rem',flexShrink:0}}>
                <button type="button" onClick={()=>setImgFor(imgFor===p.id?null:p.id)} style={{background:'none',border:'none',cursor:'none',fontSize:'1rem',opacity:imgCount>0?1:.5}} title="Manage screenshots">📸</button>
                <button type="button" onClick={()=>toggle(p.id)} style={{background:'none',border:'none',cursor:'none',fontSize:'1.1rem',color:p.featured?'#FF9F0A':'#4a5568'}}>{p.featured?'★':'☆'}</button>
                <button style={{background:'none',border:'none',cursor:'none',fontSize:'.95rem',opacity:.65}} onClick={()=>openEdit(p)}>✏️</button>
                <button style={{background:'none',border:'none',cursor:'none',fontSize:'.95rem',opacity:.65}} onClick={()=>del(p.id)}>🗑️</button>
              </div>
              {/* Inline image manager */}
              {imgFor===p.id&&(
                <div style={{width:'100%',marginTop:'.75rem',background:'rgba(255,255,255,.02)',border:'1px dashed rgba(255,255,255,.1)',borderRadius:'10px',padding:'1rem',display:'flex',flexDirection:'column',gap:'.75rem'}}>
                  <div style={{fontSize:'.82rem',fontWeight:600,color:'#EDF2FF'}}>📸 Screenshots for: {p.title} ({getImgCount(p.id)} uploaded)</div>
                  <div onClick={()=>!loading&&inputRef.current&&(inputRef.current.dataset.pid=p.id)&&inputRef.current.click()} style={{border:'1.5px dashed rgba(255,255,255,.12)',borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',fontSize:'.8rem',color:'#6a7f99',background:'rgba(255,255,255,.01)'}}
                    onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files,p.id)}}>
                    {loading?'Processing...':'📁 Click or drop images (PNG, JPG, WebP · Multiple OK)'}
                  </div>
                  <input ref={inputRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>handleFiles(e.target.files,e.target.dataset.pid)}/>
                  {getProjectImages(p.id).length>0&&(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:'.4rem'}}>
                      {getProjectImages(p.id).map((img,idx)=>(
                        <div key={img.index} style={{position:'relative',aspectRatio:'16/10',borderRadius:'7px',overflow:'hidden',border:'1px solid rgba(255,255,255,.08)'}}>
                          <img src={img.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                          <button onClick={()=>{deleteProjectImage(p.id,img.index);window.dispatchEvent(new CustomEvent('portfolio:updated'));setImgFor(null);setTimeout(()=>setImgFor(p.id),10)}} style={{position:'absolute',top:'2px',right:'2px',background:'rgba(0,0,0,.75)',border:'none',color:'#fff',width:'16px',height:'16px',borderRadius:'50%',cursor:'none',fontSize:'.75rem',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {modal&&(
        <Modal title={modal.mode==='add'?'Add Project':'Edit Project'} onClose={()=>setModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={row_s}>
              <div><label style={lbl_s}>Title *</label><input style={inp_s} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Project name"/></div>
              <div><label style={lbl_s}>Type / Tag</label><input style={inp_s} value={form.tag||form.type} onChange={e=>setForm(f=>({...f,tag:e.target.value,type:e.target.value}))} placeholder="Web App"/></div>
            </div>
            <div><label style={lbl_s}>Description</label><textarea style={ta_s} rows="3" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></div>
            <div><label style={lbl_s}>Color</label><ColorPicker value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/></div>
            <div><label style={lbl_s}>Technologies</label><TagInput value={form.tech} onChange={v=>setForm(f=>({...f,tech:v}))} placeholder="React.js, Node.js..."/></div>
            <div style={row_s}>
              <div><label style={lbl_s}>GitHub URL</label><input style={inp_s} value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} placeholder="https://github.com/..."/></div>
              <div><label style={lbl_s}>Live URL</label><input style={inp_s} value={form.live} onChange={e=>setForm(f=>({...f,live:e.target.value}))} placeholder="https://..."/></div>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:'.5rem',cursor:'none',fontSize:'.85rem',color:'#8892a4'}}>
              <input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/>
              ⭐ Featured project (shown in top grid)
            </label>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
              <button type="button" style={btn_cancel} onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" style={btn_save} onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── EXPERIENCE PANEL ─────────────────────────────────────
const EE={role:'',company:'',period:'',type:'',color:'#5B4FFF',points:[]}
function ExperiencePanel(){
  const[exps,setExps]=useState(getExperiences);const[modal,setModal]=useState(null);const[form,setForm]=useState(EE);const[ptInp,setPtInp]=useState('')
  const openAdd=()=>{setForm({...EE,points:[]});setPtInp('');setModal({mode:'add'})}
  const openEdit=e=>{setForm({...e,points:[...e.points]});setPtInp('');setModal({mode:'edit',id:e.id})}
  const addPt=()=>{if(!ptInp.trim())return;setForm(f=>({...f,points:[...f.points,ptInp.trim()]}));setPtInp('')}
  const save=()=>{if(!form.role.trim())return;const next=modal.mode==='add'?addExperience(form):updateExperience(modal.id,form);setExps(next);setModal(null)}
  const del=id=>{if(!confirm('Delete?'))return;setExps(deleteExperience(id))}
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Experience <span style={{fontSize:'.72rem',color:'#4a5568',fontFamily:'monospace'}}>{exps.length}</span></h2><button style={btn_sm} onClick={openAdd}>+ Add</button></div>
      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
        {exps.map(e=>(
          <div key={e.id} style={{display:'flex',gap:'1rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
            <div style={{width:'12px',height:'12px',borderRadius:'50%',background:e.color,marginTop:'.5rem',flexShrink:0,boxShadow:`0 0 6px ${e.color}`}}/>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem'}}>
                <div><div style={{fontSize:'.92rem',fontWeight:600,color:'#EDF2FF'}}>{e.role}</div><div style={{fontSize:'.78rem',color:'#6a7f99',marginTop:'.15rem'}}>{e.company} · {e.period}</div></div>
                <div style={{display:'flex',gap:'.25rem',flexShrink:0}}>
                  <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>openEdit(e)}>✏️</button>
                  <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>del(e.id)}>🗑️</button>
                </div>
              </div>
              <ul style={{listStyle:'none',marginTop:'.5rem',display:'flex',flexDirection:'column',gap:'.3rem'}}>
                {(e.points||[]).map((pt,j)=><li key={j} style={{fontSize:'.8rem',color:'#6a7f99',paddingLeft:'.75rem',position:'relative'}}><span style={{position:'absolute',left:0,color:e.color}}>·</span>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title={modal.mode==='add'?'Add Experience':'Edit Experience'} onClose={()=>setModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={row_s}>
              <div><label style={lbl_s}>Role *</label><input style={inp_s} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="Web Developer"/></div>
              <div><label style={lbl_s}>Company</label><input style={inp_s} value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="Company name"/></div>
            </div>
            <div style={row_s}>
              <div><label style={lbl_s}>Period</label><input style={inp_s} value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="2024 — Present"/></div>
              <div><label style={lbl_s}>Type</label><input style={inp_s} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} placeholder="Full-time"/></div>
            </div>
            <div><label style={lbl_s}>Color</label><ColorPicker value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/></div>
            <div><label style={lbl_s}>Bullet Points</label>
              <div style={{display:'flex',gap:'.5rem',marginBottom:'.5rem'}}>
                <input style={{...inp_s,flex:1}} value={ptInp} onChange={e=>setPtInp(e.target.value)} placeholder="Describe what you did..." onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addPt()}}}/>
                <button type="button" style={btn_sm} onClick={addPt}>Add</button>
              </div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.35rem'}}>
                {form.points.map((pt,i)=>(
                  <li key={i} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'.5rem',padding:'.4rem .6rem',background:'rgba(255,255,255,.02)',borderRadius:'6px',fontSize:'.82rem',color:'#8892a4'}}>
                    <span>{pt}</span><button type="button" style={{background:'none',border:'none',color:'#4a5568',cursor:'none'}} onClick={()=>setForm(f=>({...f,points:f.points.filter((_,j)=>j!==i)}))}>×</button>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
              <button type="button" style={btn_cancel} onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" style={btn_save} onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── EDUCATION PANEL ──────────────────────────────────────
const ED={degree:'',school:'',period:'',detail:'',color:'#5B4FFF'}
function EducationPanel(){
  const[edus,setEdus]=useState(getEducation);const[modal,setModal]=useState(null);const[form,setForm]=useState(ED)
  const openAdd=()=>{setForm({...ED});setModal({mode:'add'})}
  const openEdit=e=>{setForm({...e});setModal({mode:'edit',id:e.id})}
  const save=()=>{if(!form.degree.trim())return;const next=modal.mode==='add'?addEducation(form):updateEducation(modal.id,form);setEdus(next);setModal(null)}
  const del=id=>{if(!confirm('Delete?'))return;setEdus(deleteEducation(id))}
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Education <span style={{fontSize:'.72rem',color:'#4a5568',fontFamily:'monospace'}}>{edus.length}</span></h2><button style={btn_sm} onClick={openAdd}>+ Add</button></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1rem'}}>
        {edus.map(e=>(
          <div key={e.id} style={{...card_s,border:`1px solid ${e.color}20`}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.75rem'}}>
              <div style={{width:'10px',height:'10px',borderRadius:'50%',background:e.color}}/>
              <div style={{display:'flex',gap:'.25rem'}}>
                <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>openEdit(e)}>✏️</button>
                <button style={{background:'none',border:'none',cursor:'none',opacity:.65}} onClick={()=>del(e.id)}>🗑️</button>
              </div>
            </div>
            <div style={{fontSize:'.92rem',fontWeight:600,color:'#EDF2FF',lineHeight:1.3,marginBottom:'.3rem'}}>{e.degree}</div>
            <div style={{fontSize:'.78rem',color:'#6a7f99',marginBottom:'.25rem'}}>{e.school}</div>
            <div style={{fontSize:'.72rem',color:'#4a5568',fontFamily:'monospace'}}>{e.period}</div>
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title={modal.mode==='add'?'Add Education':'Edit Education'} onClose={()=>setModal(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div><label style={lbl_s}>Degree *</label><input style={inp_s} value={form.degree} onChange={e=>setForm(f=>({...f,degree:e.target.value}))} placeholder="B.Sc. Software Engineering"/></div>
            <div><label style={lbl_s}>Institution</label><input style={inp_s} value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))} placeholder="University name"/></div>
            <div><label style={lbl_s}>Period</label><input style={inp_s} value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="2024 — Present"/></div>
            <div><label style={lbl_s}>Detail / Note</label><input style={inp_s} value={form.detail||''} onChange={e=>setForm(f=>({...f,detail:e.target.value}))} placeholder="Optional detail"/></div>
            <div><label style={lbl_s}>Color</label><ColorPicker value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/></div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
              <button type="button" style={btn_cancel} onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" style={btn_save} onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── SETTINGS PANEL ───────────────────────────────────────
function SettingsPanel(){
  const[inp,setInp]=useState('');const[msg,setMsg]=useState('');const fileRef=useRef(null)
  const doExport=()=>{const blob=new Blob([exportData()],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='portfolio-backup.json';a.click();URL.revokeObjectURL(url)}
  const doImport=()=>{if(!inp.trim()){setMsg('❌ Paste JSON first');return};const ok=importData(inp);setMsg(ok?'✅ Imported! Reloading...':'❌ Invalid JSON');if(ok)setTimeout(()=>window.location.reload(),1500)}
  const doReset=()=>{if(!confirm('⚠️ Reset ALL data to defaults? This cannot be undone.'))return;resetAll();setTimeout(()=>window.location.reload(),500)}
  const onFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setInp(ev.target.result);r.readAsText(f)}
  const settCard={...card_s,display:'flex',flexDirection:'column',gap:'.85rem'}
  const settBtn=(color)=>({padding:'.7rem 1.2rem',borderRadius:'8px',fontSize:'.83rem',fontWeight:600,cursor:'none',border:'none',background:color==='danger'?'rgba(255,55,95,.12)':color==='sec'?'rgba(255,255,255,.05)':'rgba(91,79,255,.15)',outline:`1px solid ${color==='danger'?'rgba(255,55,95,.3)':color==='sec'?'rgba(255,255,255,.1)':'rgba(91,79,255,.3)'}`,color:color==='danger'?'#FF375F':color==='sec'?'#8892a4':'#7B6FFF'})
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#EDF2FF'}}>Settings & Data</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem'}}>
        <div style={settCard}>
          <div style={{fontSize:'1.8rem'}}>📤</div>
          <div style={{fontSize:'1rem',fontWeight:700,color:'#EDF2FF'}}>Export Backup</div>
          <div style={{fontSize:'.82rem',color:'#6a7f99',lineHeight:1.65}}>Download all your portfolio data as JSON. Use this to back up or transfer between devices.</div>
          <button type="button" style={settBtn()} onClick={doExport}>Download portfolio-backup.json</button>
        </div>
        <div style={settCard}>
          <div style={{fontSize:'1.8rem'}}>📥</div>
          <div style={{fontSize:'1rem',fontWeight:700,color:'#EDF2FF'}}>Import Backup</div>
          <div style={{fontSize:'.82rem',color:'#6a7f99',lineHeight:1.65}}>Restore from a backup file or paste JSON. This will overwrite all current data.</div>
          <input ref={fileRef} type="file" accept=".json" onChange={onFile} style={{display:'none'}}/>
          <button type="button" style={settBtn('sec')} onClick={()=>fileRef.current?.click()}>Choose JSON file</button>
          <textarea rows="5" value={inp} onChange={e=>setInp(e.target.value)} placeholder='Or paste JSON here...' style={{...ta_s,fontSize:'.75rem',color:'#6a7f99'}}/>
          <button type="button" style={settBtn()} onClick={doImport}>Import & Restore</button>
          {msg&&<div style={{padding:'.65rem 1rem',borderRadius:'8px',background:'rgba(255,255,255,.04)',fontSize:'.82rem',color:'#8892a4'}}>{msg}</div>}
        </div>
        <div style={{...settCard,border:'1px solid rgba(255,55,95,.18)'}}>
          <div style={{fontSize:'1.8rem'}}>⚠️</div>
          <div style={{fontSize:'1rem',fontWeight:700,color:'#EDF2FF'}}>Reset to Defaults</div>
          <div style={{fontSize:'.82rem',color:'#6a7f99',lineHeight:1.65}}>Clears all customizations and restores original data. Cannot be undone — export first!</div>
          <button type="button" style={settBtn('danger')} onClick={doReset}>Reset Everything</button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ADMIN ───────────────────────────────────────────
const TABS=[
  {id:'hero',icon:'🏠',label:'Hero',desc:'Name, bio, roles, stats'},
  {id:'socials',icon:'🔗',label:'Socials',desc:'All profile links'},
  {id:'about',icon:'👤',label:'About',desc:'Bio text, info card'},
  {id:'contact',icon:'📬',label:'Contact',desc:'Email, phone, script URL'},
  {id:'skills',icon:'⚡',label:'Skills',desc:'Groups & skill levels'},
  {id:'projects',icon:'🚀',label:'Projects',desc:'Add/edit/remove + photos'},
  {id:'experience',icon:'💼',label:'Experience',desc:'Work history'},
  {id:'education',icon:'🎓',label:'Education',desc:'Degrees & schools'},
  {id:'settings',icon:'⚙️',label:'Settings',desc:'Backup, import, reset'},
]
export default function Admin({onClose}){
  const[tab,setTab]=useState('hero')
  const cur=TABS.find(t=>t.id===tab)
  const sb={background:'#07091a',borderRight:'1px solid rgba(91,79,255,.2)',display:'flex',flexDirection:'column',overflow:'hidden',width:'240px',flexShrink:0}
  return(
    <div style={{position:'fixed',inset:0,zIndex:9000,background:'rgba(0,0,0,.6)',backdropFilter:'blur(4px)'}}>
      <style>{`@keyframes fadein{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
        {/* Sidebar */}
        <div style={sb}>
          <div style={{padding:'1.5rem 1rem',display:'flex',flexDirection:'column',gap:'1.5rem',flex:1,overflowY:'auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.5rem'}}>
              <span style={{fontSize:'1.5rem'}}>⚙️</span>
              <div><div style={{fontSize:'.95rem',fontWeight:700,color:'#EDF2FF'}}>Admin Panel</div><div style={{fontSize:'.68rem',color:'#4a5568',fontFamily:'monospace',letterSpacing:'.05em'}}>Full CMS Control</div></div>
            </div>
            <nav style={{display:'flex',flexDirection:'column',gap:'.25rem'}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:'.65rem',padding:'.65rem .75rem',borderRadius:'10px',cursor:'none',textAlign:'left',transition:'all .2s',background:tab===t.id?'rgba(91,79,255,.18)':'transparent',border:`1px solid ${tab===t.id?'rgba(91,79,255,.3)':'transparent'}`}}>
                  <span style={{fontSize:'1.1rem',flexShrink:0}}>{t.icon}</span>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <span style={{fontSize:'.85rem',fontWeight:600,color:tab===t.id?'#7B6FFF':'#c8d4e8',lineHeight:1.2}}>{t.label}</span>
                    <span style={{fontSize:'.68rem',color:'#4a5568'}}>{t.desc}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
          <div style={{padding:'1rem',borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',flexDirection:'column',gap:'.6rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.5rem',fontSize:'.72rem',color:'#30D158'}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#30D158',boxShadow:'0 0 6px #30D158'}}/>Changes update live</div>
            <button onClick={onClose} style={{padding:'.65rem 1rem',borderRadius:'8px',fontSize:'.82rem',fontWeight:600,color:'#8892a4',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.03)',cursor:'none',transition:'all .2s'}}>← Back to Portfolio</button>
          </div>
        </div>
        {/* Main content */}
        <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden',background:'#050810'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 2rem',borderBottom:'1px solid rgba(255,255,255,.06)',flexShrink:0,background:'#07091a'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
              <span style={{fontSize:'1.5rem'}}>{cur?.icon}</span>
              <div><div style={{fontSize:'1.05rem',fontWeight:700,color:'#EDF2FF'}}>{cur?.label}</div><div style={{fontSize:'.72rem',color:'#4a5568'}}>{cur?.desc}</div></div>
            </div>
            <button onClick={onClose} style={{width:'32px',height:'32px',borderRadius:'8px',background:'none',border:'1px solid rgba(255,255,255,.08)',color:'#4a5568',cursor:'none',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',transition:'all .2s'}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'2rem'}}>
            {tab==='hero'&&<HeroPanel/>}
            {tab==='socials'&&<SocialsPanel/>}
            {tab==='about'&&<AboutPanel/>}
            {tab==='contact'&&<ContactPanel/>}
            {tab==='skills'&&<SkillsPanel/>}
            {tab==='projects'&&<ProjectsPanel/>}
            {tab==='experience'&&<ExperiencePanel/>}
            {tab==='education'&&<EducationPanel/>}
            {tab==='settings'&&<SettingsPanel/>}
          </div>
        </div>
      </div>
    </div>
  )
}
