import React, { useRef, useState, useEffect } from 'react'
import { getProjects } from '../store/dataStore'
import './Projects.css'

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

function ProjectCard({ project, index, inView }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`project-card card ${project.featured ? 'featured' : ''} ${inView ? 'visible' : ''}`}
      style={{ '--proj-color': project.color, animationDelay: `${index * 0.12}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="proj-header">
        <div className="proj-id">{String(index + 1).padStart(2, '0')}</div>
        <div className="proj-icon" style={{ background: `${project.color}20`, border: `1px solid ${project.color}40` }}>{project.icon}</div>
        <div className="proj-type">{project.type}</div>
      </div>
      <h3 className="proj-title">{project.title}</h3>
      <p className="proj-desc">{project.description}</p>
      <div className="proj-features">
        {(project.features || []).map((f, i) => (
          <span key={i} className="proj-feature">
            <span className="feature-dot" style={{ background: project.color }} />{f}
          </span>
        ))}
      </div>
      <div className="proj-tech">
        {(project.tech || []).map((t, i) => <span key={i} className="tech-tag">{t}</span>)}
      </div>
      {(project.github || project.live) && (
        <div className="proj-links">
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-link">GitHub →</a>}
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-link live">Live ↗</a>}
        </div>
      )}
      <div className="proj-footer">
        <div className="proj-glow" style={{ background: project.color, opacity: hovered ? 0.15 : 0 }} />
      </div>
    </div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView()
  const [projects, setProjects] = useState(() => getProjects())

  useEffect(() => {
    const handler = () => setProjects(getProjects())
    window.addEventListener('portfolio-data-updated', handler)
    return () => window.removeEventListener('portfolio-data-updated', handler)
  }, [])

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <div className="projects-header">
          <div className="section-tag">03. Projects</div>
          <h2 className="section-title">Things I've <span className="highlight">Built</span></h2>
          <p className="projects-subtitle">A showcase of real-world applications, from concept to deployment</p>
        </div>
        <div className="projects-grid" ref={ref}>
          {projects.map((proj, i) => (
            <ProjectCard key={proj.id} project={proj} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
