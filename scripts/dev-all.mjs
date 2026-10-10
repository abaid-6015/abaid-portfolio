import {spawn} from 'node:child_process'
const processes=[]
for(const args of [['--env-file-if-exists=.env.local','scripts/dev-api.mjs'],['node_modules/vite/bin/vite.js']]){
 const child=spawn(process.execPath,args,{stdio:'inherit',env:process.env});processes.push(child)
 child.on('exit',(code)=>{if(code&&code!==0){console.error('Development service stopped:',code);process.exitCode=code}})
}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{for(const child of processes)child.kill();process.exit()})
