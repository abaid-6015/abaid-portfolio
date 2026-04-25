import React, { useState, useEffect } from 'react'
import {
  getSkills, saveSkills, addSkillGroup, updateSkillGroup, deleteSkillGroup,
  getProjects, addProject, updateProject, deleteProject,
  getExperiences, addExperience, updateExperience, deleteExperience,
  getEducation, addEducation, updateEducation, deleteEducation,
  resetAll,
} from '../store/dataStore'
import './Admin.css'

// ── tiny helpers ──────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)

const COLORS = ['#00d4ff','#7928ca','#ff0080','#ff6b6b','#ffd166','#06d6a0','#4cc9f0','#00b4d8','#f89820','#68a063']

const ICONS_SKILL = ['🎨','⚙️','🗄️','🛠️','📱','🌐','⚡','🔷','🧠','🎯']
const ICONS_PROJ  = ['🍽️','📦','🏗️','🗂️','🌐','🎨','📄','🚀','🔧','💡','📊','🤖']
const ICONS_EDU   = ['🎓','🏫','📚','🏆','🎖️']

function Tag({ label, onRemove }) {
  return (
    <span className="adm-tag">
      {label}
      {onRemove && <button onClick={onRemove} className="adm-tag-rm">×</button>}
    </span>
  )
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="adm-color-row">
      {COLORS.map(c => (
        <button
          key={c}
          className={`adm-color-dot ${value === c ? 'selected' : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
          type="button"
        />
      ))}
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="adm-color-custom" title="Custom color" />
    </div>
  )
}

function IconPicker({ value, onChange, options }) {
  return (
    <div className="adm-icon-row">
      {options.map(ic => (
        <button
          key={ic}
          className={`adm-icon-dot ${value === ic ? 'selected' : ''}`}
          onClick={() => onChange(ic)}
          type="button"
        >
          {ic}
        </button>
      ))}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className="adm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h3>{title}</h3>
          <button className="adm-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="adm-modal-body">{children}</div>
      </div>
    </div>
  )
}

// ── SKILLS PANEL ─────────────────────────────────────────────────────────────
function SkillsPanel() {
  const [groups, setGroups] = useState(getSkills)
  const [modal, setModal] = useState(null) // null | { mode:'add'|'edit', group }
  const [form, setForm] = useState({ category:'', icon:'🎨', items:[] })
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)

  const openAdd = () => {
    setForm({ category:'', icon:'🎨', items:[] })
    setNewSkillName(''); setNewSkillLevel(80)
    setModal({ mode:'add' })
  }
  const openEdit = (g) => {
    setForm({ category: g.category, icon: g.icon, items: [...g.items] })
    setNewSkillName(''); setNewSkillLevel(80)
    setModal({ mode:'edit', id: g.id })
  }

  const addSkillItem = () => {
    if (!newSkillName.trim()) return
    setForm(f => ({ ...f, items: [...f.items, { name: newSkillName.trim(), level: Number(newSkillLevel) }] }))
    setNewSkillName(''); setNewSkillLevel(80)
  }

  const removeSkillItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))

  const updateLevel = (i, val) => setForm(f => ({
    ...f, items: f.items.map((it, idx) => idx === i ? { ...it, level: Number(val) } : it)
  }))

  const save = () => {
    if (!form.category.trim()) return
    let next
    if (modal.mode === 'add') next = addSkillGroup(form)
    else next = updateSkillGroup(modal.id, form)
    setGroups(next); setModal(null)
  }

  const del = (id) => {
    if (!confirm('Delete this skill group?')) return
    setGroups(deleteSkillGroup(id))
  }

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2>Skills <span className="adm-count">{groups.length} groups</span></h2>
        <button className="adm-btn-add" onClick={openAdd}>+ Add Group</button>
      </div>

      <div className="adm-grid">
        {groups.map(g => (
          <div key={g.id} className="adm-card">
            <div className="adm-card-top">
              <span className="adm-card-icon">{g.icon}</span>
              <div>
                <div className="adm-card-title">{g.category}</div>
                <div className="adm-card-sub">{g.items.length} skills</div>
              </div>
              <div className="adm-card-actions">
                <button onClick={() => openEdit(g)} className="adm-btn-icon" title="Edit">✏️</button>
                <button onClick={() => del(g.id)} className="adm-btn-icon danger" title="Delete">🗑️</button>
              </div>
            </div>
            <div className="adm-skill-list">
              {g.items.map((it, i) => (
                <div key={i} className="adm-skill-row">
                  <span className="adm-skill-name">{it.name}</span>
                  <div className="adm-skill-bar-track">
                    <div className="adm-skill-bar-fill" style={{ width: `${it.level}%` }} />
                  </div>
                  <span className="adm-skill-pct">{it.level}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Skill Group' : 'Edit Skill Group'} onClose={() => setModal(null)}>
          <div className="adm-form">
            <label>Category Name *</label>
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Frontend" />

            <label>Icon</label>
            <IconPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} options={ICONS_SKILL} />

            <label>Skills in this group</label>
            <div className="adm-skill-add-row">
              <input
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="Skill name"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkillItem() } }}
              />
              <div className="adm-level-wrap">
                <input
                  type="range" min="1" max="100"
                  value={newSkillLevel}
                  onChange={e => setNewSkillLevel(e.target.value)}
                />
                <span>{newSkillLevel}%</span>
              </div>
              <button type="button" className="adm-btn-sm" onClick={addSkillItem}>Add</button>
            </div>

            {form.items.map((it, i) => (
              <div key={i} className="adm-skill-edit-row">
                <span className="adm-skill-name-sm">{it.name}</span>
                <input
                  type="range" min="1" max="100"
                  value={it.level}
                  onChange={e => updateLevel(i, e.target.value)}
                  className="adm-range-sm"
                />
                <span className="adm-pct-sm">{it.level}%</span>
                <button type="button" className="adm-btn-icon danger sm" onClick={() => removeSkillItem(i)}>×</button>
              </div>
            ))}

            <div className="adm-form-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>
                {modal.mode === 'add' ? 'Add Group' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── PROJECTS PANEL ───────────────────────────────────────────────────────────
const EMPTY_PROJ = { title:'', description:'', tech:[], type:'', icon:'🚀', color:'#00d4ff', features:[], featured:false, github:'', live:'' }

function ProjectsPanel() {
  const [projects, setProjects] = useState(getProjects)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_PROJ)
  const [techInput, setTechInput] = useState('')
  const [featInput, setFeatInput] = useState('')

  const openAdd = () => { setForm({ ...EMPTY_PROJ }); setTechInput(''); setFeatInput(''); setModal({ mode:'add' }) }
  const openEdit = (p) => { setForm({ ...p, tech: [...p.tech], features: [...p.features] }); setTechInput(''); setFeatInput(''); setModal({ mode:'edit', id: p.id }) }

  const addTag = (field, input, setInput) => {
    const val = input.trim()
    if (!val) return
    const items = val.split(',').map(s => s.trim()).filter(Boolean)
    setForm(f => ({ ...f, [field]: [...new Set([...f[field], ...items])] }))
    setInput('')
  }

  const removeTag = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }))

  const save = () => {
    if (!form.title.trim()) return
    let next
    if (modal.mode === 'add') next = addProject(form)
    else next = updateProject(modal.id, form)
    setProjects(next); setModal(null)
  }

  const del = (id) => { if (!confirm('Delete this project?')) return; setProjects(deleteProject(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2>Projects <span className="adm-count">{projects.length} total</span></h2>
        <button className="adm-btn-add" onClick={openAdd}>+ Add Project</button>
      </div>

      <div className="adm-list">
        {projects.map((p, idx) => (
          <div key={p.id} className="adm-list-item" style={{ '--item-color': p.color }}>
            <div className="adm-list-left">
              <span className="adm-list-num">#{String(idx+1).padStart(2,'0')}</span>
              <span className="adm-list-icon" style={{ background: `${p.color}20`, border: `1px solid ${p.color}40` }}>{p.icon}</span>
              <div>
                <div className="adm-list-title">{p.title}</div>
                <div className="adm-list-meta">
                  <span className="adm-type-badge">{p.type}</span>
                  {p.featured && <span className="adm-featured-badge">⭐ Featured</span>}
                  <span className="adm-tech-preview">{p.tech.slice(0,3).join(' · ')}{p.tech.length > 3 ? ` +${p.tech.length-3}` : ''}</span>
                </div>
              </div>
            </div>
            <div className="adm-card-actions">
              <button onClick={() => openEdit(p)} className="adm-btn-icon" title="Edit">✏️</button>
              <button onClick={() => del(p.id)} className="adm-btn-icon danger" title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="adm-form">
            <div className="adm-form-row">
              <div>
                <label>Project Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project name" />
              </div>
              <div>
                <label>Project Type</label>
                <input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="e.g. Web Application" />
              </div>
            </div>

            <label>Description *</label>
            <textarea rows="3" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the project..." />

            <label>Icon</label>
            <IconPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} options={ICONS_PROJ} />

            <label>Accent Color</label>
            <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />

            <label>Technologies (press Enter or comma to add)</label>
            <div className="adm-tag-input-wrap">
              <div className="adm-tags-display">
                {form.tech.map((t, i) => <Tag key={i} label={t} onRemove={() => removeTag('tech', i)} />)}
              </div>
              <div className="adm-tag-input-row">
                <input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, Node.js..." onKeyDown={e => { if (e.key==='Enter'||e.key===',') { e.preventDefault(); addTag('tech', techInput, setTechInput) } }} />
                <button type="button" className="adm-btn-sm" onClick={() => addTag('tech', techInput, setTechInput)}>Add</button>
              </div>
            </div>

            <label>Features (press Enter or comma to add)</label>
            <div className="adm-tag-input-wrap">
              <div className="adm-tags-display">
                {form.features.map((f, i) => <Tag key={i} label={f} onRemove={() => removeTag('features', i)} />)}
              </div>
              <div className="adm-tag-input-row">
                <input value={featInput} onChange={e => setFeatInput(e.target.value)} placeholder="Real-time updates..." onKeyDown={e => { if (e.key==='Enter'||e.key===',') { e.preventDefault(); addTag('features', featInput, setFeatInput) } }} />
                <button type="button" className="adm-btn-sm" onClick={() => addTag('features', featInput, setFeatInput)}>Add</button>
              </div>
            </div>

            <div className="adm-form-row">
              <div>
                <label>GitHub URL</label>
                <input value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/..." />
              </div>
              <div>
                <label>Live URL</label>
                <input value={form.live} onChange={e => setForm(f => ({ ...f, live: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <label className="adm-checkbox-label">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <span>⭐ Mark as Featured Project</span>
            </label>

            <div className="adm-form-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode === 'add' ? 'Add Project' : 'Save Changes'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── EXPERIENCE PANEL ─────────────────────────────────────────────────────────
const EMPTY_EXP = { role:'', company:'', period:'', type:'', color:'#00d4ff', points:[] }

function ExperiencePanel() {
  const [exps, setExps] = useState(getExperiences)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_EXP)
  const [pointInput, setPointInput] = useState('')

  const openAdd = () => { setForm({ ...EMPTY_EXP, points:[] }); setPointInput(''); setModal({ mode:'add' }) }
  const openEdit = (e) => { setForm({ ...e, points:[...e.points] }); setPointInput(''); setModal({ mode:'edit', id: e.id }) }

  const addPoint = () => {
    if (!pointInput.trim()) return
    setForm(f => ({ ...f, points: [...f.points, pointInput.trim()] }))
    setPointInput('')
  }
  const removePoint = (i) => setForm(f => ({ ...f, points: f.points.filter((_, idx) => idx !== i) }))

  const save = () => {
    if (!form.role.trim()) return
    let next
    if (modal.mode === 'add') next = addExperience(form)
    else next = updateExperience(modal.id, form)
    setExps(next); setModal(null)
  }

  const del = (id) => { if (!confirm('Delete this experience?')) return; setExps(deleteExperience(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2>Work Experience <span className="adm-count">{exps.length} entries</span></h2>
        <button className="adm-btn-add" onClick={openAdd}>+ Add Experience</button>
      </div>

      <div className="adm-timeline-list">
        {exps.map((e, i) => (
          <div key={e.id} className="adm-tl-item" style={{ '--tl-color': e.color }}>
            <div className="adm-tl-dot" style={{ background: e.color }} />
            <div className="adm-tl-content">
              <div className="adm-tl-header">
                <div>
                  <div className="adm-tl-role">{e.role}</div>
                  <div className="adm-tl-company">{e.company}</div>
                </div>
                <div className="adm-tl-right">
                  <span className="adm-tl-period">{e.period}</span>
                  <span className="adm-type-badge">{e.type}</span>
                  <div className="adm-card-actions">
                    <button onClick={() => openEdit(e)} className="adm-btn-icon">✏️</button>
                    <button onClick={() => del(e.id)} className="adm-btn-icon danger">🗑️</button>
                  </div>
                </div>
              </div>
              <ul className="adm-tl-points">
                {e.points.map((pt, pi) => <li key={pi}>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)}>
          <div className="adm-form">
            <div className="adm-form-row">
              <div>
                <label>Role / Title *</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Web Developer" />
              </div>
              <div>
                <label>Company / Organization</label>
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Creative Solution" />
              </div>
            </div>
            <div className="adm-form-row">
              <div>
                <label>Period</label>
                <input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="e.g. 2024 — Present" />
              </div>
              <div>
                <label>Type</label>
                <input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Full-time / Freelance..." />
              </div>
            </div>

            <label>Accent Color</label>
            <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />

            <label>Bullet Points</label>
            <div className="adm-tag-input-row">
              <input value={pointInput} onChange={e => setPointInput(e.target.value)} placeholder="What did you do here?" onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); addPoint() } }} />
              <button type="button" className="adm-btn-sm" onClick={addPoint}>Add</button>
            </div>
            <ul className="adm-points-list">
              {form.points.map((pt, i) => (
                <li key={i}>
                  <span>{pt}</span>
                  <button type="button" className="adm-btn-icon danger sm" onClick={() => removePoint(i)}>×</button>
                </li>
              ))}
            </ul>

            <div className="adm-form-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode === 'add' ? 'Add Experience' : 'Save Changes'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── EDUCATION PANEL ──────────────────────────────────────────────────────────
const EMPTY_EDU = { degree:'', school:'', period:'', icon:'🎓', color:'#00d4ff' }

function EducationPanel() {
  const [edus, setEdus] = useState(getEducation)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_EDU)

  const openAdd = () => { setForm({ ...EMPTY_EDU }); setModal({ mode:'add' }) }
  const openEdit = (e) => { setForm({ ...e }); setModal({ mode:'edit', id: e.id }) }

  const save = () => {
    if (!form.degree.trim()) return
    let next
    if (modal.mode === 'add') next = addEducation(form)
    else next = updateEducation(modal.id, form)
    setEdus(next); setModal(null)
  }

  const del = (id) => { if (!confirm('Delete this education entry?')) return; setEdus(deleteEducation(id)) }

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2>Education <span className="adm-count">{edus.length} entries</span></h2>
        <button className="adm-btn-add" onClick={openAdd}>+ Add Education</button>
      </div>

      <div className="adm-edu-grid">
        {edus.map(e => (
          <div key={e.id} className="adm-edu-card" style={{ '--edu-color': e.color }}>
            <div className="adm-edu-top">
              <span className="adm-edu-icon">{e.icon}</span>
              <div className="adm-card-actions">
                <button onClick={() => openEdit(e)} className="adm-btn-icon">✏️</button>
                <button onClick={() => del(e.id)} className="adm-btn-icon danger">🗑️</button>
              </div>
            </div>
            <div className="adm-edu-degree">{e.degree}</div>
            <div className="adm-edu-school">{e.school}</div>
            <div className="adm-edu-period">{e.period}</div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Education' : 'Edit Education'} onClose={() => setModal(null)}>
          <div className="adm-form">
            <label>Degree / Qualification *</label>
            <input value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. B.Sc. Software Engineering" />

            <label>Institution</label>
            <input value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} placeholder="e.g. Gift University" />

            <label>Period</label>
            <input value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="e.g. 2024 — Present" />

            <label>Icon</label>
            <IconPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} options={ICONS_EDU} />

            <label>Accent Color</label>
            <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />

            <div className="adm-form-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="adm-btn-save" onClick={save}>{modal.mode === 'add' ? 'Add Education' : 'Save Changes'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
const TABS = [
  { id:'skills',     label:'Skills',      icon:'⚡' },
  { id:'projects',   label:'Projects',    icon:'🚀' },
  { id:'experience', label:'Experience',  icon:'💼' },
  { id:'education',  label:'Education',   icon:'🎓' },
]

export default function Admin({ onClose }) {
  const [tab, setTab] = useState('skills')
  const [showReset, setShowReset] = useState(false)

  const handleReset = () => {
    if (!confirm('⚠️ This will reset ALL data to defaults. Are you sure?')) return
    resetAll()
    window.location.reload()
  }

  return (
    <div className="adm-overlay">
      <div className="adm-dashboard">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-sidebar-top">
            <div className="adm-logo">
              <span className="adm-logo-icon">⚙️</span>
              <div>
                <div className="adm-logo-title">Admin Panel</div>
                <div className="adm-logo-sub">Portfolio Manager</div>
              </div>
            </div>

            <nav className="adm-nav">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`adm-nav-item ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <span className="adm-nav-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="adm-sidebar-bottom">
            <button className="adm-btn-reset" onClick={handleReset}>
              🔄 Reset to Defaults
            </button>
            <button className="adm-btn-close-sidebar" onClick={onClose}>
              ← Back to Portfolio
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="adm-main">
          <div className="adm-topbar">
            <div className="adm-topbar-title">
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </div>
            <div className="adm-topbar-hint">
              Changes are saved automatically to your browser
            </div>
          </div>

          <div className="adm-content">
            {tab === 'skills'     && <SkillsPanel />}
            {tab === 'projects'   && <ProjectsPanel />}
            {tab === 'experience' && <ExperiencePanel />}
            {tab === 'education'  && <EducationPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
