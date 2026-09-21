import React, { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x: 0, y: 0 })
  const lag  = useRef({ x: 0, y: 0 })
  const raf  = useRef(null)

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY } }

    const tick = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.1
      lag.current.y += (pos.current.y - lag.current.y) * 0.1
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px)`
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px)`
      raf.current = requestAnimationFrame(tick)
    }

    const enter = () => { ring.current?.classList.add('big'); dot.current?.classList.add('hide') }
    const leave = () => { ring.current?.classList.remove('big'); dot.current?.classList.remove('hide') }

    window.addEventListener('mousemove', move)
    raf.current = requestAnimationFrame(tick)

    const attach = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
      })
    }
    attach()
    const obs = new MutationObserver(attach)
    obs.observe(document.body, { childList:true, subtree:true })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div className="cur-dot"  ref={dot}  />
      <div className="cur-ring" ref={ring} />
    </>
  )
}
