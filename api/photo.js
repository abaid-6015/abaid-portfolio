import {wrap,method,getSite,json,body,writeGuard,verifySession,upload,deletePhoto,displayPhoto} from './_lib/core.js'
export default wrap(async(req,res)=>{
 if(req.method==='GET'){const site=getSite(req.query.site);return displayPhoto(req,res,site,req.query.id)}
 method(req,['POST','DELETE']);writeGuard(req);const b=body(req,2700000),site=getSite(b.site);await verifySession(req,site)
 if(req.method==='POST'){const photo=await upload(site,b.projectId,b.dataUrl);json(res,201,{photo});return}
 await deletePhoto(site,b.projectId,b.id);json(res,200,{ok:true})
})
