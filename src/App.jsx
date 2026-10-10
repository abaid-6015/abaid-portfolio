import React,{useEffect,useState,useCallback} from 'react'
import './App.css'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Admin from './components/Admin'
import AdminLogin from './components/AdminLogin'
import {bootstrap,isAuthenticated,authRequest} from './store/dataStore'
const SHORTCUT_KEY='A'
export default function App(){
  const [loading,setLoading]=useState(true),[error,setError]=useState(''),[adminState,setAdminState]=useState('idle')
  const load=useCallback(async()=>{setLoading(true);setError('');try{await bootstrap()}catch(e){setError(e.message)}finally{setLoading(false)}},[])
  useEffect(()=>{load()},[load])
  // Fallback for browsers that reserve Ctrl+Shift+A / Ctrl+Shift+M.
  useEffect(()=>{if(window.location.pathname==='/admin'||new URLSearchParams(window.location.search).has('admin'))isAuthenticated().then(ok=>setAdminState(ok?'panel':'login'))},[])
  useEffect(()=>{if(loading||adminState!=='idle')return;const timer=setInterval(()=>bootstrap().catch(e=>console.warn('Portfolio refresh failed:',e.message)),60000);return()=>clearInterval(timer)},[loading,adminState])
  useEffect(()=>{
    const fn=e=>{
      if(e.ctrlKey&&e.shiftKey&&e.key.toUpperCase()===SHORTCUT_KEY){
        e.preventDefault();
        if(adminState!=='idle')setAdminState('idle')
        else isAuthenticated().then(ok=>setAdminState(ok?'panel':'login'))
      }
      if(e.key==='Escape'&&adminState!=='idle')setAdminState('idle')
    }
    window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)
  },[adminState])
  const handleClose=useCallback(()=>setAdminState('idle'),[])
  if(loading)return <Loader/>
  if(error)return <div role="alert" style={{minHeight:'100vh',display:'grid',placeContent:'center',padding:'2rem',textAlign:'center',background:'#050810',color:'#edf2ff',gap:'1rem'}}><h2>Portfolio temporarily unavailable</h2><p>{error}</p><p style={{color:'#8892a4'}}>Check MongoDB Atlas network access and Vercel environment variables.</p><button onClick={load} style={{cursor:'pointer',padding:'.8rem',background:'#5B4FFF',borderRadius:10,color:'white'}}>Retry connection</button></div>
  return <div className="app">
    <CustomCursor/><Navbar/>
    <main><Hero/><About/><Skills/><Projects/><Experience/><Contact/></main>
    <Footer/>
    {adminState==='login'&&<AdminLogin onSuccess={()=>setAdminState('panel')} onClose={handleClose}/>}
    {adminState==='panel'&&<Admin onClose={handleClose} onLogout={async()=>{try{await authRequest('logout')}finally{setAdminState('login')}}}/>}
  </div>
}
