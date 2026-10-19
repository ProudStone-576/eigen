"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { IntroSpec } from "@/lib/content/intro";
import { disposeScene, makeArrow, makeParticles, orbitControls } from "@/components/three/kit";
import { buildProgram, N } from "./programs";

export type IntroState = { p: number; visible: boolean };
const MAX_ARROWS = 8;
const MAX_LINES = 900;

export default function IntroScene({ spec, state, hudId }: { spec: IntroSpec; state: MutableRefObject<IntroState>; hudId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const specKey = JSON.stringify(spec);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    const program = buildProgram(JSON.parse(specKey) as IntroSpec);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 4);
    scene.add(key);

    const parts = makeParticles(N, dpr);
    scene.add(parts.points);
    const arrows = Array.from({ length: MAX_ARROWS }, () => makeArrow(0xffffff));
    arrows.forEach((a) => scene.add(a.g));
    const linePos = new Float32Array(MAX_LINES * 6);
    const lineCol = new Float32Array(MAX_LINES * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    lines.frustumCulled = false;
    scene.add(lines);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd9a0, emissiveIntensity: 0.9, roughness: 0.15, transparent: true });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 16), ballMat);
    scene.add(ball);

    let W = 1;
    let H = 1;
    const resize = () => {
      W = el.clientWidth || 1;
      H = el.clientHeight || 1;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      parts.uniforms.uScale.value = H / (2 * Math.tan((camera.fov * Math.PI) / 360));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const orbit = orbitControls(el);
    const hud = document.getElementById(hudId);

    let raf = 0;
    let time = 0;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = state.current;
      if (!st.visible || document.hidden) return;
      if (!reduce) time += dt;
      frame++;

      const f = program.frame(st.p, time, parts.pos, parts.col, parts.size);
      parts.flush();
      arrows.forEach((a, i) => {
        const spec = f.arrows[i];
        if (!spec) return a.set([0, 0, 0], 0);
        a.setColor(spec.color);
        a.set(spec.v, spec.o, spec.from);
      });
      const n = Math.min(MAX_LINES, f.lines.length);
      for (let i = 0; i < n; i++) {
        const l = f.lines[i];
        linePos.set(l.a, i * 6);
        linePos.set(l.b, i * 6 + 3);
        const c = [l.c[0] * l.o, l.c[1] * l.o, l.c[2] * l.o];
        lineCol.set(c, i * 6);
        lineCol.set(c, i * 6 + 3);
      }
      lineGeo.setDrawRange(0, n * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      ball.visible = !!f.ball && f.ball.o > 0.01;
      if (f.ball) {
        ball.position.set(...f.ball.p);
        ballMat.opacity = f.ball.o;
      }

      // Camera: the program's framing, a slow scroll-driven orbit, a gentle sway, drag and parallax.
      orbit.relax();
      const o = orbit.state;
      const v = program.view;
      const yaw = v.yaw + (st.p - 0.5) * 0.3 + (reduce ? 0 : 0.08 * Math.sin(time * 0.25)) + o.yaw + o.px * 0.08;
      const elev = Math.max(-0.3, Math.min(1.3, v.elev + o.elev - o.py * 0.05));
      const dist = v.dist * (W / H < 1 ? 1.3 : 1);
      camera.position.set(dist * Math.sin(yaw) * Math.cos(elev), dist * Math.sin(elev), dist * Math.cos(yaw) * Math.cos(elev));
      camera.lookAt(0, 0, 0);
      parts.uniforms.uDist.value = dist;
      // Object to the right of the text on wide screens; above it on phones.
      if (W / H >= 1.1) camera.setViewOffset(W, H, -0.2 * W, 0, W, H);
      else camera.setViewOffset(W, H, 0, 0.2 * H, W, H);

      if (hud && frame % 4 === 0 && hud.textContent !== f.hud) hud.textContent = f.hud;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      orbit.dispose();
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [specKey, state, hudId]);

  return <div ref={host} className="absolute inset-0" style={{ touchAction: "pan-y" }} aria-hidden />;
}
