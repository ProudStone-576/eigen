import * as THREE from "three";

/**
 * Shared pieces for the 3D scenes (landing film and lesson intros):
 * a soft additive glow for particles, and glossy arrows for vectors.
 */

export const POINTS_VERT = /* glsl */ `
attribute vec3 aColor;
attribute float aSize;
uniform float uScale;
uniform float uPixelRatio;
uniform float uDist;
varying vec3 vColor;
varying float vFade;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = aSize * uScale * uPixelRatio / depth;
  vColor = aColor;
  // Depth cue relative to the object centre, so pulling the camera back doesn't dim everything.
  vFade = clamp(1.0 - (depth - uDist) * 0.28, 0.35, 1.0);
}`;

export const POINTS_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(vColor * a * vFade, a);
}`;

export function makeParticles(n: number, dpr: number) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const size = new Float32Array(n);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
  const uniforms = { uScale: { value: 1 }, uPixelRatio: { value: dpr }, uDist: { value: 6 } };
  const material = new THREE.ShaderMaterial({ vertexShader: POINTS_VERT, fragmentShader: POINTS_FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, material);
  const flush = () => {
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aColor.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
  };
  return { points, pos, col, size, uniforms, flush };
}

const UP = new THREE.Vector3(0, 1, 0);
export const SHAFT = new THREE.CylinderGeometry(0.014, 0.014, 1, 14).translate(0, 0.5, 0);
export const HEAD = new THREE.ConeGeometry(0.05, 0.16, 24);

export function makeArrow(color: number) {
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.25, transparent: true });
  const shaft = new THREE.Mesh(SHAFT, mat);
  const head = new THREE.Mesh(HEAD, mat);
  const g = new THREE.Group();
  g.add(shaft, head);
  const dir = new THREE.Vector3();
  return {
    g,
    mat,
    /** Draw from `from` along v. Hidden when faint or zero-length. */
    set(v: number[], opacity: number, from: number[] = [0, 0, 0]) {
      dir.set(v[0], v[1], v[2]);
      const len = dir.length();
      g.visible = opacity > 0.01 && len > 1e-3;
      if (!g.visible) return;
      mat.opacity = opacity;
      g.position.set(from[0], from[1], from[2]);
      const hl = Math.min(0.16, len * 0.4);
      shaft.scale.set(1, Math.max(1e-3, len - hl), 1);
      head.scale.set(1, hl / 0.16, 1);
      head.position.y = len - hl / 2;
      g.quaternion.setFromUnitVectors(UP, dir.normalize());
    },
    setColor(c: number) {
      mat.color.setHex(c);
      mat.emissive.setHex(c);
    },
  };
}

/** Free GPU memory for everything in a scene (shared arrow geometry is kept). */
export function disposeScene(scene: THREE.Scene) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry && mesh.geometry !== SHAFT && mesh.geometry !== HEAD) mesh.geometry.dispose();
    (mesh.material as THREE.Material | undefined)?.dispose?.();
  });
}

/** Drag to orbit (springing back to the framing) plus a little pointer parallax. */
export function orbitControls(el: HTMLElement) {
  const s = { yaw: 0, elev: 0, px: 0, py: 0, dragging: false };
  let lastX = 0;
  let lastY = 0;
  const down = (e: PointerEvent) => {
    s.dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    el.setPointerCapture?.(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const move = (e: PointerEvent) => {
    s.px = (e.clientX / window.innerWidth) * 2 - 1;
    s.py = (e.clientY / window.innerHeight) * 2 - 1;
    if (!s.dragging) return;
    s.yaw -= (e.clientX - lastX) * 0.006;
    s.elev = Math.max(-0.5, Math.min(0.5, s.elev + (e.clientY - lastY) * 0.004));
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const up = () => {
    s.dragging = false;
    el.style.cursor = "grab";
  };
  el.style.cursor = "grab";
  el.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  return {
    state: s,
    /** Call once per frame: eases the drag offset back to zero when released. */
    relax() {
      if (s.dragging) return;
      s.yaw *= 0.97;
      s.elev *= 0.97;
    },
    dispose() {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    },
  };
}
