import React,{useEffect,useRef} from 'react'
export default function CustomCursor(){
  const dot=useRef(null),ring=useRef(null),pos=useRef({x:0,y:0}),lag=useRef({x:0,y:0})
  useEffect(()=>{
    const move=e=>{pos.current={x:e.clientX,y:e.clientY}}
    const tick=()=>{
      lag.current.x+=(pos.current.x-lag.current.x)*0.1
      lag.current.y+=(pos.current.y-lag.current.y)*0.1
      if(dot.current)dot.current.style.transform=`translate(${pos.current.x}px,${pos.current.y}px)`
      if(ring.current)ring.current.style.transform=`translate(${lag.current.x}px,${lag.current.y}px)`
      requestAnimationFrame(tick)
    }
    const enter=()=>{ring.current?.classList.add('big');dot.current?.classList.add('hide')}
    const leave=()=>{ring.current?.classList.remove('big');dot.current?.classList.remove('hide')}
    window.addEventListener('mousemove',move);tick()
    const attach=()=>document.querySelectorAll('a,button,[data-hover]').forEach(el=>{el.addEventListener('mouseenter',enter);el.addEventListener('mouseleave',leave)})
    attach();const obs=new MutationObserver(attach);obs.observe(document.body,{childList:true,subtree:true})
    return()=>{window.removeEventListener('mousemove',move);obs.disconnect()}
  },[])
  return(<><div ref={dot} style={{position:'fixed',top:'-5px',left:'-5px',width:'10px',height:'10px',background:'var(--accent)',borderRadius:'50%',pointerEvents:'none',zIndex:99999,willChange:'transform',boxShadow:'0 0 8px var(--accent)',transition:'opacity .2s'}}/><div ref={ring} style={{position:'fixed',top:'-22px',left:'-22px',width:'44px',height:'44px',border:'1.5px solid rgba(91,79,255,0.6)',borderRadius:'50%',pointerEvents:'none',zIndex:99998,willChange:'transform',transition:'all .35s cubic-bezier(.34,1.56,.64,1)'}}/><style>{`.hide{opacity:0!important}.big{width:70px!important;height:70px!important;top:-35px!important;left:-35px!important;border-color:var(--accent)!important;background:rgba(91,79,255,0.07)!important}@media(hover:none){.cur-dot,.cur-ring{display:none}body{cursor:auto}}`}</style></>)
}
