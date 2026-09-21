import React, { useState, useEffect, useRef } from 'react'
import './AdminLogin.css'

const CORRECT_USER = 'abaidulrehman'
const CORRECT_PASS = 'Abaid6015@()=$'

export default function AdminLogin({ onSuccess, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const userRef = useRef(null)

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === CORRECT_USER && password === CORRECT_PASS) {
      onSuccess()
    } else {
      setError('Invalid credentials. Access denied.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword('')
    }
  }

  return (
    <div className="admin-login-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`admin-login-box ${shake ? 'shake' : ''}`}>
        <div className="admin-login-header">
          <div className="admin-login-icon">🔐</div>
          <h2>Admin Access</h2>
          <p>Enter credentials to continue</p>
          <button className="admin-login-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="aln-field">
            <label>Username</label>
            <input
              ref={userRef}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="aln-field">
            <label>Password</label>
            <div className="aln-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="aln-eye"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div className="aln-error">⚠️ {error}</div>}
          <button type="submit" className="aln-submit">
            <span>Authenticate</span>
            <span>→</span>
          </button>
        </form>
        <div className="aln-hint">
          <code>Ctrl+Shift+A</code> to toggle this panel
        </div>
      </div>
    </div>
  )
}
