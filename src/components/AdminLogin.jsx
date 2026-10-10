import React,{useState,useEffect,useRef} from 'react'
import {authRequest,SITE_SLUG} from '../store/dataStore'
export default function AdminLogin({onSuccess,onClose}){
  const [u,setU]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('');const [shake,setShake]=useState(false);const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);const ref=useRef(null)
  useEffect(()=>{ref.current?.focus()},[])
  const submit=async e=>{e.preventDefault();setErr('');setBusy(true);try{await authRequest('login',{username:u.trim(),password:p});setP('');onSuccess()}catch(error){setErr(error.message);setShake(true);setTimeout(()=>setShake(false),500);setP('')}finally{setBusy(false)}}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.88)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000}}>
      <div style={{background:'#0c1128',border:'1px solid rgba(91,79,255,.28)',borderRadius:'16px',padding:'2.5rem',width:'100%',maxWidth:'400px',position:'relative',boxShadow:'0 0 60px rgba(91,79,255,.15)',animation:shake?'shake .4s ease':'slideUp .3s cubic-bezier(.34,1.56,.64,1)'}}>
        <style>{`@keyframes slideUp{from{transform:translateY(30px) scale(.95);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
        <button onClick={onClose} style={{position:'absolute',top:'1rem',right:'1rem',background:'rgba(255,255,255,.07)',border:'none',color:'#8892a4',width:'28px',height:'28px',borderRadius:'6px',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{fontSize:'2rem',marginBottom:'.5rem'}}>🔐</div>
          <h2 style={{fontFamily:'var(--sans)',fontSize:'1.4rem',fontWeight:700,color:'#EDF2FF',marginBottom:'.2rem'}}>Admin Access</h2>
          <p style={{fontSize:'.8rem',color:'#8892a4'}}>Portfolio Control Panel</p>
        </div>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {[['Username',u,setU,'text'],['Password',p,setP,show?'text':'password']].map(([lbl,val,setter,type])=>(
            <div key={lbl} style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
              <label style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'var(--accent,#5B4FFF)',letterSpacing:'.1em',textTransform:'uppercase'}}>{lbl}</label>
              <input ref={lbl==='Username'?ref:null} type={type} value={val} onChange={e=>setter(e.target.value)}
                style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(91,79,255,.2)',borderRadius:'8px',padding:'.7rem 1rem',color:'#EDF2FF',fontFamily:'var(--mono)',fontSize:'.9rem',outline:'none'}}/>
            </div>
          ))}
          {err&&<div style={{background:'rgba(255,77,77,.1)',border:'1px solid rgba(255,77,77,.3)',borderRadius:'8px',padding:'.65rem 1rem',color:'#ff6b6b',fontSize:'.82rem',textAlign:'center'}}>⚠️ {err}</div>}
          <button type="submit" disabled={busy} style={{background:'linear-gradient(135deg,var(--accent,#5B4FFF),#7B6FFF)',color:'#fff',border:'none',borderRadius:'8px',padding:'.875rem',fontFamily:'var(--sans)',fontSize:'.85rem',fontWeight:600,cursor:'pointer',marginTop:'.25rem'}}>{busy?'Authenticating...':'Authenticate →'}</button>
        </form>
        <div style={{textAlign:'center',marginTop:'1.25rem',fontSize:'.7rem',color:'#4a5568',fontFamily:'var(--mono)'}}>Ctrl+Shift+{SITE_SLUG==='abaid'?'A':'M'} to toggle</div>
      </div>
    </div>
  )
}
