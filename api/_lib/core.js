import { MongoClient } from 'mongodb'
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac } from 'node:crypto'
import { promisify } from 'node:util'
import defaults from './defaults.json' with { type: 'json' }

const scrypt = promisify(scryptCb)
const SITE = 'abaid'
const SECTIONS = ['hero','socials','about','contact','skills','projects','experiences','education']
const COOKIE = 'portfolio_session'
let cachedClient
function fail(status, message){const err = new Error(message);err.status=status;throw err}
function getSite(value){if (value !== SITE) fail(404,'Unknown portfolio');return value}
function getSecret(){const s=process.env.SESSION_SECRET;if(!s||s.length<32)fail(503,'SESSION_SECRET is not configured');return s}
async function coll(site){if(!process.env.MONGODB_URI)fail(503,'MONGODB_URI is not configured');if(!cachedClient)cachedClient=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,serverSelectionTimeoutMS:7000}).connect().catch(e=>{cachedClient=null;throw e});const client=await cachedClient;return client.db('portfolio').collection(getSite(site))}
function checkOrigin(req){const origin=req.headers.origin;const host=req.headers.host;const forwarded=req.headers['x-forwarded-host'];if(!origin||!host)fail(403,'Origin header required');let url;try{url=new URL(origin)}catch{fail(403,'Invalid origin')}if(url.host!==host&&url.host!==forwarded)fail(403,'Cross-origin writes are not allowed')}
function setHeaders(res, cache='no-store'){res.setHeader('Cache-Control',cache);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Vary','Cookie')}
function json(res,status,data){setHeaders(res);res.status(status).json(data)}
export function reject(res,error){if(error?.message)console.error('Portfolio API error:',error.status||500, error.status?error.message:'Internal server error');if(!res.headersSent)json(res,error.status||500,{error:error.status?error.message:'Server error. Check deployment configuration and logs.'})}
export function wrap(fn){return async(req,res)=>{try{await fn(req,res)}catch(e){reject(res,e)}}}
export function method(req,methods){if(!methods.includes(req.method))fail(405,'Method not allowed')}
export function writeGuard(req){checkOrigin(req);const type=req.headers['content-type']||'';if(!type.includes('application/json'))fail(415,'JSON request body required')}
export function body(req,limit=900000){const text=JSON.stringify(req.body||{});if(text.length>limit)fail(413,'Request too large');return req.body||{}}
export { getSite, coll, json, fail, defaults, SECTIONS }

function token(data){const raw=Buffer.from(JSON.stringify(data)).toString('base64url');const signature=createHmac('sha256',getSecret()).update(raw).digest('base64url');return raw+'.'+signature}
function verify(raw){if(typeof raw!=='string'||raw.length>2500)return null;const parts=raw.split('.');if(parts.length!==2)return null;const expected=createHmac('sha256',getSecret()).update(parts[0]).digest();let given;try{given=Buffer.from(parts[1],'base64url')}catch{return null}if(given.length!==expected.length||!timingSafeEqual(given,expected))return null;try{return JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'))}catch{return null}}
function getCookie(req){const found=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));return found?.slice(COOKIE.length+1)}
function writeCookie(res,value,maxAge){const secure=(process.env.VERCEL||process.env.NODE_ENV==='production')?'; Secure':'';res.setHeader('Set-Cookie',`${COOKIE}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${secure}`)}
export function logout(res){writeCookie(res,'',0)}
async function hash(password,salt){return (await scrypt(password,salt,64)).toString('hex')}
function bootstrapPassword(site){return site==='abaid'?process.env.ADMIN_BOOTSTRAP_ABAID_PASSWORD:process.env.ADMIN_BOOTSTRAP_MUTAAL_PASSWORD}
function username(site){return site==='abaid'?'abaidulrehman':'mutaalusman76'}
export async function verifySession(req,site){const v=verify(getCookie(req));if(!v||v.site!==site||v.exp<Date.now())fail(401,'Please sign in');const collection=await coll(site);const user=await collection.findOne({_id:'admin'});if(!user||user.sessionVersion!==v.version)fail(401,'Session expired');return user}
export async function login(req,res,site,usernameInput,password){const col=await coll(site);let admin=await col.findOne({_id:'admin'});
 if(!admin){const initial=bootstrapPassword(site);if(!initial||initial.length<12)fail(503,'Admin bootstrap password is not configured');const salt=randomBytes(16).toString('hex');const passwordHash=await hash(initial,salt);await col.updateOne({_id:'admin'},{$setOnInsert:{_id:'admin',username:username(site),salt,passwordHash,sessionVersion:1,failures:0,lockedUntil:null,createdAt:new Date()}},{upsert:true});admin=await col.findOne({_id:'admin'})}
 if(admin.lockedUntil&&new Date(admin.lockedUntil).getTime()>Date.now())fail(429,'Too many attempts. Try again in 15 minutes');
 const correctUser=typeof usernameInput==='string'&&usernameInput===admin.username;
 const given=typeof password==='string'&&password.length<=256?password:'';
 const givenHash=await hash(given,admin.salt);
 const expected=Buffer.from(admin.passwordHash,'hex'),actual=Buffer.from(givenHash,'hex');const correctPassword=actual.length===expected.length&&timingSafeEqual(actual,expected);
 if(!correctUser||!correctPassword){const attempts=(admin.failures||0)+1;await col.updateOne({_id:'admin'},{$set:{failures:attempts,lockedUntil:attempts>=5?new Date(Date.now()+15*60*1000):null}});fail(401,'Incorrect username or password')}
 await col.updateOne({_id:'admin'},{$set:{failures:0,lockedUntil:null}});writeCookie(res,token({site,version:admin.sessionVersion,exp:Date.now()+8*60*60*1000}),8*60*60);json(res,200,{ok:true,user:admin.username})
}
export async function changePassword(req,res,site,currentPassword,nextPassword){if(typeof nextPassword!=='string'||nextPassword.length<12||nextPassword.length>128)fail(400,'New password must be 12–128 characters');const col=await coll(site);const admin=await verifySession(req,site);const hashed=await hash(typeof currentPassword==='string'?currentPassword:'',admin.salt);const a=Buffer.from(hashed,'hex'),b=Buffer.from(admin.passwordHash||'', 'hex');if(a.length!==b.length||!timingSafeEqual(a,b))fail(403,'Current password is incorrect');const salt=randomBytes(16).toString('hex');const passwordHash=await hash(nextPassword,salt);const version=(admin.sessionVersion||1)+1;await col.updateOne({_id:'admin'},{$set:{salt,passwordHash,sessionVersion:version,failures:0,lockedUntil:null,changedAt:new Date()}});logout(res);json(res,200,{ok:true,message:'Password changed. Sign in again.'})}

export async function siteDocument(site){const c=await coll(site);let doc=await c.findOne({_id:'site'},{projection:{_id:0,createdAt:0,updatedAt:0}});if(!doc){await c.updateOne({_id:'site'},{$setOnInsert:{...structuredClone(defaults),images:{},createdAt:new Date()}},{upsert:true});doc=await c.findOne({_id:'site'},{projection:{_id:0,createdAt:0,updatedAt:0}})}return doc}
function validSectionData(section,data){if(!SECTIONS.includes(section))fail(400,'Unknown content section');if(data===undefined||data===null||typeof data!=='object'||(Array.isArray(data)!==['socials','skills','projects','experiences','education'].includes(section)))fail(400,'Invalid content shape');if(JSON.stringify(data).length>400000)fail(413,'Section too large');if(section==='projects'&&(data.length>100||data.some(p=>!p||typeof p.id!=='string'||!(/^[a-zA-Z0-9_-]{1,80}$/).test(p.id)||typeof p.title!=='string')))fail(400,'Invalid projects');return data}
export async function updateSection(site,section,data){validSectionData(section,data);const c=await coll(site);await c.updateOne({_id:'site'},{$set:{[section]:data,updatedAt:new Date()}},{upsert:false})}
export async function resetSite(site){const c=await coll(site);const updates=structuredClone(defaults);await c.updateOne({_id:'site'},{$set:{...updates,images:{},updatedAt:new Date()}},{upsert:true});await c.deleteMany({type:'photo'})}
export async function importSite(site,data){if(!data||Array.isArray(data)||typeof data!=='object')fail(400,'Invalid backup');const updates={};for(const s of SECTIONS){if(data[s]!==undefined)updates[s]=validSectionData(s,data[s])}if(!Object.keys(updates).length)fail(400,'No recognized content sections');const c=await coll(site);await c.updateOne({_id:'site'},{$set:{...updates,updatedAt:new Date()}},{upsert:true})}

export function parseImage(bodyData){if(typeof bodyData!=='string'||bodyData.length>2500000)fail(413,'Image too large');const m=/^data:image\/(jpeg|png|webp|gif);base64,([a-zA-Z0-9+/=]+)$/.exec(bodyData);if(!m)fail(415,'Use a JPG, PNG, WebP, or GIF image');const bytes=Buffer.from(m[2],'base64');if(bytes.length<40||bytes.length>1700000)fail(413,'Image must be below 1.7 MB');const kind=m[1];const magic={jpeg:bytes[0]===255&&bytes[1]===216&&bytes[2]===255,png:bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),webp:bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP',gif:bytes.toString('ascii',0,3)==='GIF'};if(!magic[kind])fail(415,'Image format does not match uploaded file');return {bytes,contentType:kind==='jpeg'?'image/jpeg':`image/${kind}`}}
export async function upload(site,projectId,image){if(!/^[a-zA-Z0-9_-]{1,80}$/.test(projectId||''))fail(400,'Invalid project');const col=await coll(site);const doc=await siteDocument(site);if(!doc.projects.some(p=>p.id===projectId))fail(404,'Project does not exist');const photos=doc.images?.[projectId]||[];if(photos.length>=10)fail(400,'Maximum 10 photos per project');const parsed=parseImage(image);const id=randomBytes(16).toString('hex');await col.insertOne({_id:`photo:${id}`,type:'photo',projectId,contentType:parsed.contentType,bytes:parsed.bytes,createdAt:new Date()});const meta={id,src:`/api/photo?site=${site}&id=${id}`};try{await col.updateOne({_id:'site'},{$push:{[`images.${projectId}`]:meta}})}catch(e){await col.deleteOne({_id:`photo:${id}`});throw e}return meta}
export async function deletePhoto(site,projectId,id){if(!/^[a-zA-Z0-9_-]{1,80}$/.test(projectId||'')||!/^[a-f0-9]{32}$/.test(id||''))fail(400,'Invalid photo');const col=await coll(site);const photo=await col.findOne({_id:`photo:${id}`,type:'photo',projectId});if(!photo)fail(404,'Photo not found');await col.updateOne({_id:'site'},{$pull:{[`images.${projectId}`]:{id}}});await col.deleteOne({_id:`photo:${id}`})}
export async function displayPhoto(req,res,site,id){if(!/^[a-f0-9]{32}$/.test(id||''))fail(404,'Image not found');const col=await coll(site);const doc=await col.findOne({_id:`photo:${id}`,type:'photo'});if(!doc)fail(404,'Image not found');setHeaders(res,'public, max-age=3600, immutable');res.setHeader('Content-Type',doc.contentType);res.status(200).end(Buffer.isBuffer(doc.bytes)?doc.bytes:doc.bytes?.value?Buffer.from(doc.bytes.value(true)):Buffer.from(doc.bytes))}
