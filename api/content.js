import {wrap,method,getSite,json,body,writeGuard,verifySession,siteDocument,updateSection,importSite,resetSite,fail} from './_lib/core.js'
export default wrap(async(req,res)=>{
 const site=getSite(req.method==='GET'?req.query.site:req.body?.site)
 if(req.method==='GET'){const data=await siteDocument(site);json(res,200,{data});return}
 method(req,['PUT','POST']);writeGuard(req);await verifySession(req,site);const b=body(req);
 if(req.method==='PUT'){await updateSection(site,b.section,b.data);json(res,200,{ok:true});return}
 if(b.action==='import'){await importSite(site,b.data);json(res,200,{ok:true});return}
 if(b.action==='reset'){await resetSite(site);json(res,200,{ok:true});return}
 fail(400,'Unknown action')
})
