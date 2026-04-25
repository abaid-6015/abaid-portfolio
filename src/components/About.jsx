import React, { useEffect, useRef, useState } from 'react'
import './About.css'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="about-section">
      <div className="section-container" ref={ref}>
        <div className={`about-grid ${inView ? 'visible' : ''}`}>
          <div className="about-left">
            <div className="section-tag">01. About Me</div>
            <h2 className="section-title">
              Passionate Developer,<br />
              <span className="highlight">Problem Solver</span>
            </h2>

            <div className="about-text">
              <p>
                I'm <strong>Abaid-ul-Rehman</strong>, a Software Engineering student at{' '}
                <span className="about-accent">Gift University, Gujranwala</span> with a deep passion 
                for building digital products that blend beautiful design with robust engineering.
              </p>
              <p>
                My journey spans <span className="about-accent">full-stack web development</span> with 
                the MERN stack, cross-platform mobile apps using React Native, WordPress design, Java 
                programming, and database management. I thrive at the intersection of creativity and logic.
              </p>
              <p>
                Currently working on web development & designing projects at{' '}
                <span className="about-accent">Creative Solution</span>, where I architect scalable 
                platforms, design intuitive UI/UX prototypes, and manage database operations.
              </p>
            </div>

            <div className="about-facts">
              {[
                { label: 'Location', value: 'Gujranwala, Pakistan' },
                { label: 'Degree', value: 'B.Sc. Software Engineering' },
                { label: 'Email', value: 'abaidbse@gmail.com' },
                { label: 'Status', value: 'Available for Work ✓' },
              ].map((f, i) => (
                <div key={i} className="about-fact">
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-sep">//</span>
                  <span className="fact-value">{f.value}</span>
                </div>
              ))}
            </div>

            <div className="about-actions">
              <button
                className="btn-primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Hire Me
              </button>
              <a
                href="https://github.com/abaidbse"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                GitHub →
              </a>
            </div>
          </div>

          <div className="about-right">
            <div className="about-photo-wrap">
              <div className="about-photo-frame">
                <img
                  src="/ME.png"
                  alt="Abaid-ul-Rehman"
                  className="about-photo-img"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="about-photo-placeholder" style={{ display: 'none' }}>
                  <div className="photo-initials">AR</div>
                  <div className="photo-subtitle">Full-Stack Dev</div>
                </div>
              </div>
              <div className="photo-deco photo-deco-1" />
              <div className="photo-deco photo-deco-2" />
              <div className="photo-badge">
                <span className="badge-icon">⚡</span>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
