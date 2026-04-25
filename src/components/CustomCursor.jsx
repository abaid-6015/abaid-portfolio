import React, { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }

    const onEnter = () => {
      dotRef.current?.classList.add('hover')
      ringRef.current?.classList.add('hover')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('hover')
      ringRef.current?.classList.remove('hover')
    }

    document.addEventListener('mousemove', onMove)

    const interactables = document.querySelectorAll('a, button, .card, input, textarea')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    let rafId
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top = ringPos.current.y + 'px'
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
