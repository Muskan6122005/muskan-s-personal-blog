import React, { useEffect, useRef } from "react";

class PointerHandler {
  container: HTMLDivElement;
  x: number;
  y: number;
  currentX: number;
  currentY: number;
  private onMoveBind: (e: PointerEvent) => void;
  private onLeaveBind: () => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.x = 0;
    this.y = 0;
    this.currentX = 0;
    this.currentY = 0;

    this.onMoveBind = this.onMove.bind(this);
    this.onLeaveBind = this.onLeave.bind(this);

    window.addEventListener("pointermove", this.onMoveBind);
    window.addEventListener("pointerleave", this.onLeaveBind);
  }

  private onMove(e: PointerEvent) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    this.x = (e.clientX - halfW) / halfW;
    this.y = (e.clientY - halfH) / halfH;
  }

  private onLeave() {
    this.x = 0;
    this.y = 0;
  }

  update() {
    this.currentX += (this.x - this.currentX) * 0.06;
    this.currentY += (this.y - this.currentY) * 0.06;

    const content = this.container.querySelector(".webgl-hero-grid") as HTMLDivElement | null;
    if (content) {
      const rotX = -this.currentY * 8;
      const rotY = this.currentX * 8;
      content.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  }

  destroy() {
    window.removeEventListener("pointermove", this.onMoveBind);
    window.removeEventListener("pointerleave", this.onLeaveBind);
  }
}

export const WebGLHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 context could not be initialized.");
      return;
    }

    const vsSource = `#version 300 es
    in vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }`;

    const fsSource = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    #define FC gl_FragCoord.xy
    #define T time
    #define R resolution
    #define MN min(R.x,R.y)
    float rnd(vec2 p) {
      p=fract(p*vec2(12.9898,78.233));
      p+=dot(p,p+34.56);
      return fract(p.x*p.y);
    }
    float noise(in vec2 p) {
      vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
      float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
      return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
    }
    float fbm(vec2 p) {
      float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
      for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
      return t;
    }
    float clouds(vec2 p) {
      float d=1., t=.0;
      for (float i=.0; i<3.; i++) {
        float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
        t=mix(t,d,a); d=a; p*=2./(i+1.);
      }
      return t;
    }
    void main(void) {
      vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
      vec3 col=vec3(0);
      float bg=clouds(vec2(st.x+T*.5,-st.y));
      uv*=1.-.3*(sin(T*.2)*.5+.5);
      for (float i=1.; i<12.; i++) {
        uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
        vec2 p=uv;
        float d=length(p);
        col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
        float b=noise(i+p+bg*1.731);
        col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
        col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
      }
      O=vec4(col,1);
    }`;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiler error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "resolution");
    const timeLoc = gl.getUniformLocation(program, "time");

    const pointer = new PointerHandler(container);

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.02 });
    observer.observe(container);

    const startTime = performance.now();
    let animationId: number;

    const renderLoop = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(renderLoop);
        return;
      }
      pointer.update();

      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;
      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
        gl.viewport(0, 0, displayW, displayH);
      }

      gl.useProgram(program);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      const timeVal = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, timeVal);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationId);
      pointer.destroy();
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <header ref={containerRef} className="webgl-hero" id="home">
      <canvas ref={canvasRef} id="webgl-canvas" />
      <div className="webgl-hero-shadow" />

      <div className="webgl-hero-content">
        <div className="webgl-hero-grid">
          <div className="webgl-hero-text-container">
            <div className="webgl-tagline">
              <span>Still figuring it out — but building while I do.</span>
            </div>
            <h1 className="webgl-name-line-1">MUSKAN YESHMIN ALI</h1>
            <h2 className="webgl-name-line-2">B.Tech CSE · AI/ML · Agentic Systems</h2>
            <p className="webgl-subtitle">
              Building intelligent systems at the intersection of AI and human-centered design. Open to research collabs & opportunities.
            </p>
            <div className="webgl-buttons-container">
              <a href="#projects" className="webgl-btn webgl-btn-primary">View My Work</a>
              <a href="#contact" className="webgl-btn webgl-btn-secondary">Get In Touch</a>
            </div>
          </div>
          <div className="webgl-hero-image-container">
            <div className="webgl-hero-img-box magnetic">
              <img src="WhatsApp Image 2026-04-16 at 07.45.09.jpeg" alt="Muskan Yeshmin Ali" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
