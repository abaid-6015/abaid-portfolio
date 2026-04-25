import React, { useRef, useState, useEffect } from 'react'
import { getExperiences, getEducation } from '../store/dataStore'
import './Experience.css'

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

export default function Experience() {
  const [ref, inView] = useInView()
  const [activeTab, setActiveTab] = useState('experience')
  const [experiences, setExperiences] = useState(() => getExperiences())
  const [education, setEducation] = useState(() => getEducation())

  useEffect(() => {
    const handler = () => {
      setExperiences(getExperiences())
      setEducation(getEducation())
    }
    window.addEventListener('portfolio-data-updated', handler)
    return () => window.removeEventListener('portfolio-data-updated', handler)
  }, [])

  return (
    <section id="experience" className="experience-section">
      <div className="section-container" ref={ref}>
        <div className="experience-header">
          <div className="section-tag">04. Experience</div>
          <h2 className="section-title">My <span className="highlight">Journey</span></h2>
        </div>
        <div className="exp-tabs">
          <button className={`exp-tab ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>💼 Work Experience</button>
          <button className={`exp-tab ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>🎓 Education</button>
        </div>

        {activeTab === 'experience' && (
          <div className={`timeline ${inView ? 'visible' : ''}`}>
            {experiences.map((exp, i) => (
              <div key={exp.id} className="timeline-item" style={{ '--exp-color': exp.color, animationDelay: `${i * 0.15}s` }}>
                <div className="timeline-connector">
                  <div className="timeline-dot" style={{ background: exp.color, boxShadow: `0 0 15px ${exp.color}` }} />
                  {i < experiences.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content card">
                  <div className="exp-header">
                    <div>
                      <h3 className="exp-role">{exp.role}</h3>
                      <div className="exp-company">{exp.company}</div>
                    </div>
                    <div className="exp-meta">
                      <span className="exp-period">{exp.period}</span>
                      <span className="exp-type">{exp.type}</span>
                    </div>
                  </div>
                  <ul className="exp-points">
                    {(exp.points || []).map((p, pi) => (
                      <li key={pi} className="exp-point">
                        <span className="point-dot" style={{ background: exp.color }} />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div className={`edu-grid ${inView ? 'visible' : ''}`}>
            {education.map((edu, i) => (
              <div key={edu.id} className="edu-card card" style={{ '--edu-color': edu.color, animationDelay: `${i * 0.15}s` }}>
                <div className="edu-icon">{edu.icon}</div>
                <h3 className="edu-degree">{edu.degree}</h3>
                <div className="edu-school">{edu.school}</div>
                <div className="edu-period">{edu.period}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
