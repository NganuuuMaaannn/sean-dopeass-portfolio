"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

interface LiquidChromeProps extends HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export default function LiquidChrome({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  className = "",
  ...props
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [red, green, blue] = baseColor;

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    const renderer = new Renderer({ antialias: true });
    const gl = renderer.gl;

    gl.clearColor(1, 1, 1, 1);
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 10.0; i++) {
          uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
          uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = uvCoord - uMouse;
        float dist = length(diff);
        float falloff = exp(-dist * 20.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
        return vec4(color, 1.0);
      }

      void main() {
        vec4 col = vec4(0.0);
        int samples = 0;

        for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
            vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
            col += renderImage(vUv + offset);
            samples++;
          }
        }

        gl_FragColor = col / float(samples);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Float32Array([
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ]),
        },
        uBaseColor: { value: new Float32Array([red, green, blue]) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const width = Math.max(1, container.offsetWidth);
      const height = Math.max(1, container.offsetHeight);

      renderer.setSize(width, height);

      const resUniform = program.uniforms.uResolution.value as Float32Array;
      resUniform[0] = gl.canvas.width;
      resUniform[1] = gl.canvas.height;
      resUniform[2] = gl.canvas.width / gl.canvas.height;
    }

    function updateMouse(clientX: number, clientY: number) {
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;

      mouseUniform[0] = x;
      mouseUniform[1] = y;
    }

    function handleMouseMove(event: MouseEvent) {
      updateMouse(event.clientX, event.clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (touch) {
        updateMouse(touch.clientX, touch.clientY);
      }
    }

    let animationId = 0;

    function update(timestamp: number) {
      animationId = window.requestAnimationFrame(update);
      program.uniforms.uTime.value = timestamp * 0.001 * speed;
      renderer.render({ scene: mesh });
    }

    container.appendChild(gl.canvas);
    window.addEventListener("resize", resize);

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchmove", handleTouchMove);
    }

    resize();
    animationId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);

      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
      }

      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blue, frequencyX, frequencyY, green, interactive, red, speed]);

  return <div ref={containerRef} className={`h-full w-full ${className}`} {...props} />;
}
