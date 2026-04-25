import React, { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const text = 'ABAID.DEV'

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="loader-logo">
          {text.split('').map((char, i) => (
            <span key={i} className="loader-char" style={{ animationDelay: `${i * 0.08}s` }}>
              {char}
            </span>
          ))}
        </div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-percent">{progress}%</div>
        <div className="loader-sub">Initializing Portfolio...</div>
      </div>
      <div className="loader-grid" />
    </div>
  )
}
