"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { HEAD, makeArrow, POINTS_FRAG as FRAG, POINTS_VERT as VERT, SHAFT } from "@/components/three/kit";
import {
  ACT_COUNT,
  ACT_VIEW,
  DELAY,
  EIGEN,
  LAYERS,
  N,
  NET_EDGES,
  NODES,
  PATH,
  PCA_AXES,
  PCA_SD,
  SWIRL,
  VARIANCE_KEPT,
  fillShape,
  matrixAt,
  smooth,
  surfaceY,
} from "./filmMath";

export type FilmState = { act: number; local: number; visible: boolean };

const f2 = (x: number) => (Math.abs(x) < 0.005 ? "0.00" : x.toFixed(2)).padStart(5, " ");

export default function FilmScene({ state }: { state: MutableRefObject<FilmState> }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the page still reads fine on black.
    }
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

    // Particles
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const size = new Float32Array(N);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    const uniforms = { uScale: { value: 1 }, uPixelRatio: { value: dpr }, uDist: { value: 6 } };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(geo, mat));
    const A = { pos: new Float32Array(N * 3), col: new Float32Array(N * 3), size: new Float32Array(N) };
    const B = { pos: new Float32Array(N * 3), col: new Float32Array(N * 3), size: new Float32Array(N) };

    // Act overlays
    const basis = [makeArrow(0x34d399), makeArrow(0xf87171), makeArrow(0x60a5fa)];
    basis.forEach((a) => scene.add(a.g));
    const eigenMat = new THREE.MeshBasicMaterial({ color: 0xffc35a, transparent: true, opacity: 0 });
    const eigenLine = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 7, 8), eigenMat);
    eigenLine.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...EIGEN.vectors[0]).normalize());
    scene.add(eigenLine);
    const pca = [makeArrow(0xffffff), makeArrow(0x93c5fd), makeArrow(0xf9a8d4)];
    pca.forEach((a) => scene.add(a.g));
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd9a0, emissiveIntensity: 0.9, roughness: 0.15, metalness: 0.1, transparent: true });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 16), ballMat);
    scene.add(ball);
    const trailPos = new Float32Array(PATH.length * 3);
    PATH.forEach((p, i) => trailPos.set([p.x, surfaceY(p.loss) + 0.03, p.z], i * 3));
    const trailGeo = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: 0xffd08a, transparent: true, opacity: 0 });
    scene.add(new THREE.Line(trailGeo, trailMat));
    const edgePos = new Float32Array(NET_EDGES.length * 6);
    NET_EDGES.forEach(([a, b], i) => edgePos.set([...NODES[a].p, ...NODES[b].p], i * 6));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x6d74c9, transparent: true, opacity: 0 });
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(edgePos, 3)), edgeMat));

    // Size
    let W = 1;
    let H = 1;
    const resize = () => {
      W = el.clientWidth || window.innerWidth;
      H = el.clientHeight || window.innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      uniforms.uScale.value = H / (2 * Math.tan((camera.fov * Math.PI) / 360));
    };
    resize();
    window.addEventListener("resize", resize);

    // Drag to rotate (springs back so each act keeps its framing), plus pointer parallax.
    let dragYaw = 0;
    let dragElev = 0;
    let vYaw = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let px = 0;
    let py = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vYaw = -dx * 0.006;
      dragYaw += vYaw;
      dragElev = Math.max(-0.5, Math.min(0.5, dragElev + dy * 0.004));
    };
    const up = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    const hud = new Map<string, HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-hud]").forEach((h) => hud.set(h.dataset.hud!, h));
    const write = (k: string, text: string, opacity?: number) => {
      const h = hud.get(k);
      if (!h) return;
      if (h.textContent !== text) h.textContent = text;
      if (opacity !== undefined) h.style.opacity = String(opacity);
    };

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

      const act = Math.min(ACT_COUNT - 1, st.act);
      const lastAct = act === ACT_COUNT - 1;
      const u = Math.min(1, st.local / (lastAct ? 0.6 : 0.7));
      const m = lastAct ? 0 : smooth(0.7, 1, st.local);

      // Particles: this act, morphing into the next with a staggered swirl.
      fillShape(act, u, time, A.pos, A.col, A.size);
      if (m > 0) {
        fillShape(act + 1, 0, time, B.pos, B.col, B.size);
        for (let i = 0; i < N; i++) {
          const t = smooth(0, 1, (m - DELAY[i]) / 0.65);
          const lift = Math.sin(Math.PI * t) * 0.45;
          for (let k = 0; k < 3; k++) {
            const j = i * 3 + k;
            pos[j] = A.pos[j] + (B.pos[j] - A.pos[j]) * t + SWIRL[j] * lift;
            col[j] = A.col[j] + (B.col[j] - A.col[j]) * t;
          }
          size[i] = A.size[i] + (B.size[i] - A.size[i]) * t;
        }
      } else {
        pos.set(A.pos);
        col.set(A.col);
        size.set(A.size);
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aColor.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;

      const weight = (k: number) => (act === k ? 1 - m : act === k - 1 ? m : 0);
      const uOf = (k: number) => (act === k ? u : 0);

      // Act 1: basis vectors are the matrix's columns; the eigen-line lights up.
      const w1 = weight(1);
      const M = matrixAt(smooth(0, 0.6, uOf(1)));
      const s = 0.85;
      basis.forEach((a, c) => a.set([M[c] * s, M[3 + c] * s, M[6 + c] * s], w1));
      const h1 = smooth(0.55, 0.8, uOf(1));
      eigenMat.opacity = w1 * h1 * 0.9;

      // Act 3: principal axes grow, then the third collapses as the cloud flattens.
      const w3 = weight(3);
      const grow = smooth(0.12, 0.4, uOf(3));
      const flat = smooth(0.5, 0.9, uOf(3));
      pca.forEach((a, k) => a.set(PCA_AXES[k].map((q) => q * PCA_SD[k] * 2.2 * grow * (k === 2 ? 1 - flat : 1)), w3));

      // Act 4: the ball follows the descent path.
      const w4 = weight(4);
      const step = Math.min(PATH.length - 1, uOf(4) * (PATH.length - 1));
      const i0 = Math.floor(step);
      const p0 = PATH[i0];
      const p1 = PATH[Math.min(PATH.length - 1, i0 + 1)];
      const fr = step - i0;
      const bx = p0.x + (p1.x - p0.x) * fr;
      const bz = p0.z + (p1.z - p0.z) * fr;
      const bl = p0.loss + (p1.loss - p0.loss) * fr;
      ball.position.set(bx, surfaceY(bl) + 0.075, bz);
      ballMat.opacity = w4;
      ball.visible = w4 > 0.01;
      trailMat.opacity = w4 * 0.9;
      trailGeo.setDrawRange(0, i0 + 1);

      // Act 5: faint wiring under the signal particles.
      edgeMat.opacity = weight(5) * 0.28;

      // Camera
      const a0 = ACT_VIEW[act];
      const a1 = ACT_VIEW[Math.min(ACT_COUNT - 1, act + 1)];
      const lerp = (x: number, y: number) => x + (y - x) * m;
      if (!dragging) {
        dragYaw *= 0.97;
        dragElev *= 0.97;
      }
      const sway = reduce ? 0 : 0.14 * Math.sin(time * 0.22);
      const yaw = lerp(a0.yaw, a1.yaw) + sway + dragYaw + px * 0.1;
      const elev = Math.max(-0.2, Math.min(1.2, lerp(a0.elev, a1.elev) + dragElev - py * 0.06));
      const dist = lerp(a0.dist, a1.dist) * (W / H < 1 ? 1.35 : 1);
      camera.position.set(dist * Math.sin(yaw) * Math.cos(elev), dist * Math.sin(elev), dist * Math.cos(yaw) * Math.cos(elev));
      camera.lookAt(0, 0, 0);
      uniforms.uDist.value = dist;
      // Shift the object to one side (text sits on the other); on phones, lift it above the text.
      const side = lerp(a0.side, a1.side);
      const lift = lerp(a0.lift, a1.lift);
      if (W / H >= 1.1) camera.setViewOffset(W, H, -side * 0.2 * W, lift * H, W, H);
      else camera.setViewOffset(W, H, 0, (0.17 + lift) * H, W, H);

      // Live readouts, ~15 times a second.
      if (frame % 4 === 0) {
        if (act === 1 || act === 0) {
          const r = (i: number) => `${f2(M[i])} ${f2(M[i + 1])} ${f2(M[i + 2])}`;
          write("matrix", `⎡${r(0)} ⎤\n⎢${r(3)} ⎥\n⎣${r(6)} ⎦`);
          write("eigen", `λ = ${(1 + 0.7 * smooth(0, 0.6, uOf(1))).toFixed(2)} along (1, 1, 1)`, h1);
        }
        if (act === 2) {
          const theta = ((uOf(2) * Math.PI * 1.25 + time * 0.12) * 180) / Math.PI;
          write("tesseract", `x–w rotation ${Math.round(theta % 360)}° · 16 vertices · 32 edges`);
        }
        if (act === 3) write("pca", `${flat > 0.98 ? "2" : "3"} dimensions · variance kept ${(100 - flat * (1 - VARIANCE_KEPT) * 100).toFixed(1)}%`);
        if (act === 4) write("descent", `step ${String(Math.round(step)).padStart(2, "0")} · loss ${bl.toFixed(3)} · η = 0.18`);
        if (act === 5) write("network", `${LAYERS.join(" → ")} · ${NET_EDGES.length} weights · ${LAYERS.slice(1).reduce((x, y) => x + y, 0)} biases`);
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry && mesh.geometry !== SHAFT && mesh.geometry !== HEAD) mesh.geometry.dispose();
        const mm = mesh.material as THREE.Material | undefined;
        mm?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [state]);

  return <div ref={host} className="absolute inset-0" style={{ touchAction: "pan-y" }} aria-hidden />;
}
