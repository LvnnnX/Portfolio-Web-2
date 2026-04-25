"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function WebGLShader() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
    isVisible: boolean
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    isVisible: true,
  })

  // Watch for dark class changes on <html>
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // WebGL setup — only runs when NOT dark
  useEffect(() => {
    if (isDark || !canvasRef.current) return

    const canvas = canvasRef.current
    const refs = sceneRef.current

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        vec3 line_color = vec3(r, g, b);
        float strength = max(r, max(g, b));
        
        // Blend white background with bright original colors
        vec3 final_color = mix(vec3(1.0), line_color, clamp(strength, 0.0, 1.0));
        gl_FragColor = vec4(final_color, 1.0);
      }
    `

    refs.scene = new THREE.Scene()
    refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    // HARD LIMIT pixel ratio to 1.5 for performance on mobile/retina
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    refs.renderer.setClearColor(new THREE.Color(0xffffff), 1)

    refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

    refs.uniforms = {
      resolution: { value: [window.innerWidth, window.innerHeight] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    }

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ]

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", positions)

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: refs.uniforms,
      side: THREE.DoubleSide,
    })

    refs.mesh = new THREE.Mesh(geometry, material)
    refs.scene.add(refs.mesh)

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    handleResize()

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate)
      
      // PAUSE heavy rendering when off-screen or tab inactive
      if (!refs.isVisible || document.hidden) return

      if (refs.uniforms) refs.uniforms.time.value += 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
    }

    animate()
    
    const handleVisibility = () => {
      if (document.hidden && refs.animationId) {
         refs.isVisible = false;
      } else {
         refs.isVisible = true;
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("resize", handleResize)

    // Setup intersection observer to pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        refs.isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibility)
      observer.disconnect()
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
      refs.scene = null
      refs.camera = null
      refs.renderer = null
      refs.mesh = null
      refs.uniforms = null
      refs.animationId = null
    }
  }, [isDark])

  // Don't render canvas in dark mode
  if (isDark) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}
