import React, { useState, useEffect, useRef } from 'react'
import {
  getHero, saveHero, getSocials, saveSocials,
  getAbout, saveAbout, getContact, saveContact,
  getSkills, saveSkills, addSkill, updateSkill, deleteSkill,
  getProjects, addProject, updateProject, deleteProject,
  getExperiences, addExperience, updateExperience, deleteExperience,
  getEducation, addEducation, updateEducation, deleteEducation,
  resetAll, exportData, importData, DEFAULTS,
} from '../store/dataStore'
import './Admin.css'

const uid = () => Math.random().toString(36).slice(2,9)
const COLORS = ['#5B4FFF','#00E5FF','#FF375F','#FF9F0A','#30D158','#A78BFA','#C2727A','#D4A85A','#7FB5A0','#8b5cf6']

/* ── shared mini components ── */
function Saved({ show }) {
  return show ? <span className="adm-saved">✓ Saved</span> : null
}

function ColorRow({ value, onChange }) {
  return (
    <div className="adm-color-row">
      {COLORS.map(c=>(
        <button key={c} type="button" className={`adm-cdot ${value===c?'on':''}`}
          style={{background:c}} onClick={()=>onChange(c)}/>
      ))}
      <input type="color" value={value} onChange={e=>onChange(e.target.value)} className="adm-color-custom" title="Custom"/>
    </div>
  )
}

function Tag({ label, onRemove }) {
  return (
    <span className="adm-tag">
      {label}
      {onRemove && <button type="button" onClick={onRemove} className="adm-tag-x">×</button>}
    </span>
  )
}

