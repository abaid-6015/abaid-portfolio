const uid=()=>Math.random().toString(36).slice(2,9)
const EV='portfolio:updated'
export const emit=()=>window.dispatchEvent(new CustomEvent(EV))
export const onUpdate=(fn)=>{window.addEventListener(EV,fn);return()=>window.removeEventListener(EV,fn)}

export const DEFAULTS={
  hero:{name:'Abaid-ul-Rehman',tagline:'Full-Stack Web Developer',roles:['Full-Stack Web Developer','MERN Stack Engineer','React Native Developer','Game Developer — Unity','UI/UX Designer — Figma','WordPress Developer'],bio:'Building immersive, scalable digital products — from MERN web apps and React Native mobile apps to 3D games and WordPress solutions. Based in Pakistan, working globally.',available:true,location:'Gujranwala, Pakistan',stats:[{label:'Projects Built',value:'8+'},{label:'Years Coding',value:'3+'},{label:'Technologies',value:'12+'},{label:'Platforms',value:'4'}]},
  socials:[{id:'s1',platform:'LinkedIn',url:'https://www.linkedin.com/in/abaid-ul-rehman-6a8bb023a/',icon:'linkedin',show:true},{id:'s2',platform:'GitHub',url:'https://github.com/abaid-6015',icon:'github',show:true},{id:'s3',platform:'Upwork',url:'https://www.upwork.com/freelancers/~01c8140c420a8e9157?mp_source=share',icon:'upwork',show:true},{id:'s4',platform:'Fiverr',url:'https://www.fiverr.com/abaid_bse',icon:'fiverr',show:true},{id:'s5',platform:'Email',url:'mailto:abaidbse@gmail.com',icon:'mail',show:true}],
  about:{heading:'Passionate developer & creative problem-solver',bio1:"I'm Abaid-ul-Rehman — a Software Engineering student at Gift University, Gujranwala with hands-on experience in full-stack development, mobile apps, game development, and UI/UX design.",bio2:'From MERN stack web applications and React Native mobile apps to a Unity 3D game and WordPress client sites — I love building things that are both functional and visually compelling.',bio3:"I freelance on Upwork & Fiverr, delivering quality work to clients worldwide, and I'm actively seeking full-time opportunities.",info:[{label:'Degree',value:'B.Sc. Software Engineering'},{label:'University',value:'Gift University, Gujranwala'},{label:'Location',value:'Gujranwala, Pakistan'},{label:'Email',value:'abaidbse@gmail.com'},{label:'Phone',value:'+92 328 1632432'},{label:'Status',value:'🟢 Open to work'}]},
  contact:{heading:"Let's build something together",subtext:'Open for freelance projects, full-time roles, or just a conversation.',email:'abaidbse@gmail.com',phone:'+92 328 1632432',location:'Gujranwala, Pakistan',scriptUrl:'https://script.google.com/macros/s/AKfycbwQsRByGDhInC3WzAWtxK268RtW9_pz5bJ4jFw5WEyozU77FTijYZo5gIa2GZh6QsN3/exec'},
  skills:[{id:'sk1',category:'Frontend',color:'#5B4FFF',items:[{name:'React.js',pct:90},{name:'JavaScript',pct:88},{name:'HTML5',pct:95},{name:'CSS3',pct:92}]},{id:'sk2',category:'Backend',color:'#00E5FF',items:[{name:'Node.js',pct:85},{name:'Express.js',pct:83},{name:'Java',pct:80},{name:'Python',pct:72},{name:'PHP',pct:68}]},{id:'sk3',category:'Database',color:'#30D158',items:[{name:'MongoDB',pct:86},{name:'MySQL',pct:82},{name:'Firebase',pct:76}]},{id:'sk4',category:'Mobile & Game',color:'#FF9F0A',items:[{name:'React Native',pct:82},{name:'Unity 3D',pct:65},{name:'Mobile Dev',pct:70}]},{id:'sk5',category:'Tools & Design',color:'#FF375F',items:[{name:'WordPress',pct:90},{name:'Figma',pct:85},{name:'Git',pct:82}]}],
  projects:[
    {id:'p1',title:'Restaurant Reservation System',desc:'Full-stack restaurant management platform with real-time table booking, order tracking, and push notifications — built as web (React.js) and mobile (React Native) sharing a MongoDB backend.',tech:['React.js','React Native','MongoDB','Firebase','Node.js'],type:'Web + Mobile',color:'#C2727A',featured:true,github:'https://github.com/abaid-6015',live:'https://restaurant-reservation-system-react-seven.vercel.app/home',tag:'Featured · Live'},
    {id:'p2',title:'Inventory Management — Java',desc:'Desktop application with MySQL for inventory control, stock tracking, supplier management, and PDF report generation using Java Swing.',tech:['Java','MySQL'],type:'Desktop App',color:'#A78BFA',featured:false,github:'https://github.com/abaid-6015',live:'',tag:'Desktop App'},
    {id:'p3',title:'3D Home Design Architecture',desc:'Interactive 3D architectural visualization tool using Three.js — users design and explore home layouts in real-time with a MySQL backend.',tech:['Three.js','JavaScript','MySQL'],type:'WebGL · 3D',color:'#7FB5A0',featured:true,github:'https://github.com/abaid-6015',live:'',tag:'WebGL · 3D'},
    {id:'p4',title:'Sight & Might — Unity 3D Game',desc:'Third-person action game featuring Player and Alien characters on terrain with AI-controlled animals. Complete game loop with physics and custom 3D environment.',tech:['Unity','C#'],type:'Game Dev',color:'#FF375F',featured:true,github:'https://github.com/abaid-6015',live:'',tag:'Game Dev'},
    {id:'p5',title:'Inventory System — Web',desc:'PHP and MySQL web-based inventory management with dashboard, full CRUD operations, user authentication, and search/filter functionality.',tech:['PHP','MySQL','HTML5'],type:'Web App',color:'#30D158',featured:false,github:'https://github.com/abaid-6015',live:'',tag:'Web App'},
    {id:'p6',title:'University Network Topology',desc:'Complete campus network design in Cisco Packet Tracer — VLANs, subnetting, OSPF routing protocols, and security policy implementation.',tech:['Cisco Packet Tracer','VLAN','OSPF'],type:'Networking',color:'#8b5cf6',featured:false,github:'',live:'',tag:'Networking'},
    {id:'p7',title:'Figma UI/UX Prototypes',desc:'High-fidelity interactive prototypes and design systems for all major projects — user flows, component libraries, and wireframes.',tech:['Figma'],type:'Design',color:'#D4A85A',featured:false,github:'',live:'',tag:'Design'},
    {id:'p8',title:'WordPress Client Sites',desc:'Responsive business websites built with WordPress, custom CSS, and plugin integrations including an ad-serving platform at Creative Solution.',tech:['WordPress','PHP','CSS3'],type:'WordPress',color:'#21759b',featured:false,github:'',live:'',tag:'WordPress · Client'}
  ],
  experiences:[{id:'e1',role:'Web Development & Designing',company:'Creative Solution',period:'2024 — Present',type:'Full-time',color:'#5B4FFF',points:['Designed responsive sites with WordPress & custom CSS','Built scalable ad-serving platform backend','Managed DB administration and backend ops','Created Figma wireframes for client presentations']},{id:'e2',role:'Programming & Tech Projects',company:'Freelance',period:'2023 — 2026',type:'Self-employed',color:'#00E5FF',points:['Built full-stack MERN web applications with REST APIs','Developed 3D home design tool with Three.js & MySQL','Created Unity 3D game (Sight & Might) with C#','Built React Native mobile apps with Firebase']},{id:'e3',role:'Type Writing & Data Entry',company:'Creative Solution',period:'2023 — 2025',type:'Contract',color:'#FF9F0A',points:['Formatted exam sheets and result reports','Generated statistical performance reports','Designed PowerPoint slides for academic lectures']}],
  education:[{id:'ed1',degree:'B.Sc. Software Engineering',school:'Gift University, Gujranwala',period:'2024 — Present',detail:'',color:'#5B4FFF'},{id:'ed2',degree:'Matriculation (Secondary)',school:'City Cardinal High School',period:'2008 — 2021',detail:'',color:'#00E5FF'}]
}

