import React,{useEffect,useRef} from 'react'
// Modern diamond pointer and softly trailing cyan aura, with native-pointer fallbacks.
export default function CustomCursor(){
  const core=useRef(null),aura=useRef(null)
  const target=useRef({x:-200,y:-200}),smooth=useRef({x:-200,y:-200})
  useEffect(()=>{
    if(!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches)return
    let raf=0
    const move=e=>{target.current={x:e.clientX,y:e.clientY}}
    const over=e=>{const interactive=e.target instanceof Element&&!!e.target.closest('button,a,input,textarea,select,[role="button"]');aura.current?.classList.toggle('cursor-interactive',interactive);core.current?.classList.toggle('cursor-core-interactive',interactive)}
    const loop=()=>{
      smooth.current.x+=(target.current.x-smooth.current.x)*.18
      smooth.current.y+=(target.current.y-smooth.current.y)*.18
      if(core.current)core.current.style.transform=`translate3d(${target.current.x}px,${target.current.y}px,0)`
      if(aura.current)aura.current.style.transform=`translate3d(${smooth.current.x}px,${smooth.current.y}px,0)`
      raf=requestAnimationFrame(loop)
    }
    document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerover',over,{passive:true});raf=requestAnimationFrame(loop)
    return()=>{cancelAnimationFrame(raf);document.removeEventListener('pointermove',move);document.removeEventListener('pointerover',over)}
  },[])
  return <>
    <div ref={aura} className="pointer-aura" aria-hidden="true"/>
    <div ref={core} className="pointer-core" aria-hidden="true"/>
    <style>{`
      .pointer-core,.pointer-aura{position:fixed;top:0;left:0;pointer-events:none;z-index:99999;will-change:transform}
      .pointer-core::before{content:'';display:block;width:11px;height:11px;transform:translate(-50%,-50%) rotate(45deg);background:#00e5ff;border:2px solid #edf2ff;border-radius:2px;box-shadow:0 0 14px rgba(0,229,255,.72);transition:width .18s,height .18s,background .18s}
      .pointer-aura::before{content:'';display:block;width:37px;height:37px;transform:translate(-50%,-50%);border:1px solid rgba(0,229,255,.7);border-radius:50%;box-shadow:0 0 20px rgba(0,229,255,.16),inset 0 0 14px rgba(0,229,255,.08);transition:width .2s,height .2s,border-color .2s}
      .pointer-aura.cursor-interactive::before{width:57px;height:57px;border-color:rgba(255,255,255,.85)}
      .pointer-core.cursor-core-interactive::before{width:7px;height:7px;background:#fff}
      @media(hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.pointer-core,.pointer-aura{display:none!important}body,button,a,input,textarea,select,.btn{cursor:auto!important}a,button,[role="button"]{cursor:pointer!important}}
    `}</style>
  </>
}
