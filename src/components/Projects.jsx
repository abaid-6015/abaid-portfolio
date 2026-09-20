import React, { useRef, useState, useEffect } from 'react'
import { getProjects } from '../store/dataStore'
import './Projects.css'

function useInView(threshold = 0.08) {
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
    <div className={`project-card card ${project.featured ? 'featured' : ''} ${inView ? 'visible' : ''}`}
      style={{ '--proj-color': project.color, animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="proj-header">
        <div className="proj-id">{String(index + 1).padStart(2, '0')}</div>
        <div className="proj-icon" style={{ background: `${project.color}18`, border: `1px solid ${project.color}35` }}>
          {project.icon}
        </div>
        <div className="proj-type-badge" style={{ color: project.color, background: `${project.color}12` }}>
          {project.type}
        </div>
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
      <div className="proj-links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-link">
            <span>🐙</span> Code
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-link live-link"
            style={{ background: `${project.color}18`, borderColor: `${project.color}40`, color: project.color }}>
            <span>🚀</span> Live Demo ↗
          </a>
        )}
      </div>
      <div className="proj-glow"
        style={{ background: project.color, opacity: hovered ? 0.12 : 0 }} />
    </div>
  )
}

const wpProjects = [
  {
    title: 'WordPress Business Site',
    desc: 'Responsive business website designed and developed using WordPress with custom CSS, SEO optimization, and plugin integration.',
    tags: ['WordPress', 'CSS', 'SEO'],
    color: '#21759b', icon: '🌐',
  },
  {
    title: 'Ad-Serving Platform',
    desc: 'Streamlined ad-serving platform with scalable backend logic, database management, and WordPress frontend integration.',
    tags: ['WordPress', 'PHP', 'MySQL', 'CSS'],
    color: '#f89820', icon: '📢',
  },
]

export default function Projects() {
  const [ref, inView] = useInView()
  const [projects, setProjects] = useState(() => getProjects())

  useEffect(() => {
    const handler = () => setProjects(getProjects())
    window.addEventListener('portfolio-data-updated', handler)
    return () => window.removeEventListener('portfolio-data-updated', handler)
  }, [])

  const featured = projects.filter(p => p.featured)
  const others = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <div className="projects-header">
          <div className="section-tag">03. Projects</div>
          <h2 className="section-title">Things I've <span className="highlight">Built</span></h2>
          <p className="projects-subtitle">A showcase of real-world applications, from concept to deployment</p>
        </div>

        <div className="proj-label-row">
          <span className="proj-section-label">⭐ Featured Projects</span>
        </div>
        <div className="projects-grid featured-grid" ref={ref}>
          {featured.map((proj, i) => <ProjectCard key={proj.id} project={proj} index={i} inView={inView} />)}
        </div>

        <div className="proj-label-row" style={{ marginTop: '3rem' }}>
          <span className="proj-section-label">📁 Other Projects</span>
        </div>
        <div className="projects-grid other-grid">
          {others.map((proj, i) => <ProjectCard key={proj.id} project={proj} index={i} inView={inView} />)}
        </div>

        <div className="proj-label-row" style={{ marginTop: '3rem' }}>
          <span className="proj-section-label">🌐 WordPress Projects</span>
        </div>
        <div className="projects-grid wp-grid">
          {wpProjects.map((p, i) => (
            <div key={i} className="project-card card wp-card" style={{ '--proj-color': p.color }}>
              <div className="proj-header">
                <div className="proj-icon" style={{ background: `${p.color}18`, border: `1px solid ${p.color}35` }}>{p.icon}</div>
                <div className="proj-type-badge" style={{ color: p.color, background: `${p.color}12` }}>WordPress</div>
              </div>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-tech">
                {p.tags.map((t, j) => <span key={j} className="tech-tag">{t}</span>)}
              </div>
              <p className="wp-note">📌 Developed at Creative Solution — available on request</p>
            </div>
          ))}
        </div>

        <div className="proj-github-cta">
          <a href="https://github.com/abaid-6015" target="_blank" rel="noopener noreferrer"
            className="github-cta-btn">
            <span>🐙</span><span>View All Repositories on GitHub</span><span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}