import {createServer} from 'node:http'
import content from '../api/content.js'
import auth from '../api/auth.js'
import photo from '../api/photo.js'
const endpoints={'/api/content':content,'/api/auth':auth,'/api/photo':photo}
createServer(async(req,res)=>{
  const u=new URL(req.url,'http://localhost:3001');const handler=endpoints[u.pathname]
  if(!handler){res.writeHead(404);res.end();return}
  req.query=Object.fromEntries(u.searchParams);req.body={}
  res.status=(code)=>{res.statusCode=code;return res};res.json=(object)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(object));return res}
  try{
    if(!['GET','HEAD'].includes(req.method)){
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>3200000)throw Error('Payload too large')}
      req.body=raw?JSON.parse(raw):{}
    }
    await handler(req,res)
  }catch(e){res.statusCode=e.message==='Payload too large'?413:400;res.end(JSON.stringify({error:e.message}))}
}).listen(3001,()=>console.log('Portfolio API listening on http://localhost:3001'))
