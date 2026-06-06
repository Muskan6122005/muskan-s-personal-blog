import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points | null;
  nebula: THREE.Group | null;
  terrain: THREE.Mesh | null;
  animationId: number | null;
}

export const HorizonHeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: null,
    nebula: null,
    terrain: null,
    animationId: null
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { current: refs } = threeRefs;

    // 1. Scene setup
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.003);

    // 2. Camera Setup
    refs.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Initial camera position for About Me stop
    refs.camera.position.set(0, 5, 120);

    // 3. Renderer Setup
    refs.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 1.0;

    // 4. Post-processing (Unreal Bloom Pass)
    refs.composer = new EffectComposer(refs.renderer);
    const renderPass = new RenderPass(refs.scene, refs.camera);
    refs.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    refs.composer.addPass(bloomPass);

    // 5. Ambient lights to light the mountains slightly
    const ambientLight = new THREE.AmbientLight(0xffffffff, 0.1);
    refs.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf59e0b, 1.5);
    directionalLight.position.set(0, 50, -50);
    refs.scene.add(directionalLight);

    // 6. Starfield Generation
    const starsCount = 4000;
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Large sphere shell distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 250 + Math.random() * 200; // Radius between 250 and 450

      positions[i] = r * Math.sin(phi) * Math.cos(theta); // X
      positions[i + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 10; // Y (keep them mostly above horizon)
      positions[i + 2] = r * Math.cos(phi); // Z

      // Color coding: mostly white/blue stars, with some amber ones
      const isAmber = Math.random() > 0.8;
      if (isAmber) {
        colors[i] = 0.98; // R
        colors[i + 1] = 0.58; // G
        colors[i + 2] = 0.09; // B (amber)
      } else {
        colors[i] = 0.9 + Math.random() * 0.1;
        colors[i + 1] = 0.9 + Math.random() * 0.1;
        colors[i + 2] = 1.0;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    refs.stars = new THREE.Points(starsGeometry, starsMaterial);
    refs.scene.add(refs.stars);

    // 7. Nebula Programmatic Canvas Texture
    const createNebulaTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 128;
      texCanvas.height = 128;
      const ctx = texCanvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 1)'); // Dark Orange center
        gradient.addColorStop(0.25, 'rgba(245, 158, 11, 0.4)'); // Amber glow
        gradient.addColorStop(0.5, 'rgba(234, 179, 8, 0.15)'); // Yellow halo
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(texCanvas);
    };

    const nebulaTexture = createNebulaTexture();
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    refs.nebula = new THREE.Group();
    // Scatter a few large planes to simulate gas clouds
    for (let i = 0; i < 8; i++) {
      const geom = new THREE.PlaneGeometry(160, 160);
      const mesh = new THREE.Mesh(geom, nebulaMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 40 + 20,
        (Math.random() - 0.5) * 200 - 80
      );
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.rotation.x = (Math.random() - 0.5) * 0.5;
      mesh.scale.setScalar(0.7 + Math.random() * 0.8);
      refs.nebula.add(mesh);
    }
    refs.scene.add(refs.nebula);

    // 8. Mountains (Deformed Wireframe Terrain)
    const terrainGeom = new THREE.PlaneGeometry(500, 500, 80, 80);
    const posAttr = terrainGeom.attributes.position;
    
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const distFromCenter = Math.abs(x);
      
      // Calculate a base mountain noise height
      let height = (Math.sin(x * 0.03) * Math.cos(y * 0.03) * 18) + 
                   (Math.cos(x * 0.07) * Math.sin(y * 0.07) * 7);

      // Keep center valley flat where camera moves
      if (distFromCenter < 50) {
        const factor = distFromCenter / 50;
        height *= (factor * factor);
      }
      
      // Flatten the immediate foreground
      const distFromFront = y + 250; // y runs -250 to 250
      if (distFromFront < 120) {
        height *= (distFromFront / 120);
      }

      posAttr.setZ(i, height);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, // Orange
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });

    refs.terrain = new THREE.Mesh(terrainGeom, terrainMat);
    refs.terrain.rotation.x = -Math.PI / 2;
    refs.terrain.position.set(0, -18, -50);
    refs.scene.add(refs.terrain);

    // 9. Camera orientation target
    const lookTarget = new THREE.Vector3(0, 3, 0);

    // 10. GSAP ScrollTrigger Setup
    // Create an animation timeline bound to scrolling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          if (self.progress < 0.38) {
            setCurrentSection(1);
          } else if (self.progress < 0.72) {
            setCurrentSection(2);
          } else {
            setCurrentSection(3);
          }
        }
      }
    });

    // Camera Flight Path (tweening position and lookTarget values)
    // About Me stop: camera (0, 5, 120) -> Education stop: camera (18, -1, 65) -> Skills stop: camera (-15, 6, 25)
    tl.to(refs.camera.position, { x: 18, y: -1, z: 65, ease: "power1.inOut" }, 0)
      .to(lookTarget, { x: 6, y: 1, z: -10, ease: "power1.inOut" }, 0)
      
      .to(refs.camera.position, { x: -15, y: 6, z: 25, ease: "power1.inOut" }, 0.5)
      .to(lookTarget, { x: -4, y: 3, z: -40, ease: "power1.inOut" }, 0.5);

    // HTML Content Fades and Translates (using GSAP overlay triggers)
    // Section 1 (About Me) fades out
    tl.to(".horizon-section-1", { opacity: 0, y: -40, pointerEvents: "none", ease: "power1.inOut" }, 0.15);

    // Section 2 (Education) fades in, then fades out
    tl.fromTo(".horizon-section-2",
      { opacity: 0, y: 40, pointerEvents: "none" },
      { opacity: 1, y: 0, pointerEvents: "auto", ease: "power1.inOut" },
      0.30
    ).to(".horizon-section-2", { opacity: 0, y: -40, pointerEvents: "none", ease: "power1.inOut" }, 0.60);

    // Section 3 (Skills) fades in
    tl.fromTo(".horizon-section-3",
      { opacity: 0, y: 40, pointerEvents: "none" },
      { opacity: 1, y: 0, pointerEvents: "auto", ease: "power1.inOut" },
      0.75
    );

    // 11. Render Loop
    const render = () => {
      const { camera, composer, stars, nebula } = threeRefs.current;
      if (!camera || !composer) return;

      // Slow orbital animations
      if (stars) {
        stars.rotation.y += 0.00004;
      }
      if (nebula) {
        nebula.rotation.y -= 0.00008;
        nebula.children.forEach((cloud, idx) => {
          cloud.rotation.z += 0.0001 * (idx % 2 === 0 ? 1 : -1);
        });
      }

      // Constantly orient the camera toward the lookTarget (animated by GSAP)
      camera.lookAt(lookTarget);

      // Render through the post-processing composer
      composer.render();
      refs.animationId = requestAnimationFrame(render);
    };

    refs.animationId = requestAnimationFrame(render);

    // 12. Resize Handler
    const handleResize = () => {
      const { camera, renderer, composer } = threeRefs.current;
      if (!camera || !renderer || !composer) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }
      
      // Cleanup Three objects
      if (refs.stars) {
        refs.stars.geometry.dispose();
        (refs.stars.material as THREE.Material).dispose();
      }
      if (refs.terrain) {
        refs.terrain.geometry.dispose();
        (refs.terrain.material as THREE.Material).dispose();
      }
      if (refs.nebula) {
        refs.nebula.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
      }
      
      nebulaTexture.dispose();
      
      if (refs.renderer) {
        refs.renderer.dispose();
      }

      // Kill ScrollTrigger instances attached to this timeline
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === container) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-black">
      {/* Anchors for scrolling navigation */}
      <div id="about-me" className="absolute top-0 left-0 w-full h-px pointer-events-none" />
      <div id="education" className="absolute top-[100vh] left-0 w-full h-px pointer-events-none" />
      <div id="skills" className="absolute top-[200vh] left-0 w-full h-px pointer-events-none" />

      {/* Sticky Canvas and Overlay Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        
        {/* Ambient Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none z-10" />

        {/* Content Overlays */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-10 pointer-events-none">
          
          {/* STOP 1: ABOUT ME */}
          <div className="horizon-section-1 absolute w-full max-w-5xl px-4 md:px-8 pointer-events-auto select-text">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 font-display">
              About me
            </h2>
            <div className="backdrop-blur-md bg-black/45 border border-amber-500/25 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.08)] hover:border-amber-500/40 hover:shadow-[0_0_55px_rgba(245,158,11,0.15)] transition-all duration-300">
              <p className="text-xl md:text-2xl text-zinc-100 leading-relaxed font-sans font-medium">
                Hello! My name is <strong className="text-amber-400 font-bold">Muskan Yeshmin Ali</strong>. I am currently in my 2nd year pursuing a B.Tech in Computer Science Engineering at the <strong className="text-white font-semibold">Institute of Engineering & Management, Kolkata</strong>.
              </p>
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed mt-6 font-sans border-l-3 border-orange-500/60 pl-5">
                I build agentic AI systems, multi-agent frameworks, and full-stack AI-powered web apps. I thrive in collaborative environments, bringing a positive attitude, robust time management, and a calm, collected approach under pressure.
              </p>
              <p className="text-base md:text-lg text-orange-500 font-mono tracking-wider mt-8 uppercase font-bold">
                🚀 Motivated by real-world problems in healthcare, education, and research automation.
              </p>
            </div>
          </div>

          {/* STOP 2: EDUCATION */}
          <div className="horizon-section-2 absolute w-full max-w-5xl px-4 md:px-8 opacity-0 pointer-events-none select-text">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 font-display">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* College Card */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/25 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.05)] hover:border-amber-500/40 hover:shadow-[0_0_55px_rgba(245,158,11,0.12)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-sm font-mono text-orange-500 font-bold uppercase tracking-widest block mb-3">[ 2024 - Present ]</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight font-display">
                    B.Tech in Computer Science Engineering
                  </h3>
                  <p className="text-zinc-200 text-base md:text-lg mb-4 font-sans font-medium">
                    Institute of Engineering & Management, Kolkata (expected 2028)
                  </p>
                </div>
                <div className="border-t border-amber-500/15 pt-5 mt-5">
                  <div className="flex items-start gap-4 bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 shadow-[inset_0_0_15px_rgba(245,158,11,0.03)]">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">Vice Chancellor's Award</p>
                      <p className="text-sm text-zinc-300 leading-relaxed font-medium mt-0.5">Overall Academic and Extracurricular Excellence (1st Year, 2024-25)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* High School Card */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/25 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.05)] hover:border-amber-500/40 hover:shadow-[0_0_55px_rgba(245,158,11,0.12)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-sm font-mono text-orange-500 font-bold uppercase tracking-widest block mb-3">[ 2010 - 2024 ]</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight font-display">
                    Senior Secondary (Class XII)
                  </h3>
                  <p className="text-zinc-200 text-base md:text-lg mb-4 font-sans font-medium">
                    Delhi Public School Ruby Park, Kolkata
                  </p>
                </div>
                <div className="border-t border-amber-500/15 pt-5 mt-5">
                  <p className="text-sm md:text-base text-zinc-400 font-mono italic">// Finished primary and high school curriculum.</p>
                </div>
              </div>

            </div>
          </div>

          {/* STOP 3: SKILLS */}
          <div className="horizon-section-3 absolute w-full max-w-6xl px-4 md:px-8 opacity-0 pointer-events-none select-text">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 font-display">
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Category 1 */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/20 rounded-2xl p-6 shadow-md hover:border-amber-500/45 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-300">
                <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2 font-display">Languages</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">Python</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">C</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm text-nowrap">Java (Basic)</span>
                </div>
              </div>

              {/* Category 2 */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/20 rounded-2xl p-6 shadow-md hover:border-amber-500/45 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-300">
                <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2 font-display">AI / ML</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">TensorFlow</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">Scikit-learn</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">PyTorch</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm text-nowrap">Reinforce Lrn</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">Agentic SDK</span>
                </div>
              </div>

              {/* Category 3 */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/20 rounded-2xl p-6 shadow-md hover:border-amber-500/45 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-300">
                <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2 font-display">Web & Cloud</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">HTML</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">CSS</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">JavaScript</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">GCP</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">AWS</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">Azure</span>
                </div>
              </div>

              {/* Category 4 */}
              <div className="backdrop-blur-md bg-black/45 border border-amber-500/20 rounded-2xl p-6 shadow-md hover:border-amber-500/45 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-300">
                <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2 font-display">Tools</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">Git</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">MLflow</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm text-nowrap">Jupyter Nb</span>
                  <span className="text-sm font-mono bg-amber-500/5 text-amber-300 border border-amber-500/25 px-3 py-1.5 rounded-lg shadow-sm">VS Code</span>
                </div>
              </div>

            </div>

            {/* Soft Protocols footer inside stop */}
            <div className="backdrop-blur-md bg-black/40 border border-amber-500/15 rounded-2xl p-5 mt-8 flex flex-wrap justify-around items-center text-sm md:text-base font-mono text-zinc-200 gap-4 shadow-sm hover:border-amber-500/30 transition-all duration-300">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span> Teamwork & Collaboration</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span> Time Management</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span> Detail Oriented</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span> Calm Under Pressure</span>
            </div>
          </div>
        </div>

        {/* Bottom Scroll HUD (Section indicator & progress line) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 flex items-center gap-6 z-20 pointer-events-auto select-none">
          <div className="text-sm font-mono text-amber-500/80 tracking-wider">
            0{currentSection} <span className="text-amber-800">/</span> 03
          </div>
          <div className="flex-1 h-[2px] bg-amber-950/40 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};