import React, { useEffect, useState, useRef } from 'react'
import './Loader.css'

export default function Loader() {
  const [pct, setPct] = useState(0)
  const cvs = useRef(null)

  useEffect(() => {
    const iv = setInterval(() => {
      setPct(p => { if (p >= 100) { clearInterval(iv); return 100 } return Math.min(p + Math.random() * 12, 100) })
    }, 90)
    return () => clearInterval(iv)
  }, [])

  /* WebGL grid warp */
  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return
    const gl = canvas.getContext('webgl'); if (!gl) return
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight

    const VS = `attribute vec2 p; uniform float t;
    void main(){ float y=sin(p.x*4.0+t)*0.04+sin(p.y*6.0+t*1.3)*0.03;
      gl_Position=vec4(p.x,p.y+y,0,1); gl_PointSize=1.0; }`
    const FS = `precision mediump float; uniform float t;
    void main(){ float a=0.3+0.2*sin(t); gl_FragColor=vec4(0.22,0.2,1.0,a); }`

    const mk = (type, src) => { const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog); gl.useProgram(prog)

    const pts = []; const N = 60
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      pts.push((x/(N-1))*2-1, (y/(N-1))*2-1)
    }
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0)
    const tLoc = gl.getUniformLocation(prog,'t')

    let id, start = performance.now()
    const draw = () => {
      const t = (performance.now()-start)/1000
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.clearColor(0.02,0.03,0.06,1)
      gl.uniform1f(tLoc, t)
      gl.drawArrays(gl.POINTS, 0, N*N)
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="ldr">
      <canvas ref={cvs} className="ldr-canvas" />
      <div className="ldr-center">
        <div className="ldr-logo">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 6L54 48H6L30 6Z" stroke="url(#lg)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <path d="M20 36L30 18L40 36" stroke="url(#lg2)" strokeWidth="1.5" fill="none"/>
            <defs>
              <linearGradient id="lg" x1="6" y1="6" x2="54" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5B4FFF"/><stop offset="1" stopColor="#00E5FF"/>
              </linearGradient>
              <linearGradient id="lg2" x1="20" y1="18" x2="40" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7B6FFF"/><stop offset="1" stopColor="#5AF0FF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="ldr-name">Abaid-ul-Rehman</div>
        <div className="ldr-role">Full-Stack Developer</div>
        <div className="ldr-track">
          <div className="ldr-fill" style={{ width: `${Math.min(pct,100)}%` }} />
          <div className="ldr-glow" style={{ left: `${Math.min(pct,100)}%` }} />
        </div>
        <div className="ldr-pct">{Math.round(Math.min(pct,100))}%</div>
      </div>
    </div>
  )
}
