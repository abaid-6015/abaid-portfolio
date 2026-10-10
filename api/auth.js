import {wrap,method,getSite,json,body,writeGuard,verifySession,login,changePassword,logout,fail} from './_lib/core.js'
export default wrap(async(req,res)=>{
 if(req.method==='GET'){const site=getSite(req.query.site);await verifySession(req,site);json(res,200,{authenticated:true});return}
 method(req,['POST']);writeGuard(req);const b=body(req,12000),site=getSite(b.site)
 if(b.action==='login')return login(req,res,site,b.username,b.password)
 if(b.action==='logout'){logout(res);json(res,200,{ok:true});return}
 await verifySession(req,site)
 if(b.action==='change-password')return changePassword(req,res,site,b.currentPassword,b.nextPassword)
 fail(400,'Unknown action')
})
