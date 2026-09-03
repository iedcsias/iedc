"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ShaderButton({
  text = "SUBMIT YOUR IDEA",
  href = "#contact",
  className = "",
  id = "heroShaderBtn",
  ...props
}) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL2 first for the exact Framer PCG hash and Oklab math
    let gl = canvas.getContext("webgl2", { alpha: false, antialias: true, premultipliedAlpha: false });
    let isWebGL2 = true;

    if (!gl) {
      gl = canvas.getContext("webgl", { alpha: false, antialias: true, premultipliedAlpha: false });
      isWebGL2 = false;
    }

    if (!gl) return;

    let program, animationFrameId;

    if (isWebGL2) {
      const vsSource = `#version 300 es
        in vec2 position;
        out vec2 v_uv;
        void main() {
          v_uv = (position + 1.0) * 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fsSource = `#version 300 es
        precision highp float;
        precision highp int;

        in vec2 v_uv;
        out vec4 fragColor;

        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_pixelRatio;
        uniform float u_seed;
        uniform float u_speed;
        uniform float u_scale;
        uniform float u_turbAmp;
        uniform float u_turbFreq;
        uniform float u_turbIter;
        uniform float u_waveFreq;
        uniform float u_contrast;
        uniform float u_exposure;
        uniform float u_saturation;
        uniform float u_dither;
        uniform float u_ditherMode;

        // Constants
        const float GOLDEN_ANGLE = 2.3999632;
        const float TAU = 6.28318530;

        // Colors matching Framer Shader Button
        const vec3 COLOR_0 = vec3(10.0/255.0, 18.0/255.0, 2.0/255.0);
        const vec3 COLOR_1 = vec3(26.0/255.0, 46.0/255.0, 5.0/255.0);
        const vec3 COLOR_2 = vec3(101.0/255.0, 163.0/255.0, 13.0/255.0);
        const vec3 COLOR_3 = vec3(163.0/255.0, 230.0/255.0, 53.0/255.0);

        uvec3 hash3(uvec3 v) {
          v = v * 1664525u + 1013904223u;
          v.x += v.y * v.z;
          v.y += v.z * v.x;
          v.z += v.x * v.y;
          v ^= v >> 16u;
          v.x += v.y * v.z;
          v.y += v.z * v.x;
          v.z += v.x * v.y;
          return v;
        }

        vec3 seedRandom(float seedVal) {
          uvec3 s = uvec3(
            floatBitsToUint(seedVal),
            floatBitsToUint(seedVal * 1.5 + 7.31),
            floatBitsToUint(seedVal * 2.7 + 13.37)
          );
          s = hash3(s);
          return vec3(s) / float(0xFFFFFFFFu);
        }

        vec3 toLinear(vec3 c) {
          return pow(c, vec3(2.2));
        }

        vec3 toSrgb(vec3 c) {
          return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
        }

        vec3 linearToOklab(vec3 c) {
          float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
          float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
          float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
          l = pow(max(l, 0.0), 1.0/3.0);
          m = pow(max(m, 0.0), 1.0/3.0);
          s = pow(max(s, 0.0), 1.0/3.0);
          return vec3(
            0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
          );
        }

        vec3 oklabToLinear(vec3 c) {
          float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
          float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
          float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
          l = l * l * l;
          m = m * m * m;
          s = s * s * s;
          return vec3(
            +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
          );
        }

        vec3 oklabToLch(vec3 lab) {
          return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
        }

        vec3 lchToOklab(vec3 lch) {
          return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
        }

        vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
          vec3 lch0 = oklabToLch(lab0);
          vec3 lch1 = oklabToLch(lab1);
          if (lch0.y < 0.05) lch0.z = lch1.z;
          if (lch1.y < 0.05) lch1.z = lch0.z;
          float dh = lch1.z - lch0.z;
          if (dh > 3.14159265) dh -= 6.28318530;
          if (dh < -3.14159265) dh += 6.28318530;
          return lchToOklab(vec3(
            mix(lch0.x, lch1.x, t),
            mix(lch0.y, lch1.y, t),
            lch0.z + dh * t
          ));
        }

        vec3 getColor(int idx) {
          if (idx == 0) return COLOR_0;
          if (idx == 1) return COLOR_1;
          if (idx == 2) return COLOR_2;
          return COLOR_3;
        }

        vec3 paletteN(float t) {
          float segmentSize = 1.0 / 3.0;
          t = clamp(t, 0.0, 1.0);
          int idx = min(int(floor(t / segmentSize)), 2);
          float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);
          vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
          vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));
          return oklabToLinear(mixLch(lab0, lab1, localT));
        }

        float IGN(vec2 uv) {
          return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
        }

        vec3 softGamutMap(vec3 linearRgb) {
          float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));
          float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
          if (minC >= 0.0 && maxC <= 1.0) return linearRgb;
          vec3 lab = linearToOklab(max(linearRgb, 0.0));
          float L = clamp(lab.x, 0.0, 1.0);
          float C = length(lab.yz);
          float h = atan(lab.z, lab.y);
          float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));
          if (C > maxChroma * 0.7) {
            float knee = maxChroma * 0.7;
            C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
          }
          return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
        }

        vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
          vec3 lab = linearToOklab(linearRgb);
          float C = length(lab.yz);
          float h = atan(lab.z, lab.y);
          lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
          C *= saturation;
          lab.y = C * cos(h);
          lab.z = C * sin(h);
          return oklabToLinear(lab);
        }

        void main() {
          vec2 fragCoord = v_uv * u_resolution;
          vec2 r = u_resolution;
          vec2 p = (fragCoord * 2.0 - r) / r.y;
          float t = u_time * 0.3;

          vec3 seedOffset = seedRandom(u_seed);
          vec3 seedOffset2 = seedRandom(u_seed + 100.0);
          float seedAngle = u_seed * GOLDEN_ANGLE;
          vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;

          float cs = cos(seedAngle);
          float sn = sin(seedAngle);
          p = mat2(cs, -sn, sn, cs) * p;

          float dither = IGN(floor(fragCoord / u_pixelRatio));

          float totalVal = 0.0;
          float totalWeight = 0.0;
          int turbIter = int(u_turbIter);
          float freq = 1.0 / max(u_turbFreq, 0.01);

          for (float i = 0.0; i < 4.0; i++) {
            float eph = i / 4.0;
            vec2 q = p * u_scale;
            float a = seedPhase.x;
            float d = seedPhase.y;

            for (int j = 2; j < 13; j++) {
              if (j >= turbIter) break;
              float fj = float(j);
              float t1 = t * u_speed;
              q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
              a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z);
              d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y);
            }

            float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
            float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
            totalVal += v * weight;
            totalWeight += weight;
          }

          float val = totalVal / max(totalWeight, 0.001);
          val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
          val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);

          vec3 col = paletteN(val);
          col *= u_exposure;
          col = applyContrastSaturation(col, u_contrast, u_saturation);
          col = softGamutMap(col);
          col = toSrgb(col);

          fragColor = vec4(col, 1.0);
        }
      `;

      function createShader(gl, type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return;

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // Uniform locations
      const uTime = gl.getUniformLocation(program, "u_time");
      const uRes = gl.getUniformLocation(program, "u_resolution");
      const uPix = gl.getUniformLocation(program, "u_pixelRatio");
      const uSeed = gl.getUniformLocation(program, "u_seed");
      const uSpeed = gl.getUniformLocation(program, "u_speed");
      const uScale = gl.getUniformLocation(program, "u_scale");
      const uTurbAmp = gl.getUniformLocation(program, "u_turbAmp");
      const uTurbFreq = gl.getUniformLocation(program, "u_turbFreq");
      const uTurbIter = gl.getUniformLocation(program, "u_turbIter");
      const uWaveFreq = gl.getUniformLocation(program, "u_waveFreq");
      const uContrast = gl.getUniformLocation(program, "u_contrast");
      const uExposure = gl.getUniformLocation(program, "u_exposure");
      const uSaturation = gl.getUniformLocation(program, "u_saturation");
      const uDither = gl.getUniformLocation(program, "u_dither");
      const uDitherMode = gl.getUniformLocation(program, "u_ditherMode");

      gl.uniform1f(uSeed, 32.0);
      gl.uniform1f(uSpeed, 1.6);
      gl.uniform1f(uScale, 0.4);
      gl.uniform1f(uTurbAmp, 0.6);
      gl.uniform1f(uTurbFreq, 0.1);
      gl.uniform1f(uTurbIter, 4.0);
      gl.uniform1f(uWaveFreq, 2.4);
      gl.uniform1f(uContrast, 1.1);
      gl.uniform1f(uExposure, 1.1);
      gl.uniform1f(uSaturation, 1.0);
      gl.uniform1f(uDither, 0.2);
      gl.uniform1f(uDitherMode, 1.0);

      let startTime = performance.now();

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(canvas.clientWidth * dpr);
        const h = Math.floor(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
          gl.uniform2f(uRes, w, h);
          gl.uniform1f(uPix, dpr);
        }
      };

      const render = () => {
        resize();
        const elapsed = (performance.now() - startTime) * 0.001;
        gl.uniform1f(uTime, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
      };

      render();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Link
      href={href}
      id={id}
      className={`framer-shader-btn ${hovered ? "is-hovered" : ""} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {/* Container holding WebGL Shader */}
      <div className="framer-shader-container" data-framer-name="Shader">
        <canvas ref={canvasRef} className="framer-shader-canvas" />
      </div>

      {/* Inner Border Glow Layer matching exact Framer specs */}
      <div className="framer-shader-border-glow" data-framer-name="Border Glow" />

      {/* Button Text */}
      <span className="framer-shader-text">{text}</span>

      {/* Exact Framer ArrowSquareRight Icon Component */}
      <span className="framer-shader-icon-wrap" aria-hidden="true">
        <svg
          className="framer-shader-svg-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          role="presentation"
        >
          {/* Rounded Square Frame */}
          <rect
            x="3.75"
            y="3.75"
            width="16.5"
            height="16.5"
            rx="1.5"
            ry="1.5"
            fill="transparent"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow stem */}
          <line
            x1="8.25"
            y1="12"
            x2="15.75"
            y2="12"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow Head */}
          <polyline
            points="12.75,9 15.75,12 12.75,15"
            stroke="rgb(255, 255, 255)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
