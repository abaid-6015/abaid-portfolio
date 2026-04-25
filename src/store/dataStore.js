// ─── Default Data ───────────────────────────────────────────────────────────

export const DEFAULT_DATA = {
  skills: [
    {
      id: 's1', category: 'Frontend', icon: '🎨',
      items: [
        { name: 'React.js', level: 90 },
        { name: 'HTML / CSS', level: 95 },
        { name: 'React Native', level: 82 },
        { name: 'Three.js', level: 70 },
      ]
    },
    {
      id: 's2', category: 'Backend', icon: '⚙️',
      items: [
        { name: 'Node.js / Express', level: 85 },
        { name: 'Java', level: 80 },
        { name: 'Python', level: 72 },
        { name: 'PHP', level: 68 },
      ]
    },
    {
      id: 's3', category: 'Database', icon: '🗄️',
      items: [
        { name: 'MongoDB', level: 85 },
        { name: 'MySQL', level: 80 },
        { name: 'Firebase', level: 75 },
      ]
    },
    {
      id: 's4', category: 'Tools & Design', icon: '🛠️',
      items: [
        { name: 'Figma', level: 85 },
        { name: 'WordPress', level: 90 },
        { name: 'Git / GitHub', level: 82 },
        { name: 'Cisco Packet Tracer', level: 70 },
      ]
    },
  ],

  projects: [
    {
      id: 'p1',
      title: 'Restaurant Reservation System',
      description: 'Full-stack restaurant management platform with real-time table booking, order management, and customer notifications. Built as both a web app and mobile app.',
      tech: ['React.js', 'React Native', 'MongoDB', 'Firebase', 'Node.js', 'Express'],
      type: 'Web + Mobile App',
      icon: '🍽️',
      color: '#ff6b6b',
      features: ['Real-time reservations', 'Push notifications', 'Menu management', 'Admin dashboard'],
      featured: true,
      github: '',
      live: '',
    },
    {
      id: 'p2',
      title: 'Inventory Management System',
      description: 'Java-based desktop application for comprehensive inventory tracking with MySQL database. Handles stock management, supplier tracking, and report generation.',
      tech: ['Java', 'Java Swing', 'MySQL', 'JDBC'],
      type: 'Desktop Application',
      icon: '📦',
      color: '#ffd166',
      features: ['Stock tracking', 'Supplier management', 'Auto-reorder alerts', 'PDF reports'],
      featured: true,
      github: '',
      live: '',
    },
    {
      id: 'p3',
      title: '3D Home Design Architecture',
      description: 'Interactive 3D architectural visualization tool built with Three.js, allowing users to design and explore home layouts in real-time 3D environment.',
      tech: ['Three.js', 'JavaScript', 'MySQL', 'CSS3'],
      type: 'Web 3D Application',
      icon: '🏗️',
      color: '#06d6a0',
      features: ['3D rendering', 'Interactive design', 'Room planner', 'Material preview'],
      featured: true,
      github: '',
      live: '',
    },
    {
      id: 'p4',
      title: 'Inventory System (Web)',
      description: 'Web-based inventory management system built with PHP and MySQL featuring a clean dashboard, product CRUD, and reporting functionality.',
      tech: ['HTML', 'CSS', 'PHP', 'MySQL'],
      type: 'Web Application',
      icon: '🗂️',
      color: '#4cc9f0',
      features: ['CRUD operations', 'Search & filter', 'Reports', 'User auth'],
      featured: false,
      github: '',
      live: '',
    },
    {
      id: 'p5',
      title: 'University Network Topology',
      description: 'Designed a complete university campus network topology using Cisco Packet Tracer with VLANs, subnetting, routing protocols, and network security policies.',
      tech: ['Cisco Packet Tracer', 'VLAN', 'OSPF', 'TCP/IP'],
      type: 'Computer Networking',
      icon: '🌐',
      color: '#7928ca',
      features: ['Campus topology', 'VLAN setup', 'Routing protocols', 'Security policies'],
      featured: false,
      github: '',
      live: '',
    },
    {
      id: 'p6',
      title: 'Project Figma Prototypes',
      description: 'High-fidelity UI/UX prototypes for all major projects including interactive wireframes, design systems, component libraries, and user flow diagrams.',
      tech: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems'],
      type: 'UI/UX Design',
      icon: '🎨',
      color: '#ff0080',
      features: ['Interactive prototypes', 'Design system', 'User flows', 'Component library'],
      featured: false,
      github: '',
      live: '',
    },
    {
      id: 'p7',
      title: 'Project Documentation Suite',
      description: 'Comprehensive technical documentation for all projects including SRS documents, architecture diagrams, API docs, and user manuals following industry standards.',
      tech: ['Technical Writing', 'SRS', 'UML', 'MS Word'],
      type: 'Documentation',
      icon: '📄',
      color: '#00b4d8',
      features: ['SRS documents', 'UML diagrams', 'API documentation', 'User manuals'],
      featured: false,
      github: '',
      live: '',
    },
  ],

  experiences: [
    {
      id: 'e1',
      role: 'Web Development & Designing',
      company: 'Creative Solution',
      period: '2024 — Present',
      type: 'Full-time',
      color: '#00d4ff',
      points: [
        'Designed and developed responsive websites using WordPress and CSS for various clients',
        'Built the logic for a streamlined ad-serving platform with scalable architecture',
        'Managed database administration and website backend operations',
        'Created wireframes and prototypes using Figma for client presentations',
        'Contributed to building an ad-serving platform with scalable, maintainable logic',
      ],
    },
    {
      id: 'e2',
      role: 'Programming & Tech',
      company: 'Freelance / Personal Projects',
      period: '2023 — 2026',
      type: 'Self-employed',
      color: '#7928ca',
      points: [
        'Developed full-stack web applications using MongoDB, Express.js, React & Node.js with REST APIs',
        'Built desktop applications with Java Swing and Python Tkinter',
        'Created responsive interfaces using React, HTML, and modern CSS techniques',
        'Built cross-platform mobile apps using React Native with integrated backend APIs',
        'Designed 3D interactive applications using Three.js and MySQL database integration',
      ],
    },
    {
      id: 'e3',
      role: 'Type Writing & Data Entry',
      company: 'Creative Solution',
      period: '2023 — 2025',
      type: 'Contract',
      color: '#ff0080',
      points: [
        'Typed and formatted exam sheets and result reports with high accuracy',
        'Analyzed student performance data and generated comprehensive statistical reports',
        'Designed PowerPoint slides for academic lectures and presentations',
      ],
    },
  ],

  education: [
    {
      id: 'ed1',
      degree: 'Bachelor of Science in Software Engineering',
      school: 'Gift University, Gujranwala',
      period: '2024 — Present',
      icon: '🎓',
      color: '#00d4ff',
    },
    {
      id: 'ed2',
      degree: 'Secondary School (Matriculation)',
      school: 'City Cardinal High School',
      period: '2008 — 2021',
      icon: '🏫',
      color: '#7928ca',
    },
  ],
}

// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  skills: 'ar_portfolio_skills',
  projects: 'ar_portfolio_projects',
  experiences: 'ar_portfolio_experiences',
  education: 'ar_portfolio_education',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Public API ───────────────────────────────────────────────────────────────

// SKILLS
export const getSkills = () => load(KEYS.skills, DEFAULT_DATA.skills)
export const saveSkills = (data) => save(KEYS.skills, data)

export const addSkillGroup = (group) => {
  const all = getSkills()
  const next = [...all, { ...group, id: uid() }]
  saveSkills(next); return next
}
export const updateSkillGroup = (id, group) => {
  const next = getSkills().map(g => g.id === id ? { ...g, ...group } : g)
  saveSkills(next); return next
}
export const deleteSkillGroup = (id) => {
  const next = getSkills().filter(g => g.id !== id)
  saveSkills(next); return next
}

// PROJECTS
export const getProjects = () => load(KEYS.projects, DEFAULT_DATA.projects)
export const saveProjects = (data) => save(KEYS.projects, data)

export const addProject = (proj) => {
  const all = getProjects()
  const next = [...all, { ...proj, id: uid() }]
  saveProjects(next); return next
}
export const updateProject = (id, proj) => {
  const next = getProjects().map(p => p.id === id ? { ...p, ...proj } : p)
  saveProjects(next); return next
}
export const deleteProject = (id) => {
  const next = getProjects().filter(p => p.id !== id)
  saveProjects(next); return next
}

// EXPERIENCES
export const getExperiences = () => load(KEYS.experiences, DEFAULT_DATA.experiences)
export const saveExperiences = (data) => save(KEYS.experiences, data)

export const addExperience = (exp) => {
  const all = getExperiences()
  const next = [...all, { ...exp, id: uid() }]
  saveExperiences(next); return next
}
export const updateExperience = (id, exp) => {
  const next = getExperiences().map(e => e.id === id ? { ...e, ...exp } : e)
  saveExperiences(next); return next
}
export const deleteExperience = (id) => {
  const next = getExperiences().filter(e => e.id !== id)
  saveExperiences(next); return next
}

// EDUCATION
export const getEducation = () => load(KEYS.education, DEFAULT_DATA.education)
export const saveEducation = (data) => save(KEYS.education, data)

export const addEducation = (edu) => {
  const all = getEducation()
  const next = [...all, { ...edu, id: uid() }]
  saveEducation(next); return next
}
export const updateEducation = (id, edu) => {
  const next = getEducation().map(e => e.id === id ? { ...e, ...edu } : e)
  saveEducation(next); return next
}
export const deleteEducation = (id) => {
  const next = getEducation().filter(e => e.id !== id)
  saveEducation(next); return next
}

// RESET ALL
export const resetAll = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
