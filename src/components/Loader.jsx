import React,{useEffect,useState,useRef} from 'react'
export default function Loader(){
  const [pct,setPct]=useState(0);const cvs=useRef(null)
  useEffect(()=>{const iv=setInterval(()=>setPct(p=>{if(p>=100){clearInterval(iv);return 100}return Math.min(p+Math.random()*12,100)}),90);return()=>clearInterval(iv)},[])
  useEffect(()=>{
    const c=cvs.current;if(!c)return;const gl=c.getContext('webgl');if(!gl)return
    c.width=c.clientWidth;c.height=c.clientHeight
    const VS=`attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`
    const FS=`precision mediump float;uniform float t;uniform vec2 res;void main(){vec2 uv=(gl_FragCoord.xy/res)*2.0-1.0;float wave1=sin(uv.x*3.0+t*0.7)*0.35;float wave2=cos(uv.x*2.0-t*0.5)*0.28;float a1=smoothstep(0.05,0.0,abs(uv.y-wave1))*0.6;float a2=smoothstep(0.06,0.0,abs(uv.y-wave2))*0.45;vec3 c1=vec3(0.36,0.31,1.0)*a1;vec3 c2=vec3(0.0,0.9,1.0)*a2;gl_FragColor=vec4(c1+c2,a1+a2);}`
    const mk=(t,s)=>{const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh}
    const prog=gl.createProgram();gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS));gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);gl.useProgram(prog)
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
    const q=new Float32Array([-1,-1,1,-1,-1,1,1,1]);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,q,gl.STATIC_DRAW)
    const pl=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(pl);gl.vertexAttribPointer(pl,2,gl.FLOAT,false,0,0)
    const tl=gl.getUniformLocation(prog,'t');const rl=gl.getUniformLocation(prog,'res')
    let id,t0=performance.now()
    const draw=()=>{const t=(performance.now()-t0)/1000;gl.clearColor(0.02,0.03,0.063,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(tl,t);gl.uniform2f(rl,c.width,c.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);id=requestAnimationFrame(draw)}
    draw();return()=>cancelAnimationFrame(id)
  },[])
  const p=Math.min(pct,100)
  return(
    <div style={{position:'fixed',inset:0,background:'var(--void)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <canvas ref={cvs} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.6}}/>
      <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:'.75rem',textAlign:'center'}}>
        <div style={{fontFamily:'var(--sans)',fontSize:'2.5rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--cyan,#00E5FF))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>AR</div>
        <div style={{fontFamily:'var(--sans)',fontSize:'1.1rem',fontWeight:600,color:'var(--text)'}}>Abaid-ul-Rehman</div>
        <div style={{fontFamily:'var(--mono)',fontSize:'.66rem',color:'var(--text3)',letterSpacing:'.15em'}}>FULL-STACK DEVELOPER</div>
        <div style={{width:'180px',height:'2px',background:'rgba(255,255,255,.06)',borderRadius:'1px',position:'relative',marginTop:'.5rem',overflow:'visible'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--accent),#00E5FF)',borderRadius:'1px',width:`${p}%`,transition:'width .08s linear'}}/>
          <div style={{position:'absolute',top:'-5px',left:`${p}%`,width:'12px',height:'12px',borderRadius:'50%',transform:'translateX(-50%)',background:'#00E5FF',boxShadow:'0 0 14px #00E5FF',transition:'left .08s linear'}}/>
        </div>
        <div style={{fontFamily:'var(--mono)',fontSize:'.66rem',color:'var(--text3)'}}>{Math.round(p)}%</div>
      </div>
    </div>
  )
}
