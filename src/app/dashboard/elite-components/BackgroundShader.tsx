'use client';
import { useEffect, useRef } from "react";

export default function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || window.innerWidth;
        canvas.height = parent.clientHeight || window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      // Fallback is handled by CSS styles if WebGL is unavailable
      return;
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        
        // Create slow, flowing gradient movement
        float noise1 = sin(uv.x * 2.0 + u_time * 0.3) * 0.5 + 0.5;
        float noise2 = cos(uv.y * 2.0 - u_time * 0.2) * 0.5 + 0.5;
        
        vec3 color1 = vec3(0.439, 0.051, 0.243); // Deep Plum #700d3e
        vec3 color2 = vec3(0.973, 0.976, 1.0);   // Surface #f8f9ff
        
        vec3 finalColor = mix(color1, color2, (noise1 + noise2) * 0.5);
        // Soften it significantly for a light, professional background
        finalColor = mix(vec3(0.973, 0.976, 0.99), finalColor, 0.12);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const shaderProgram = gl.createProgram();
    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);

    if (!shaderProgram || !vertexShader || !fragmentShader) return;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.useProgram(shaderProgram);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(shaderProgram, "u_time");

    const render = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTimeLoc) {
        gl.uniform1f(uTimeLoc, time * 0.001);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#f4f5f7] flow-bg opacity-50">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
