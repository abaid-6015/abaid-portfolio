import React, { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

const SERVICE_ID = 'service_qx4txoa'
const TEMPLATE_ID = 'template_kzu1m6u'
const PUBLIC_KEY = '1YADg98Hck7ZZUjod'

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'abaidbse@gmail.com', href: 'mailto:abaidbse@gmail.com' },
  { icon: '📱', label: 'Phone', value: '0328-1632432', href: 'tel:+923281632432' },
  { icon: '📍', label: 'Location', value: 'Gujranwala, Pakistan', href: null },
  { icon: '🐙', label: 'GitHub', value: 'github.com/abaidbse', href: 'https://github.com/abaidbse' },
]

export default function Contact() {
  const [ref, inView] = useInView()
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('sending')

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject || 'Portfolio Inquiry',
          message: form.message,
          to_email: 'abaidbse@gmail.com',
        },
        PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="section-container" ref={ref}>
        <div className="contact-header">
          <div className="section-tag">05. Contact</div>
          <h2 className="section-title">
            Let's <span className="highlight">Work Together</span>
          </h2>
          <p className="contact-subtitle">
            Have a project in mind? I'd love to hear from you. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className={`contact-grid ${inView ? 'visible' : ''}`}>
          {/* Info */}
          <div className="contact-info">
            <h3 className="contact-info-title">Get In Touch</h3>
            <p className="contact-info-desc">
              Whether you have a project, a question, or just want to say hi — my inbox is always open!
            </p>

            <div className="contact-cards">
              {contactInfo.map((c, i) => (
                <a
                  key={i}
                  href={c.href || undefined}
                  target={c.href?.startsWith('http') ? '_blank' : undefined}
                  rel={c.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`contact-card ${!c.href ? 'no-link' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="contact-card-icon">{c.icon}</span>
                  <div>
                    <div className="contact-card-label">{c.label}</div>
                    <div className="contact-card-value">{c.value}</div>
                  </div>
                  {c.href && <span className="contact-card-arrow">→</span>}
                </a>
              ))}
            </div>

            <div className="availability-badge">
              <span className="avail-dot" />
              <span>Available for freelance &amp; full-time opportunities</span>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className={`form-group ${focused === 'name' ? 'focused' : ''} ${form.name ? 'filled' : ''}`}>
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="name"
                  />
                  <div className="field-line" />
                </div>
                <div className={`form-group ${focused === 'email' ? 'focused' : ''} ${form.email ? 'filled' : ''}`}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="email"
                  />
                  <div className="field-line" />
                </div>
              </div>

              <div className={`form-group ${focused === 'subject' ? 'focused' : ''} ${form.subject ? 'filled' : ''}`}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                />
                <div className="field-line" />
              </div>

              <div className={`form-group ${focused === 'message' ? 'focused' : ''} ${form.message ? 'filled' : ''}`}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  required
                />
                <div className="field-line" />
              </div>

              <button
                type="submit"
                className={`btn-primary submit-btn ${status === 'sending' ? 'sending' : ''}`}
                disabled={status === 'sending'}
              >
                {status === 'idle' && <><span>Send Message</span><span>→</span></>}
                {status === 'sending' && <><span>Sending...</span><span className="spinner">⟳</span></>}
                {status === 'success' && <><span>Message Sent!</span><span>✓</span></>}
                {status === 'error' && <><span>Error. Try Again</span><span>✗</span></>}
              </button>

              {status === 'success' && (
                <div className="form-feedback success">
                  ✅ Your message has been sent! I'll get back to you at abaidbse@gmail.com shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="form-feedback error">
                  ❌ Something went wrong. Please try emailing directly at abaidbse@gmail.com
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
