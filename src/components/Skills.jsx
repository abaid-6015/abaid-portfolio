import React, { useRef, useState, useEffect } from 'react'
import { getSkills } from '../store/dataStore'
import './Skills.css'

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

const techOrbs = [
  { name: 'React', color: '#61dafb', x: 50, y: 50 },
  { name: 'Node', color: '#68a063', x: 20, y: 30 },
  { name: 'MongoDB', color: '#4ea94b', x: 80, y: 25 },
  { name: 'Java', color: '#f89820', x: 15, y: 65 },
  { name: 'PHP', color: '#8892be', x: 85, y: 70 },
  { name: 'Three.js', color: '#00d4ff', x: 50, y: 80 },
  { name: 'Figma', color: '#ff7262', x: 30, y: 80 },
  { name: 'MySQL', color: '#4479a1', x: 70, y: 55 },
]

function SkillOrbs() {
  return (
    <div className="skill-orbs">
      {techOrbs.map((orb, i) => (
        <div key={i} className="skill-orb" style={{ left: `${orb.x}%`, top: `${orb.y}%`, '--orb-color': orb.color, animationDelay: `${i * 0.4}s`, animationDuration: `${5 + i * 0.5}s` }}>
          <div className="orb-inner" style={{ background: orb.color }}><span className="orb-text">{orb.name}</span></div>
          <div className="orb-ring" style={{ borderColor: orb.color }} />
        </div>
      ))}
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView()
  const [skillGroups, setSkillGroups] = useState(() => getSkills())

  useEffect(() => {
    const handler = () => setSkillGroups(getSkills())
    window.addEventListener('portfolio-data-updated', handler)
    return () => window.removeEventListener('portfolio-data-updated', handler)
  }, [])

  return (
    <section id="skills" className="skills-section">
      <div className="section-container">
        <div className="skills-header">
          <div className="section-tag">02. Skills</div>
          <h2 className="section-title">Technologies I <span className="highlight">Master</span></h2>
          <p className="skills-subtitle">A diverse toolkit built through real projects and continuous learning</p>
        </div>
        <div className="skills-orbs-wrap"><SkillOrbs /></div>
        <div className={`skills-grid ${inView ? 'visible' : ''}`} ref={ref}>
          {skillGroups.map((group, gi) => (
            <div key={group.id} className="skill-card card" style={{ animationDelay: `${gi * 0.15}s` }}>
              <div className="skill-card-header">
                <span className="skill-cat-icon">{group.icon}</span>
                <h3 className="skill-cat-title">{group.category}</h3>
              </div>
              <div className="skill-bars">
                {group.items.map((skill, si) => (
                  <div key={si} className="skill-bar-item">
                    <div className="skill-bar-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: inView ? `${skill.level}%` : '0%', transitionDelay: `${gi * 0.15 + si * 0.12 + 0.3}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