// Public content is cached in memory; MongoDB is the sole source of truth.
// No password, JWT, or MongoDB connection string is exposed to the browser.
export const SITE_SLUG='abaid'
const sections=['hero','socials','about','contact','skills','projects','experiences','education']
let content=structuredClone(DEFAULTS)
let pictures={}
let pending={}
let inflight={}
let versions={}
let remoteState='idle'
export function getSyncStatus(){return remoteState}
function setStatus(status,message=''){remoteState=status;window.dispatchEvent(new CustomEvent('portfolio:sync',{detail:{status,message}}))}
async function request(url,options={}){
  const response=await fetch(url,{credentials:'same-origin',cache:'no-store',...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}})
  let parsed;try{parsed=await response.json()}catch{parsed={}}
  if(!response.ok)throw new Error(parsed.error||`Request failed (${response.status})`)
  return parsed
}
export async function bootstrap(){
  const result=await request(`/api/content?site=${SITE_SLUG}`)
  sections.forEach(section=>{if(result.data[section]!==undefined)content[section]=result.data[section]})
  pictures=result.data.images||{}
  emit()
}
const read=section=>content[section]
const persist=(section,value)=>{
  content[section]=value;emit();versions[section]=(versions[section]||0)+1
  const revision=versions[section]
  clearTimeout(pending[section]);setStatus('saving')
  pending[section]=setTimeout(()=>{
    const task=()=>request('/api/content',{method:'PUT',body:JSON.stringify({site:SITE_SLUG,section,data:content[section]})})
    inflight[section]=(inflight[section]||Promise.resolve()).catch(()=>{}).then(task).then(()=>{
      if(versions[section]===revision)setStatus('saved')
    }).catch(error=>{setStatus('error',error.message);console.error('Portfolio save failed:',error)})
  },550)
}
export function onSync(fn){window.addEventListener('portfolio:sync',fn);return()=>window.removeEventListener('portfolio:sync',fn)}
export const getHero=()=>read('hero')
export const saveHero=d=>persist('hero',d)
export const getSocials=()=>read('socials')
export const saveSocials=d=>persist('socials',d)
export const getAbout=()=>read('about')
export const saveAbout=d=>persist('about',d)
export const getContact=()=>read('contact')
export const saveContact=d=>persist('contact',d)
export const getSkills=()=>read('skills')
export const saveSkills=d=>persist('skills',d)
export const addSkill=d=>{const a=[...getSkills(),{...d,id:uid()}];saveSkills(a);return a}
export const updateSkill=(id,d)=>{const a=getSkills().map(x=>x.id===id?{...x,...d}:x);saveSkills(a);return a}
export const deleteSkill=id=>{const a=getSkills().filter(x=>x.id!==id);saveSkills(a);return a}
export const getProjects=()=>read('projects')
export const saveProjects=d=>persist('projects',d)
export const addProject=d=>{const a=[...getProjects(),{...d,id:uid()}];saveProjects(a);return a}
export const updateProject=(id,d)=>{const a=getProjects().map(x=>x.id===id?{...x,...d}:x);saveProjects(a);return a}
export const deleteProject=id=>{const a=getProjects().filter(x=>x.id!==id);saveProjects(a);return a}
export const getExperiences=()=>read('experiences')
export const saveExperiences=d=>persist('experiences',d)
export const addExperience=d=>{const a=[...getExperiences(),{...d,id:uid()}];saveExperiences(a);return a}
export const updateExperience=(id,d)=>{const a=getExperiences().map(x=>x.id===id?{...x,...d}:x);saveExperiences(a);return a}
export const deleteExperience=id=>{const a=getExperiences().filter(x=>x.id!==id);saveExperiences(a);return a}
export const getEducation=()=>read('education')
export const saveEducation=d=>persist('education',d)
export const addEducation=d=>{const a=[...getEducation(),{...d,id:uid()}];saveEducation(a);return a}
export const updateEducation=(id,d)=>{const a=getEducation().map(x=>x.id===id?{...x,...d}:x);saveEducation(a);return a}
export const deleteEducation=id=>{const a=getEducation().filter(x=>x.id!==id);saveEducation(a);return a}
export async function resetAll(){await request('/api/content',{method:'POST',body:JSON.stringify({site:SITE_SLUG,action:'reset'})});await bootstrap()}
export function exportData(){const data={};sections.forEach(k=>data[k]=content[k]);return JSON.stringify(data,null,2)}
export async function importData(text){const data=JSON.parse(text);await request('/api/content',{method:'POST',body:JSON.stringify({site:SITE_SLUG,action:'import',data})});await bootstrap();return true}
export const getProjectImages=id=>(pictures[id]||[]).map(i=>({index:i.id,src:i.src}))
export async function saveProjectImage(projectId,idx,b64){
  const response=await request('/api/photo',{method:'POST',body:JSON.stringify({site:SITE_SLUG,projectId,dataUrl:b64})})
  pictures={...pictures,[projectId]:[...(pictures[projectId]||[]),response.photo]}
  emit();return response.photo
}
export async function deleteProjectImage(projectId,id){
  await request('/api/photo',{method:'DELETE',body:JSON.stringify({site:SITE_SLUG,projectId,id})})
  pictures={...pictures,[projectId]:(pictures[projectId]||[]).filter(photo=>photo.id!==id)}
  emit()
}
export async function authRequest(action,extra={}){return request('/api/auth',{method:'POST',body:JSON.stringify({site:SITE_SLUG,action,...extra})})}
export async function isAuthenticated(){try{await request(`/api/auth?site=${SITE_SLUG}`);return true}catch{return false}}
