import React, { useRef, useState, useEffect } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiGithub } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import { getContact, getSocials, onUpdate } from '../store/dataStore'
import './Contact.css'

function useInView(t=0.08){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

const ICON_MAP = { linkedin:FiLinkedin, github:FiGithub, upwork:SiUpwork, fiverr:SiFiverr, mail:FiMail }
const SOCIAL_COLORS = { linkedin:'#0a66c2', github:'#8b5cf6', upwork:'#6fda44', fiverr:'#1dbf73', mail:'#5B4FFF' }

export default function Contact() {
  const [ref,v] = useInView()
  const [cd, setCd]     = useState(getContact)
  const [socials, setSocials] = useState(getSocials)
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle')
  const [focused, setFocused] = useState(null)

  useEffect(() => onUpdate(() => { setCd(getContact()); setSocials(getSocials()) }), [])

  const handle = e => setForm(p=>({...p,[e.target.name]:e.target.value}))

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      await fetch(cd.scriptUrl, {
        method:'POST', mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name:form.name, email:form.email, subject:form.subject||'Portfolio Contact', message:form.message }),
      })
      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })
      setTimeout(()=>setStatus('idle'), 5000)
    } catch { setStatus('error'); setTimeout(()=>setStatus('idle'), 5000) }
  }

  const fixedChannels = [
    { Icon:FiMail,    label:'Email',    value:cd.email,    href:`mailto:${cd.email}`,   color:'#5B4FFF' },
    { Icon:FiPhone,   label:'Phone',    value:cd.phone,    href:`tel:${cd.phone?.replace(/\s/g,'')}`, color:'#00E5FF' },
    { Icon:FiMapPin,  label:'Location', value:cd.location, href:null,                   color:'#FF9F0A' },
  ]
  const socialChannels = socials.filter(s=>s.show && s.url && s.icon !== 'mail').map(s => ({
    Icon: ICON_MAP[s.icon] || FiMail, label:s.platform, value:s.platform, href:s.url, color:SOCIAL_COLORS[s.icon]||'#5B4FFF'
  }))
  const allChannels = [...fixedChannels, ...socialChannels]

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact__head">
          <div className="label">Contact</div>
          <h2 className="heading contact__title">{cd.heading?.split(' ').slice(0,-1).join(' ')} <span className="grad-text">{cd.heading?.split(' ').slice(-1)}</span></h2>
          <p className="contact__sub">{cd.subtext}</p>
        </div>
        <div className={`contact__layout ${v?'contact__layout--in':''}`} ref={ref}>
          <div className="bento contact__info">
            <div className="contact__avail"><span className="contact__avail-dot"/><span>Open to work — response within 24h</span></div>
            <h3 className="contact__info-heading">Get in touch</h3>
            <p className="contact__info-p">Have a project in mind or want to collaborate? I'd love to hear from you.</p>
            <div className="contact__channels">
              {allChannels.map(({Icon,label,value,href,color})=>(
                <a key={label} href={href||undefined} target={href?.startsWith('http')?'_blank':undefined}
                  rel={href?.startsWith('http')?'noopener noreferrer':undefined}
                  className={`contact__channel ${!href?'contact__channel--no-link':''}`}
                  style={{'--cc':color}}>
                  <span className="contact__ch-icon"><Icon size={15}/></span>
                  <div><div className="contact__ch-label">{label}</div><div className="contact__ch-value">{value}</div></div>
                  {href && <span className="contact__ch-arrow">↗</span>}
                </a>
              ))}
            </div>
          </div>
          <div className="bento contact__form-tile">
            <form className="contact__form" onSubmit={submit} noValidate>
              <div className="cf-row">
                <div className={`cf-field ${focused==='name'||form.name?'cf-field--active':''}`}>
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" name="name" type="text" value={form.name} onChange={handle} onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} required autoComplete="name"/>
                  <div className="cf-line"/>
                </div>
                <div className={`cf-field ${focused==='email'||form.email?'cf-field--active':''}`}>
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" name="email" type="email" value={form.email} onChange={handle} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} required autoComplete="email"/>
                  <div className="cf-line"/>
                </div>
              </div>
              <div className={`cf-field ${focused==='subject'||form.subject?'cf-field--active':''}`}>
                <label htmlFor="cf-subj">Subject</label>
                <input id="cf-subj" name="subject" type="text" value={form.subject} onChange={handle} onFocus={()=>setFocused('subject')} onBlur={()=>setFocused(null)}/>
                <div className="cf-line"/>
              </div>
              <div className={`cf-field ${focused==='message'||form.message?'cf-field--active':''}`}>
                <label htmlFor="cf-msg">Message</label>
                <textarea id="cf-msg" name="message" rows="5" value={form.message} onChange={handle} onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)} required/>
                <div className="cf-line"/>
              </div>
              <button type="submit" className={`btn btn-fill cf-submit ${status}`} disabled={status==='sending'}>
                {status==='idle'    && <><FiSend size={15}/> Send Message</>}
                {status==='sending' && <><span className="cf-spin">◌</span> Sending...</>}
                {status==='success' && <>✓ Message Sent!</>}
                {status==='error'   && <>✕ Failed — try again</>}
              </button>
              {status==='success' && <div className="cf-feedback cf-feedback--ok">Your message was sent! I'll reply to {cd.email} shortly.</div>}
              {status==='error'   && <div className="cf-feedback cf-feedback--err">Something went wrong. Email directly: <a href={`mailto:${cd.email}`}>{cd.email}</a></div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
