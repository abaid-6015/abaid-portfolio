import React, { useEffect, useState, useCallback } from 'react'
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
import './App.css'

export default function App() {
  const [loading, setLoading]     = useState(true)
  const [adminState, setAdminState] = useState('idle') // idle | login | panel

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fn = e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setAdminState(p => p === 'idle' ? 'login' : 'idle')
      }
      if (e.key === 'Escape' && adminState !== 'idle') setAdminState('idle')
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [adminState])

  const handleLogin = useCallback(() => setAdminState('panel'), [])
  const handleClose = useCallback(() => setAdminState('idle'), [])

  if (loading) return <Loader />

  return (
    <div className="app">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      {adminState === 'login' && <AdminLogin onSuccess={handleLogin} onClose={handleClose} />}
      {adminState === 'panel' && <Admin onClose={handleClose} />}
    </div>
  )
}
