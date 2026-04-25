import React, { useEffect, useState } from 'react'
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
import './App.css'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [keysPressed, setKeysPressed] = useState([])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(t)
  }, [])

  // Secret shortcut: Ctrl+Shift+A opens admin
  useEffect(() => {
    const down = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAdmin(prev => !prev)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const closeAdmin = () => {
    // Dispatch so all sections re-read from store
    window.dispatchEvent(new Event('portfolio-data-updated'))
    setShowAdmin(false)
  }

  if (loading) return <Loader />

  return (
    <div className="app">
      <CustomCursor />
      <Navbar onAdminOpen={() => setShowAdmin(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />

      {/* Admin Panel */}
      {showAdmin && <Admin onClose={closeAdmin} />}

      {/* Admin trigger button - subtle */}
      <button
        className="admin-trigger"
        onClick={() => setShowAdmin(true)}
        title="Open Admin Panel (Ctrl+Shift+A)"
      >
        ⚙️
      </button>
    </div>
  )
}