function TagInput({ value, onChange, placeholder }) {
  const [inp, setInp] = useState('')
  const add = () => {
    const items = inp.split(',').map(s=>s.trim()).filter(Boolean)
    if (!items.length) return
    onChange([...new Set([...value, ...items])])
    setInp('')
  }
  return (
    <div className="adm-tag-wrap">
      <div className="adm-tags-row">{value.map((t,i)=><Tag key={i} label={t} onRemove={()=>onChange(value.filter((_,j)=>j!==i))}/>)}</div>
      <div className="adm-tag-add">
        <input value={inp} onChange={e=>setInp(e.target.value)} placeholder={placeholder||'Type and press Enter'}
          onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){e.preventDefault();add()} }}/>
        <button type="button" className="adm-btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  useEffect(()=>{ const fn=e=>{ if(e.key==='Escape')onClose() }; document.addEventListener('keydown',fn); return()=>document.removeEventListener('keydown',fn) },[onClose])
  return (
    <div className="adm-modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-head"><h3>{title}</h3><button className="adm-modal-x" onClick={onClose}>×</button></div>
        <div className="adm-modal-body">{children}</div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: HERO
══════════════════════════════════════════════════════════════ */
function HeroPanel() {
  const [d, setD] = useState(getHero)
  const [saved, setSaved] = useState(false)

  const persist = (next) => { setD(next); saveHero(next); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const upd = (key, val) => persist({ ...d, [key]: val })

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Hero Section</h2><Saved show={saved}/></div>

      <div className="adm-form">
        <div className="adm-form-row">
          <div>
            <label>Full Name</label>
            <input value={d.name} onChange={e=>upd('name',e.target.value)} placeholder="Your name"/>
          </div>
          <div>
            <label>Location</label>
            <input value={d.location} onChange={e=>upd('location',e.target.value)} placeholder="City, Country"/>
          </div>
        </div>

        <label>Tagline (shown under name)</label>
        <input value={d.tagline} onChange={e=>upd('tagline',e.target.value)} placeholder="Your main role or tagline"/>

        <label>Bio Paragraph</label>
        <textarea rows="3" value={d.bio} onChange={e=>upd('bio',e.target.value)} placeholder="Short bio shown in hero section"/>

        <label>Animated Roles (one per line)</label>
        <textarea rows="6" value={d.roles.join('\n')} onChange={e=>upd('roles',e.target.value.split('\n').filter(Boolean))} placeholder="Full-Stack Developer&#10;React Engineer&#10;..."/>
        <p className="adm-hint">Each line cycles in the typing animation on your hero section</p>

        <label className="adm-check-label">
          <input type="checkbox" checked={d.available} onChange={e=>upd('available',e.target.checked)}/>
          <span>Show "Available for work" status badge</span>
        </label>

        <label>Stats (label:value pairs)</label>
        <div className="adm-stats-grid">
          {d.stats.map((s,i)=>(
            <div key={i} className="adm-stat-row">
              <input value={s.value} onChange={e=>{ const ns=[...d.stats]; ns[i]={...s,value:e.target.value}; upd('stats',ns) }} placeholder="8+"/>
              <input value={s.label} onChange={e=>{ const ns=[...d.stats]; ns[i]={...s,label:e.target.label||e.target.value}; upd('stats',ns) }} placeholder="Projects"/>
              <button type="button" className="adm-btn-icon danger" onClick={()=>upd('stats',d.stats.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
          <button type="button" className="adm-btn-sm" onClick={()=>upd('stats',[...d.stats,{value:'',label:''}])}>+ Add Stat</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: SOCIALS
══════════════════════════════════════════════════════════════ */
const PLATFORM_OPTS = ['LinkedIn','GitHub','Upwork','Fiverr','Email','Twitter/X','Instagram','YouTube','Portfolio','Website','Other']
const ICON_OPTS     = ['linkedin','github','upwork','fiverr','mail','twitter','instagram','youtube','globe','link']

function SocialsPanel() {
  const [socials, setSocials] = useState(getSocials)
  const [saved, setSaved] = useState(false)

  const persist = (next) => { setSocials(next); saveSocials(next); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const upd = (id, key, val) => persist(socials.map(s=>s.id===id?{...s,[key]:val}:s))
  const add = () => persist([...socials, { id:uid(), platform:'New Link', url:'', icon:'link', show:true }])
  const del = (id) => persist(socials.filter(s=>s.id!==id))

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Social & Profile Links</h2><Saved show={saved}/></div>
      <p className="adm-desc">These links appear in the Navbar, Hero, About, Contact, and Footer sections.</p>

      <div className="adm-socials-list">
        {socials.map(s=>(
          <div key={s.id} className="adm-social-row">
            <div className="adm-social-main">
              <select value={s.platform} onChange={e=>upd(s.id,'platform',e.target.value)} className="adm-select-sm">
                {PLATFORM_OPTS.map(p=><option key={p}>{p}</option>)}
              </select>
              <input value={s.url} onChange={e=>upd(s.id,'url',e.target.value)} placeholder="https://..." className="adm-url-input"/>
            </div>
            <div className="adm-social-actions">
              <label className="adm-toggle" title="Show/Hide">
                <input type="checkbox" checked={s.show} onChange={e=>upd(s.id,'show',e.target.checked)}/>
                <span className="adm-toggle-slider"/>
              </label>
              <button type="button" className="adm-btn-icon danger" onClick={()=>del(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="adm-btn-add" onClick={add}>+ Add Link</button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: ABOUT
══════════════════════════════════════════════════════════════ */
function AboutPanel() {
  const [d, setD] = useState(getAbout)
  const [saved, setSaved] = useState(false)

  const persist = (next) => { setD(next); saveAbout(next); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const upd = (key, val) => persist({ ...d, [key]: val })
  const updInfo = (i, key, val) => { const ni=[...d.info]; ni[i]={...ni[i],[key]:val}; upd('info',ni) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>About Section</h2><Saved show={saved}/></div>

      <div className="adm-form">
        <label>Section Heading</label>
        <input value={d.heading} onChange={e=>upd('heading',e.target.value)} placeholder="About Me heading"/>

        <label>Bio Paragraph 1</label>
        <textarea rows="3" value={d.bio1} onChange={e=>upd('bio1',e.target.value)}/>
        <label>Bio Paragraph 2</label>
        <textarea rows="3" value={d.bio2} onChange={e=>upd('bio2',e.target.value)}/>
        <label>Bio Paragraph 3</label>
        <textarea rows="3" value={d.bio3} onChange={e=>upd('bio3',e.target.value)}/>

        <label>Info Card (key–value pairs)</label>
        <div className="adm-info-grid">
          {d.info.map((row,i)=>(
            <div key={i} className="adm-info-row">
              <input value={row.label} onChange={e=>updInfo(i,'label',e.target.value)} placeholder="Label" className="adm-info-label-inp"/>
              <input value={row.value} onChange={e=>updInfo(i,'value',e.target.value)} placeholder="Value"/>
              <button type="button" className="adm-btn-icon danger" onClick={()=>upd('info',d.info.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
          <button type="button" className="adm-btn-sm" onClick={()=>upd('info',[...d.info,{label:'',value:''}])}>+ Add Row</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: CONTACT
══════════════════════════════════════════════════════════════ */
function ContactPanel() {
  const [d, setD] = useState(getContact)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState('idle')

  const persist = (next) => { setD(next); saveContact(next); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const upd = (key, val) => persist({ ...d, [key]: val })

  const testEmail = async () => {
    if (!d.scriptUrl || d.scriptUrl.includes('PASTE_YOUR')) return alert('Please enter your Google Script URL first')
    setTestStatus('sending')
    try {
      await fetch(d.scriptUrl, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name:'Admin Test', email:d.email, subject:'Test from Admin Panel', message:'This is a test email from your portfolio admin panel. If you received this, your contact form is working! ✅' })
      })
      setTestStatus('ok'); setTimeout(()=>setTestStatus('idle'),4000)
    } catch { setTestStatus('err'); setTimeout(()=>setTestStatus('idle'),4000) }
  }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Contact Section</h2><Saved show={saved}/></div>

      <div className="adm-form">
        <label>Section Heading</label>
        <input value={d.heading} onChange={e=>upd('heading',e.target.value)}/>

        <label>Sub-text</label>
        <input value={d.subtext} onChange={e=>upd('subtext',e.target.value)}/>

        <div className="adm-form-row">
          <div>
            <label>Email Address</label>
            <input value={d.email} onChange={e=>upd('email',e.target.value)} placeholder="your@email.com" type="email"/>
          </div>
          <div>
            <label>Phone</label>
            <input value={d.phone} onChange={e=>upd('phone',e.target.value)} placeholder="+92 300 0000000"/>
          </div>
        </div>

        <label>Location</label>
        <input value={d.location} onChange={e=>upd('location',e.target.value)} placeholder="City, Country"/>

        <label>Google Apps Script URL</label>
        <input value={d.scriptUrl} onChange={e=>upd('scriptUrl',e.target.value)} placeholder="https://script.google.com/macros/s/..."/>
        <p className="adm-hint">This is the URL from your Google Apps Script deployment — all contact form messages are sent here.</p>

        <div className="adm-test-row">
          <button type="button" className={`adm-btn-test ${testStatus}`} onClick={testEmail} disabled={testStatus==='sending'}>
            {testStatus==='idle'    && '📧 Send Test Email'}
            {testStatus==='sending' && '⏳ Sending...'}
            {testStatus==='ok'      && '✅ Test Sent! Check your inbox'}
            {testStatus==='err'     && '❌ Failed — check the URL'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: SKILLS
══════════════════════════════════════════════════════════════ */
function SkillsPanel() {
  const [cats, setCats] = useState(getSkills)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ category:'', color:'#5B4FFF', items:[] })
  const [newName, setNewName] = useState(''); const [newPct, setNewPct] = useState(80)

  const openAdd  = () => { setForm({category:'',color:'#5B4FFF',items:[]}); setNewName(''); setNewPct(80); setModal({mode:'add'}) }
  const openEdit = (g) => { setForm({...g,items:[...g.items]}); setNewName(''); setNewPct(80); setModal({mode:'edit',id:g.id}) }

  const addItem = () => { if(!newName.trim())return; setForm(f=>({...f,items:[...f.items,{name:newName.trim(),pct:+newPct}]})); setNewName(''); setNewPct(80) }
  const remItem = (i) => setForm(f=>({...f,items:f.items.filter((_,j)=>j!==i)}))
  const updPct  = (i,v) => setForm(f=>({...f,items:f.items.map((it,j)=>j===i?{...it,pct:+v}:it)}))

  const save = () => {
    if(!form.category.trim())return
    const next = modal.mode==='add' ? addSkill(form) : updateSkill(modal.id,form)
    setCats(next); setModal(null)
  }
  const del = (id) => { if(!confirm('Delete skill group?'))return; setCats(deleteSkill(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Skills <span className="adm-count">{cats.length} groups</span></h2><button className="adm-btn-add" onClick={openAdd}>+ Add Group</button></div>

      <div className="adm-grid-2">
        {cats.map(g=>(
          <div key={g.id} className="adm-card" style={{'--ac':g.color}}>
            <div className="adm-card-head">
              <span className="adm-cat-dot" style={{background:g.color}}/>
              <span className="adm-card-title">{g.category}</span>
              <span className="adm-count">{g.items.length}</span>
              <div className="adm-card-acts">
                <button className="adm-btn-icon" onClick={()=>openEdit(g)}>✏️</button>
                <button className="adm-btn-icon danger" onClick={()=>del(g.id)}>🗑️</button>
              </div>
            </div>
            {g.items.map((it,i)=>(
              <div key={i} className="adm-skill-row">
                <span className="adm-sname">{it.name}</span>
                <div className="adm-sbar"><div className="adm-sbar-fill" style={{width:`${it.pct}%`,background:g.color}}/></div>
                <span className="adm-spct">{it.pct}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode==='add'?'Add Skill Group':'Edit Skill Group'} onClose={()=>setModal(null)}>
          <div className="adm-form">
            <label>Category Name *</label>
            <input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="e.g. Frontend"/>
            <label>Color</label>
            <ColorRow value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/>
            <label>Add Skill</label>
            <div className="adm-skill-add">
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Skill name"
                onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addItem()}}}/>
              <div className="adm-range-row">
                <input type="range" min="1" max="100" value={newPct} onChange={e=>setNewPct(e.target.value)}/><span>{newPct}%</span>
              </div>
              <button type="button" className="adm-btn-sm" onClick={addItem}>Add</button>
            </div>
            {form.items.map((it,i)=>(
              <div key={i} className="adm-skill-edit">
                <span className="adm-sname">{it.name}</span>
                <input type="range" min="1" max="100" value={it.pct} onChange={e=>updPct(i,e.target.value)} className="adm-range-sm"/>
                <span className="adm-spct">{it.pct}%</span>
                <button type="button" className="adm-btn-icon danger sm" onClick={()=>remItem(i)}>×</button>
              </div>
            ))}
            <div className="adm-form-foot">
              <button type="button" className="adm-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode==='add'?'Add Group':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: PROJECTS
══════════════════════════════════════════════════════════════ */
const EP = {title:'',desc:'',tech:[],type:'',color:'#5B4FFF',featured:false,github:'',live:'',tag:''}

function ProjectsPanel() {
  const [projects, setProjects] = useState(getProjects)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EP)

  const openAdd  = () => { setForm({...EP,tech:[]}); setModal({mode:'add'}) }
  const openEdit = (p) => { setForm({...p,tech:[...p.tech]}); setModal({mode:'edit',id:p.id}) }
  const save = () => {
    if(!form.title.trim())return
    const next = modal.mode==='add' ? addProject(form) : updateProject(modal.id,form)
    setProjects(next); setModal(null)
  }
  const del = (id) => { if(!confirm('Delete project?'))return; setProjects(deleteProject(id)) }
  const toggle = (id) => setProjects(updateProject(id,{featured:!projects.find(p=>p.id===id).featured}))

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Projects <span className="adm-count">{projects.length}</span></h2><button className="adm-btn-add" onClick={openAdd}>+ Add Project</button></div>

      <div className="adm-list">
        {projects.map((p,i)=>(
          <div key={p.id} className="adm-list-row" style={{'--ac':p.color}}>
            <div className="adm-list-left">
              <span className="adm-list-num">#{String(i+1).padStart(2,'0')}</span>
              <div className="adm-cat-dot" style={{background:p.color,width:10,height:10,borderRadius:'50%',flexShrink:0}}/>
              <div>
                <div className="adm-list-title">{p.title}</div>
                <div className="adm-list-meta">
                  <span className="adm-type-badge">{p.type||p.tag}</span>
                  {p.featured&&<span className="adm-feat-badge">⭐ Featured</span>}
                  {p.live&&<span className="adm-live-badge">🔴 Live</span>}
                </div>
              </div>
            </div>
            <div className="adm-list-acts">
              <button type="button" className={`adm-btn-feat ${p.featured?'on':''}`} onClick={()=>toggle(p.id)} title="Toggle featured">{p.featured?'★':'☆'}</button>
              <button className="adm-btn-icon" onClick={()=>openEdit(p)}>✏️</button>
              <button className="adm-btn-icon danger" onClick={()=>del(p.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode==='add'?'Add Project':'Edit Project'} onClose={()=>setModal(null)}>
          <div className="adm-form">
            <div className="adm-form-row">
              <div><label>Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Project name"/></div>
              <div><label>Type / Tag</label><input value={form.tag||form.type} onChange={e=>setForm(f=>({...f,tag:e.target.value,type:e.target.value}))} placeholder="Web App"/></div>
            </div>
            <label>Description</label>
            <textarea rows="3" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
            <label>Color</label>
            <ColorRow value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/>
            <label>Technologies</label>
            <TagInput value={form.tech} onChange={v=>setForm(f=>({...f,tech:v}))} placeholder="React.js, Node.js..."/>
            <div className="adm-form-row">
              <div><label>GitHub URL</label><input value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} placeholder="https://github.com/..."/></div>
              <div><label>Live URL</label><input value={form.live} onChange={e=>setForm(f=>({...f,live:e.target.value}))} placeholder="https://..."/></div>
            </div>
            <label className="adm-check-label"><input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/><span>⭐ Featured project</span></label>
            <div className="adm-form-foot">
              <button type="button" className="adm-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: EXPERIENCE
══════════════════════════════════════════════════════════════ */
const EE = {role:'',company:'',period:'',type:'',color:'#5B4FFF',points:[]}

function ExperiencePanel() {
  const [exps, setExps] = useState(getExperiences)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EE)
  const [ptInp, setPtInp] = useState('')

  const openAdd  = () => { setForm({...EE,points:[]}); setPtInp(''); setModal({mode:'add'}) }
  const openEdit = (e) => { setForm({...e,points:[...e.points]}); setPtInp(''); setModal({mode:'edit',id:e.id}) }
  const addPt = () => { if(!ptInp.trim())return; setForm(f=>({...f,points:[...f.points,ptInp.trim()]})); setPtInp('') }
  const remPt = (i) => setForm(f=>({...f,points:f.points.filter((_,j)=>j!==i)}))
  const save = () => {
    if(!form.role.trim())return
    const next = modal.mode==='add' ? addExperience(form) : updateExperience(modal.id,form)
    setExps(next); setModal(null)
  }
  const del = (id) => { if(!confirm('Delete experience?'))return; setExps(deleteExperience(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Experience <span className="adm-count">{exps.length}</span></h2><button className="adm-btn-add" onClick={openAdd}>+ Add</button></div>

      <div className="adm-tl">
        {exps.map((e,i)=>(
          <div key={e.id} className="adm-tl-row">
            <div className="adm-tl-dot" style={{background:e.color}}/>
            <div className="adm-tl-body">
              <div className="adm-tl-head">
                <div><div className="adm-tl-role">{e.role}</div><div className="adm-tl-co">{e.company} · {e.period}</div></div>
                <div className="adm-list-acts">
                  <button className="adm-btn-icon" onClick={()=>openEdit(e)}>✏️</button>
                  <button className="adm-btn-icon danger" onClick={()=>del(e.id)}>🗑️</button>
                </div>
              </div>
              <ul className="adm-tl-pts">{e.points.map((pt,j)=><li key={j}>{pt}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode==='add'?'Add Experience':'Edit Experience'} onClose={()=>setModal(null)}>
          <div className="adm-form">
            <div className="adm-form-row">
              <div><label>Role *</label><input value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="Web Developer"/></div>
              <div><label>Company</label><input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="Company name"/></div>
            </div>
            <div className="adm-form-row">
              <div><label>Period</label><input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="2024 — Present"/></div>
              <div><label>Type</label><input value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} placeholder="Full-time"/></div>
            </div>
            <label>Color</label><ColorRow value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/>
            <label>Bullet Points</label>
            <div className="adm-tag-add">
              <input value={ptInp} onChange={e=>setPtInp(e.target.value)} placeholder="Describe what you did..."
                onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addPt()}}}/>
              <button type="button" className="adm-btn-sm" onClick={addPt}>Add</button>
            </div>
            <ul className="adm-pts-list">
              {form.points.map((pt,i)=>(
                <li key={i}><span>{pt}</span><button type="button" className="adm-btn-icon danger sm" onClick={()=>remPt(i)}>×</button></li>
              ))}
            </ul>
            <div className="adm-form-foot">
              <button type="button" className="adm-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: EDUCATION
══════════════════════════════════════════════════════════════ */
const ED = {degree:'',school:'',period:'',detail:'',color:'#5B4FFF'}

function EducationPanel() {
  const [edus, setEdus] = useState(getEducation)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(ED)

  const openAdd  = () => { setForm({...ED}); setModal({mode:'add'}) }
  const openEdit = (e) => { setForm({...e}); setModal({mode:'edit',id:e.id}) }
  const save = () => {
    if(!form.degree.trim())return
    const next = modal.mode==='add' ? addEducation(form) : updateEducation(modal.id,form)
    setEdus(next); setModal(null)
  }
  const del = (id) => { if(!confirm('Delete education?'))return; setEdus(deleteEducation(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Education <span className="adm-count">{edus.length}</span></h2><button className="adm-btn-add" onClick={openAdd}>+ Add</button></div>
      <div className="adm-edu-grid">
        {edus.map(e=>(
          <div key={e.id} className="adm-edu-card" style={{'--ac':e.color}}>
            <div className="adm-edu-head"><div className="adm-cat-dot" style={{background:e.color,width:10,height:10,borderRadius:'50%'}}/><div className="adm-list-acts"><button className="adm-btn-icon" onClick={()=>openEdit(e)}>✏️</button><button className="adm-btn-icon danger" onClick={()=>del(e.id)}>🗑️</button></div></div>
            <div className="adm-edu-degree">{e.degree}</div>
            <div className="adm-edu-school">{e.school}</div>
            <div className="adm-edu-period">{e.period}</div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal.mode==='add'?'Add Education':'Edit Education'} onClose={()=>setModal(null)}>
          <div className="adm-form">
            <label>Degree *</label><input value={form.degree} onChange={e=>setForm(f=>({...f,degree:e.target.value}))} placeholder="B.Sc. Software Engineering"/>
            <label>Institution</label><input value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))} placeholder="University name"/>
            <label>Period</label><input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} placeholder="2024 — Present"/>
            <label>Detail / Note</label><input value={form.detail||''} onChange={e=>setForm(f=>({...f,detail:e.target.value}))} placeholder="Optional detail line"/>
            <label>Color</label><ColorRow value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/>
            <div className="adm-form-foot">
              <button type="button" className="adm-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode==='add'?'Add':'Save'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PANEL: SETTINGS (export/import/reset)
══════════════════════════════════════════════════════════════ */
function SettingsPanel() {
  const [importText, setImportText] = useState('')
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  const doExport = () => {
    const json = exportData()
    const blob = new Blob([json], {type:'application/json'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href=url; a.download='portfolio-backup.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = () => {
    if(!importText.trim()){setMsg('❌ Paste JSON first'); return}
    const ok = importData(importText)
    setMsg(ok ? '✅ Imported! Page will reload...' : '❌ Invalid JSON — check the format')
    if(ok) setTimeout(()=>window.location.reload(), 1500)
  }

  const doReset = () => {
    if(!confirm('⚠️ Reset ALL data to defaults? This cannot be undone.'))return
    resetAll(); setTimeout(()=>window.location.reload(), 500)
  }

  const onFile = (e) => {
    const file = e.target.files[0]; if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImportText(ev.target.result)
    reader.readAsText(file)
  }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head"><h2>Settings & Data</h2></div>

      <div className="adm-settings-grid">
        {/* Export */}
        <div className="adm-settings-card">
          <div className="adm-settings-icon">📤</div>
          <div className="adm-settings-title">Export Backup</div>
          <div className="adm-settings-desc">Download all your portfolio data as a JSON file. Use this to back up your work or transfer to another device.</div>
          <button type="button" className="adm-btn-action" onClick={doExport}>Download portfolio-backup.json</button>
        </div>

        {/* Import */}
        <div className="adm-settings-card">
          <div className="adm-settings-icon">📥</div>
          <div className="adm-settings-title">Import Backup</div>
          <div className="adm-settings-desc">Restore from a backup file or paste JSON directly. This will overwrite all current data.</div>
          <input ref={fileRef} type="file" accept=".json" onChange={onFile} style={{display:'none'}}/>
          <button type="button" className="adm-btn-action secondary" onClick={()=>fileRef.current?.click()}>Choose JSON file</button>
          <textarea rows="5" value={importText} onChange={e=>setImportText(e.target.value)} placeholder='Or paste JSON here...' className="adm-import-area"/>
          <button type="button" className="adm-btn-action" onClick={doImport}>Import & Restore</button>
          {msg && <div className="adm-msg">{msg}</div>}
        </div>

        {/* Reset */}
        <div className="adm-settings-card danger-card">
          <div className="adm-settings-icon">⚠️</div>
          <div className="adm-settings-title">Reset to Defaults</div>
          <div className="adm-settings-desc">Clears all your customizations and restores the original hardcoded data. This cannot be undone — export a backup first!</div>
          <button type="button" className="adm-btn-action danger" onClick={doReset}>Reset Everything</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════════════════════════════════ */
const TABS = [
  { id:'hero',       label:'Hero',       icon:'🏠', desc:'Name, bio, roles, stats' },
  { id:'socials',    label:'Socials',    icon:'🔗', desc:'All profile links'       },
  { id:'about',      label:'About',      icon:'👤', desc:'Bio text, info card'     },
  { id:'contact',    label:'Contact',    icon:'📬', desc:'Email, phone, script URL'},
  { id:'skills',     label:'Skills',     icon:'⚡', desc:'Skill groups & levels'   },
  { id:'projects',   label:'Projects',   icon:'🚀', desc:'Add/edit/remove projects'},
  { id:'experience', label:'Experience', icon:'💼', desc:'Work history'            },
  { id:'education',  label:'Education',  icon:'🎓', desc:'Degrees & schools'       },
  { id:'settings',   label:'Settings',   icon:'⚙️', desc:'Backup, import, reset'  },
]

export default function Admin({ onClose }) {
  const [tab, setTab] = useState('hero')

  return (
    <div className="adm-overlay">
      <div className="adm-shell">

        {/* ── Sidebar ── */}
        <aside className="adm-sidebar">
          <div className="adm-sb-top">
            <div className="adm-sb-logo">
              <div className="adm-sb-icon">⚙️</div>
              <div>
                <div className="adm-sb-title">Admin Panel</div>
                <div className="adm-sb-sub">Full CMS Control</div>
              </div>
            </div>
            <nav className="adm-nav">
              {TABS.map(t=>(
                <button key={t.id} className={`adm-nav-btn ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
                  <span className="adm-nav-ico">{t.icon}</span>
                  <div className="adm-nav-text">
                    <span className="adm-nav-label">{t.label}</span>
                    <span className="adm-nav-desc">{t.desc}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
          <div className="adm-sb-bot">
            <div className="adm-sb-live">
              <span className="adm-live-dot"/>
              <span>Changes update live</span>
            </div>
            <button className="adm-close-btn" onClick={onClose}>← Back to Portfolio</button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="adm-main">
          <div className="adm-topbar">
            <div className="adm-topbar-left">
              <span className="adm-topbar-ico">{TABS.find(t=>t.id===tab)?.icon}</span>
              <div>
                <div className="adm-topbar-title">{TABS.find(t=>t.id===tab)?.label}</div>
                <div className="adm-topbar-sub">{TABS.find(t=>t.id===tab)?.desc}</div>
              </div>
            </div>
            <button className="adm-topbar-close" onClick={onClose}>✕</button>
          </div>

          <div className="adm-content">
            {tab==='hero'       && <HeroPanel/>}
            {tab==='socials'    && <SocialsPanel/>}
            {tab==='about'      && <AboutPanel/>}
            {tab==='contact'    && <ContactPanel/>}
            {tab==='skills'     && <SkillsPanel/>}
            {tab==='projects'   && <ProjectsPanel/>}
            {tab==='experience' && <ExperiencePanel/>}
            {tab==='education'  && <EducationPanel/>}
            {tab==='settings'   && <SettingsPanel/>}
          </div>
        </main>

      </div>
    </div>
  )
}
