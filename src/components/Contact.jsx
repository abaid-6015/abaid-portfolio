import React, { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiGithub } from 'react-icons/fi'
import { SiUpwork, SiFiverr } from 'react-icons/si'
import './Contact.css'

function useInView(t=0.08){ const r=useRef(null); const [v,setV]=useState(false); useEffect(()=>{ const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setV(true) },{threshold:t}); if(r.current)o.observe(r.current); return()=>o.disconnect() },[t]); return[r,v] }

const SERVICE_ID  = 'service_qx4txoa'
const TEMPLATE_ID = 'template_kzu1m6u'
const PUBLIC_KEY  = '1YADg98Hck7ZZUjod'

const CHANNELS = [
  { Icon:FiMail,     label:'Email',    value:'abaidbse@gmail.com',      href:'mailto:abaidbse@gmail.com',     color:'#5B4FFF' },
  { Icon:FiPhone,    label:'Phone',    value:'+92 328 1632432',          href:'tel:+923281632432',             color:'#00E5FF' },
  { Icon:FiMapPin,   label:'Location', value:'Gujranwala, Pakistan',     href:null,                            color:'#FF9F0A' },
  { Icon:FiLinkedin, label:'LinkedIn', value:'abaid-ul-rehman',          href:'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/', color:'#0a66c2' },
  { Icon:FiGithub,   label:'GitHub',   value:'abaid-6015',               href:'https://github.com/abaid-6015', color:'#8b5cf6' },
  { Icon:SiUpwork,   label:'Upwork',   value:'View Profile',             href:'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share', color:'#6fda44' },
  { Icon:SiFiverr,   label:'Fiverr',   value:'abaid_bse',                href:'https://www.fiverr.com/abaid_bse', color:'#1dbf73' },
]

export default function Contact() {
  const [ref,v] = useInView()
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle')
  const [focused, setFocused] = useState(null)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name, from_email: form.email,
        subject: form.subject || 'Portfolio Contact',
        message: form.message, to_email: 'abaidbse@gmail.com',
      }, PUBLIC_KEY)
      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact__head">
          <div className="label">Contact</div>
          <h2 className="heading contact__title">Let's build something <span className="grad-text">together</span></h2>
          <p className="contact__sub">Open for freelance projects, full-time roles, or just a conversation.</p>
        </div>

        <div className={`contact__layout ${v?'contact__layout--in':''}`} ref={ref}>
          {/* Info bento */}
          <div className="bento contact__info">
            <div className="contact__avail">
              <span className="contact__avail-dot"/>
              <span>Open to work — response within 24h</span>
            </div>
            <h3 className="contact__info-heading">Get in touch</h3>
            <p className="contact__info-p">Have a project in mind or want to collaborate? I'd love to hear from you.</p>

            <div className="contact__channels">
              {CHANNELS.map(({Icon,label,value,href,color})=>(
                <a key={label} href={href||undefined} target={href?.startsWith('http')?'_blank':undefined}
                  rel={href?.startsWith('http')?'noopener noreferrer':undefined}
                  className={`contact__channel ${!href?'contact__channel--no-link':''}`}
                  style={{'--cc':color}}>
                  <span className="contact__ch-icon"><Icon size={15}/></span>
                  <div>
                    <div className="contact__ch-label">{label}</div>
                    <div className="contact__ch-value">{value}</div>
                  </div>
                  {href && <span className="contact__ch-arrow">↗</span>}
                </a>
              ))}
            </div>
          </div>

          {/* Form bento */}
          <div className="bento contact__form-tile">
            <form className="contact__form" onSubmit={submit} noValidate>
              <div className="cf-row">
                <div className={`cf-field ${focused==='name'||form.name?'cf-field--active':''}`}>
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" name="name" type="text" value={form.name}
                    onChange={handle} onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)}
                    required autoComplete="name"/>
                  <div className="cf-line"/>
                </div>
                <div className={`cf-field ${focused==='email'||form.email?'cf-field--active':''}`}>
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" name="email" type="email" value={form.email}
                    onChange={handle} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)}
                    required autoComplete="email"/>
                  <div className="cf-line"/>
                </div>
              </div>
              <div className={`cf-field ${focused==='subject'||form.subject?'cf-field--active':''}`}>
                <label htmlFor="cf-subj">Subject</label>
                <input id="cf-subj" name="subject" type="text" value={form.subject}
                  onChange={handle} onFocus={()=>setFocused('subject')} onBlur={()=>setFocused(null)}/>
                <div className="cf-line"/>
              </div>
              <div className={`cf-field ${focused==='message'||form.message?'cf-field--active':''}`}>
                <label htmlFor="cf-msg">Message</label>
                <textarea id="cf-msg" name="message" rows="5" value={form.message}
                  onChange={handle} onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)}
                  required/>
                <div className="cf-line"/>
              </div>

              <button type="submit" className={`btn btn-fill cf-submit ${status}`} disabled={status==='sending'}>
                {status==='idle'    && <><FiSend size={15}/> Send Message</>}
                {status==='sending' && <><span className="cf-spin">◌</span> Sending...</>}
                {status==='success' && <>✓ Message Sent!</>}
                {status==='error'   && <>✕ Failed — try again</>}
              </button>

              {status==='success' && (
                <div className="cf-feedback cf-feedback--ok">Your message was sent! I'll reply to abaidbse@gmail.com shortly.</div>
              )}
              {status==='error' && (
                <div className="cf-feedback cf-feedback--err">
                  Something went wrong. Email directly: <a href="mailto:abaidbse@gmail.com">abaidbse@gmail.com</a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
