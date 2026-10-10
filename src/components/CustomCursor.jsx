import React,{useEffect,useRef} from 'react'

// Delegate pointer events instead of attaching listeners to every new DOM node.
// Always cancel the animation frame and remove listeners on unmount (StrictMode safe).
export default function CustomCursor(){
  const dot=useRef(null),ring=useRef(null)
  const pos=useRef({x:-100,y:-100}),lag=useRef({x:-100,y:-100})
  useEffect(()=>{
    if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return
    let frame
    const move=e=>{pos.current={x:e.clientX,y:e.clientY}}
    const over=e=>{
      if(e.target instanceof Element&&e.target.closest('a,button,input,textarea,select,[data-hover]')){
        ring.current?.classList.add('big')
        dot.current?.classList.add('hide')
      }
    }
    const out=e=>{
      const from=e.target instanceof Element?e.target.closest('a,button,input,textarea,select,[data-hover]'):null
      const to=e.relatedTarget instanceof Element?e.relatedTarget.closest('a,button,input,textarea,select,[data-hover]'):null
      if(from&&!to){ring.current?.classList.remove('big');dot.current?.classList.remove('hide')}
    }
    const tick=()=>{
      lag.current.x+=(pos.current.x-lag.current.x)*.1
      lag.current.y+=(pos.current.y-lag.current.y)*.1
      if(dot.current)dot.current.style.transform=`translate(${pos.current.x}px,${pos.current.y}px)`
      if(ring.current)ring.current.style.transform=`translate(${lag.current.x}px,${lag.current.y}px)`
      frame=requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove',move)
    document.addEventListener('pointerover',over)
    document.addEventListener('pointerout',out)
    frame=requestAnimationFrame(tick)
    return()=>{
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove',move)
      document.removeEventListener('pointerover',over)
      document.removeEventListener('pointerout',out)
    }
  },[])
  return(<>
    <div ref={dot} className="cur-dot" style={{position:'fixed',top:'-5px',left:'-5px',width:'10px',height:'10px',background:'var(--accent)',borderRadius:'50%',pointerEvents:'none',zIndex:99999,willChange:'transform',boxShadow:'0 0 8px var(--accent)',transition:'opacity .2s'}}/>
    <div ref={ring} className="cur-ring" style={{position:'fixed',top:'-22px',left:'-22px',width:'44px',height:'44px',border:'1.5px solid var(--accent)',borderRadius:'50%',pointerEvents:'none',zIndex:99998,willChange:'transform',transition:'width .25s,height .25s,top .25s,left .25s,background .25s'}}/>
    <style>{`.cur-dot.hide{opacity:0!important}.cur-ring.big{width:70px!important;height:70px!important;top:-35px!important;left:-35px!important;background:rgba(91,79,255,.07)!important}@media(hover:none),(pointer:coarse){.cur-dot,.cur-ring{display:none!important}body,button,a,input,textarea,select,.btn{cursor:auto!important}}`}</style>
  </>)
}
