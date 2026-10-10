import React,{useRef,useState,useEffect} from 'react'
import {FiMail,FiPhone,FiMapPin,FiSend,FiLinkedin,FiGithub} from 'react-icons/fi'
import {SiUpwork,SiFiverr} from 'react-icons/si'
import {getContact,getSocials,onUpdate} from '../store/dataStore'
function useInView(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:.08});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}
const ICON_MAP={linkedin:FiLinkedin,github:FiGithub,upwork:SiUpwork,fiverr:SiFiverr,mail:FiMail}
const SC={linkedin:'#0a66c2',github:'#8b5cf6',upwork:'#6fda44',fiverr:'#1dbf73',mail:'#5B4FFF'}
export default function Contact(){
  const[ref,v]=useInView()
  const[cd,setCd]=useState(getContact)
  const[socials,setSocials]=useState(getSocials)
  const[form,setForm]=useState({name:'',email:'',subject:'',message:''})
  const[status,setStatus]=useState('idle')
  const[focused,setFocused]=useState(null)
  useEffect(()=>onUpdate(()=>{setCd(getContact());setSocials(getSocials())}),[])
  const handle=e=>setForm(p=>({...p,[e.target.name]:e.target.value}))
  const submit=async e=>{
    e.preventDefault();if(!form.name||!form.email||!form.message)return;setStatus('sending')
    try{
      await fetch(cd.scriptUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.name,email:form.email,subject:form.subject||'Portfolio Contact',message:form.message})})
      setStatus('success');setForm({name:'',email:'',subject:'',message:''});setTimeout(()=>setStatus('idle'),5000)
    }catch{setStatus('error');setTimeout(()=>setStatus('idle'),5000)}
  }
  const fixedCh=[
    {Icon:FiMail,label:'Email',value:cd.email,href:`mailto:${cd.email}`,color:'#5B4FFF'},
    {Icon:FiPhone,label:'Phone',value:cd.phone,href:`tel:${(cd.phone||'').replace(/\s/g,'')}`,color:'#00E5FF'},
    {Icon:FiMapPin,label:'Location',value:cd.location,href:null,color:'#FF9F0A'},
  ]
  const socialCh=socials.filter(s=>s.show&&s.url&&s.icon!=='mail').map(s=>({Icon:ICON_MAP[s.icon]||FiMail,label:s.platform,value:s.platform,href:s.url,color:SC[s.icon]||'#5B4FFF'}))
  const allCh=[...fixedCh,...socialCh]
  const fieldStyle=(name)=>({position:'relative',display:'flex',flexDirection:'column',gap:'.35rem'})
  const inputStyle={background:'rgba(255,255,255,.03)',border:'none',borderBottom:`1px solid ${focused===null?'var(--border)':'var(--border)'}`,color:'var(--text)',fontFamily:'var(--sans)',fontSize:'.9rem',padding:'.6rem 0',outline:'none',resize:'none',transition:'border-color .2s',width:'100%'}
  return(
    <section id="contact" style={{background:'var(--depth)',padding:'100px 0'}}>
      <div className="wrap">
        <div className="label">Contact</div>
        <h2 className="heading" style={{marginTop:'.5rem'}}>{(cd.heading||'').split(' ').slice(0,-1).join(' ')} <span className="grad-text">{(cd.heading||'').split(' ').slice(-1)}</span></h2>
        <p style={{fontSize:'.95rem',color:'var(--text2)',marginTop:'.5rem',marginBottom:'2.5rem'}}>{cd.subtext}</p>
        <div ref={ref} style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:'1.25rem',opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .7s,transform .7s'}}>
          {/* Info */}
          <div className="bento" style={{padding:'2rem',display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'.45rem',fontSize:'.74rem',color:'#30D158',fontWeight:500}}>
              <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#30D158',boxShadow:'0 0 8px #30D158'}}/>Open to work — reply within 24h
            </div>
            <h3 style={{fontSize:'1.2rem',fontWeight:700,color:'var(--text)'}}>Get in touch</h3>
            <p style={{fontSize:'.87rem',color:'var(--text2)',lineHeight:1.7}}>Have a project in mind or want to collaborate? I'd love to hear from you.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {allCh.map(({Icon,label,value,href,color})=>(
                <a key={label} href={href||undefined} target={href?.startsWith('http')?'_blank':undefined} rel={href?.startsWith('http')?'noopener noreferrer':undefined}
                  style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.7rem .9rem',borderRadius:'12px',background:'var(--glass)',border:'1px solid var(--border)',textDecoration:'none',transition:'all .22s',cursor:href?'none':'default'}}
                  onMouseEnter={e=>{if(href){e.currentTarget.style.borderColor=`color-mix(in srgb,${color} 35%,transparent)`;e.currentTarget.style.transform='translateX(3px)'}}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none'}}>
                  <span style={{color,lineHeight:1,flexShrink:0}}><Icon size={15}/></span>
                  <div>
                    <div style={{fontFamily:'var(--mono)',fontSize:'.63rem',color:'var(--text3)',letterSpacing:'.06em'}}>{label}</div>
                    <div style={{fontSize:'.8rem',color:'var(--text)',fontWeight:500}}>{value}</div>
                  </div>
                  {href&&<span style={{marginLeft:'auto',fontSize:'.75rem',color:'var(--text3)'}}>↗</span>}
                </a>
              ))}
            </div>
          </div>
          {/* Form */}
          <div className="bento" style={{padding:'2rem'}}>
            <form onSubmit={submit} noValidate style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
                {[['name','Name','text'],['email','Email','email']].map(([nm,lbl,type])=>(
                  <div key={nm} style={fieldStyle(nm)}>
                    <label style={{fontFamily:'var(--mono)',fontSize:'.67rem',color:focused===nm?'var(--accent2)':'var(--text3)',letterSpacing:'.08em',transition:'color .2s'}}>{lbl}</label>
                    <input name={nm} type={type} value={form[nm]} onChange={handle} onFocus={()=>setFocused(nm)} onBlur={()=>setFocused(null)} required autoComplete={nm} style={{...inputStyle,borderBottomColor:focused===nm?'var(--accent2)':'var(--border)'}}/>
                    <div style={{position:'absolute',bottom:0,left:0,height:'1px',width:focused===nm||form[nm]?'100%':'0',background:'var(--accent)',transition:'width .3s'}}/>
                  </div>
                ))}
              </div>
              {['subject','message'].map(nm=>(
                <div key={nm} style={fieldStyle(nm)}>
                  <label style={{fontFamily:'var(--mono)',fontSize:'.67rem',color:focused===nm?'var(--accent2)':'var(--text3)',letterSpacing:'.08em',textTransform:'capitalize',transition:'color .2s'}}>{nm}</label>
                  {nm==='message'
                    ?<textarea name={nm} rows="5" value={form[nm]} onChange={handle} onFocus={()=>setFocused(nm)} onBlur={()=>setFocused(null)} required style={{...inputStyle,minHeight:'110px',borderBottomColor:focused===nm?'var(--accent2)':'var(--border)'}}/>
                    :<input name={nm} type="text" value={form[nm]} onChange={handle} onFocus={()=>setFocused(nm)} onBlur={()=>setFocused(null)} style={{...inputStyle,borderBottomColor:focused===nm?'var(--accent2)':'var(--border)'}}/>
                  }
                  <div style={{position:'absolute',bottom:0,left:0,height:'1px',width:focused===nm||form[nm]?'100%':'0',background:'var(--accent)',transition:'width .3s'}}/>
                </div>
              ))}
              <button type="submit" disabled={status==='sending'} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem',padding:'.875rem',borderRadius:'12px',fontFamily:'var(--sans)',fontSize:'.85rem',fontWeight:600,cursor:'none',border:'none',background:status==='success'?'#30D158':status==='error'?'#FF375F':'var(--accent)',color:'#fff',transition:'all .25s'}}>
                {status==='idle'&&<><FiSend size={15}/> Send Message</>}
                {status==='sending'&&<><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⟳</span> Sending...</>}
                {status==='success'&&<>✓ Message Sent!</>}
                {status==='error'&&<>✕ Failed — try again</>}
              </button>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              {status==='success'&&<div style={{padding:'.75rem 1rem',borderRadius:'8px',background:'rgba(48,209,88,.1)',border:'1px solid rgba(48,209,88,.25)',color:'#30D158',fontSize:'.82rem'}}>Your message was sent! I'll reply to {cd.email} shortly.</div>}
              {status==='error'&&<div style={{padding:'.75rem 1rem',borderRadius:'8px',background:'rgba(255,55,95,.1)',border:'1px solid rgba(255,55,95,.25)',color:'#FF375F',fontSize:'.82rem'}}>Something went wrong. Email: <a href={`mailto:${cd.email}`} style={{color:'var(--accent2)'}}>{cd.email}</a></div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
