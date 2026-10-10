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
const SHORTCUT_KEY='A'
const ADMIN_USER='abaidulrehman'
const ADMIN_PASS='Abaid6015@()=$'
export default function App(){
  const [loading,setLoading]=useState(true)
  const [adminState,setAdminState]=useState('idle')
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),2600);return()=>clearTimeout(t)},[])
  useEffect(()=>{
    const fn=e=>{
      if(e.ctrlKey&&e.shiftKey&&e.key===SHORTCUT_KEY){e.preventDefault();setAdminState(p=>p==='idle'?'login':'idle')}
      if(e.key==='Escape'&&adminState!=='idle')setAdminState('idle')
    }
    window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)
  },[adminState])
  const handleLogin=useCallback(()=>setAdminState('panel'),[])
  const handleClose=useCallback(()=>setAdminState('idle'),[])
  if(loading)return <Loader/>
  return(
    <div className="app">
      <CustomCursor/>
      <Navbar/>
      <main><Hero/><About/><Skills/><Projects/><Experience/><Contact/></main>
      <Footer/>
      {adminState==='login'&&<AdminLogin onSuccess={handleLogin} onClose={handleClose} adminUser={ADMIN_USER} adminPass={ADMIN_PASS}/>}
      {adminState==='panel'&&<Admin onClose={handleClose}/>}
    </div>
  )
}
