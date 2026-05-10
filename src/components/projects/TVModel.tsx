"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useProjectsStore } from "@/lib/stores/projectsStore";
import { projects } from "@/lib/data/projects";

useGLTF.preload("/models/old_tv.glb");
useTexture.preload(projects.map((p) => p.image));

// === CALIBRATION ======================================================
// Normalized space: model fits a 1×1×1 cube at origin.
// SCREEN_POSITION[2] must be IN FRONT of the TV's screen geometry.
// Check the console log on first load — `frontFaceZ` tells you what
// value to start above. A small forward bias (~0.005) avoids z-fighting.
const SCREEN_POSITION: [number, number, number] = [0.21, 0.11, 0.241];
const SCREEN_SIZE: [number, number] = [0.765, 0.615];

const REST_POSITION: [number, number, number] = [-0.2, 0, 0];

// === DEBUG MODES ======================================================
// "off"     — production rendering (default)
// "xray"    — TV becomes 30% opaque so you can see plane placement
// "wires"   — TV hidden, only magenta wireframe shows where screen will be
const DEBUG_MODE: "off" | "xray" | "wires" = "off";

const MODEL_FORWARD_OFFSET = -Math.PI / 2;

// =====================================================================

const staticVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const staticFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  void main() {
    if (uOpacity < 0.001) discard;
    vec2 grid = vUv * vec2(180.0, 130.0);
    float n = random(floor(grid) + uTime * vec2(73.13, 41.83));
    float scan = sin(vUv.y * 700.0) * 0.04 + 0.96;
    vec3 col = vec3(n) * scan;
    col = mix(col, col * vec3(0.92, 0.95, 1.05), 0.35);
    gl_FragColor = vec4(col, uOpacity);
  }
`;

export default function TVModel() {
  const groupRef = useRef<THREE.Group>(null);
  const staticMatRef = useRef<THREE.ShaderMaterial>(null);
  const { scene } = useGLTF("/models/old_tv.glb");

  const textures = useTexture(projects.map((p) => p.image));

  useEffect(() => {
    if (!textures || textures.length === 0) return;
    const screenAspect = SCREEN_SIZE[0] / SCREEN_SIZE[1];

    textures.forEach((t) => {
      // Narrow t.image to HTMLImageElement. drei's useTexture always
      // produces HTMLImageElement for jpg/png sources, but the Three.js
      // type is loose ({} since it could be any kind of image source).
      if (!(t.image instanceof HTMLImageElement)) return;

      t.colorSpace = THREE.SRGBColorSpace;
      const imgAspect = t.image.width / t.image.height;

      if (imgAspect > screenAspect) {
        const scale = screenAspect / imgAspect;
        t.repeat.set(scale, 1);
        t.offset.set((1 - scale) / 2, 0);
      } else {
        const scale = imgAspect / screenAspect;
        t.repeat.set(1, scale);
        t.offset.set(0, (1 - scale) / 2);
      }
      t.needsUpdate = true;
    });
  }, [textures]);

  // Normalize model + apply debug material overrides if requested.
  // The xray/wires modes traverse the model's meshes and clone their
  // materials so we can mutate transparency without breaking other
  // mounts of the same cached scene.
  const { normOffset, normScale } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const s = 1 / Math.max(size.x, size.y, size.z);

    if (process.env.NODE_ENV === "development") {
      // Front face Z in normalized post-recenter space:
      // = (max corner z * s) when center is at origin = (size.z * s) / 2
      const frontFaceZ = (size.z * s) / 2;
      console.log("[TVModel] bounds:", {
        rawSize: size.toArray().map((v) => v.toFixed(3)),
        normalizedSize: size.toArray().map((v) => (v * s).toFixed(3)),
        frontFaceZ: frontFaceZ.toFixed(3),
        suggestion: `Try SCREEN_POSITION[2] ≈ ${(frontFaceZ + 0.005).toFixed(3)}`,
      });
    }

    // Apply debug mode by mutating cloned materials on each mesh.
    if (DEBUG_MODE !== "off") {
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mat = (obj.material as THREE.Material).clone();
        if (DEBUG_MODE === "xray") {
          mat.transparent = true;
          mat.opacity = 0.3;
          mat.depthWrite = false;
        } else if (DEBUG_MODE === "wires") {
          obj.visible = false;
        }
        obj.material = mat;
      });
    }

    return {
      normOffset: center
        .clone()
        .multiplyScalar(-s)
        .toArray() as [number, number, number],
      normScale: s,
    };
  }, [scene]);

  const isTransitioning = useProjectsStore((s) => s.isTransitioning);
  const isReady = useProjectsStore((s) => s.isReady);
  const setReady = useProjectsStore((s) => s.setReady);
  const currentChannel = useProjectsStore((s) => s.currentChannel);
  const powerState = useProjectsStore((s) => s.powerState);
  const isPaused = useProjectsStore((s) => s.isPaused);
  const currentTexture = textures[currentChannel - 1] ?? textures[0];

  useEffect(() => {
    if (!groupRef.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      groupRef.current.position.set(...REST_POSITION);
      groupRef.current.rotation.y = 0;
      setReady(true);
      return;
    }

    groupRef.current.position.set(3.5, -1.5, 0);
    groupRef.current.rotation.y = -Math.PI / 5;

    const tl = gsap.timeline({ onComplete: () => setReady(true) });
    tl.to(groupRef.current.position, {
      x: REST_POSITION[0],
      y: REST_POSITION[1],
      duration: 1.4,
      ease: "power3.out",
    })
      .to(
        groupRef.current.rotation,
        { y: 0, duration: 0.95, ease: "power2.inOut" },
        "-=0.5"
      )
      .to(groupRef.current.position, {
        y: REST_POSITION[1] + 0.04,
        duration: 0.13,
        ease: "power1.out",
        yoyo: true,
        repeat: 1,
      })
      .to({}, { duration: 0.35 });
  }, [setReady]);

  useFrame((state, delta) => {
    const mat = staticMatRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Static plane visibility:
    //   off    → 0 (screen is plain black, image plane handles it)
    //   paused → 0 (image holds, no noise)
    //   normal → 0 unless transitioning or warming up
    let target: number;
    if (powerState === "off") {
      target = 0;
    } else if (isPaused) {
      target = 0;
    } else if (!isReady || isTransitioning) {
      target = 1;
    } else {
      target = 0;
    }

    const speed = isTransitioning || !isReady ? 25 : 15;
    mat.uniforms.uOpacity.value = THREE.MathUtils.damp(
      mat.uniforms.uOpacity.value,
      target,
      speed,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      <group position={normOffset} scale={normScale} rotation={[0, MODEL_FORWARD_OFFSET, 0]}>
        <primitive object={scene} />
    </group>

      {/* PROJECT IMAGE — must be in front of TV screen geom */}
      <mesh position={SCREEN_POSITION} renderOrder={1}>
        <planeGeometry args={SCREEN_SIZE} />
        <meshBasicMaterial
          map={powerState === "off" ? null : currentTexture}
          color={powerState === "off" ? "#000000" : "#ffffff"}
          toneMapped={false}
          transparent
          opacity={powerState === "off" ? 1 : 0.75}
        />
      </mesh>

      {/* STATIC — sits 5mm forward of the image */}
      <mesh
        position={[
          SCREEN_POSITION[0],
          SCREEN_POSITION[1],
          SCREEN_POSITION[2] + 0.005,
        ]}
        renderOrder={2}
      >
        <planeGeometry args={SCREEN_SIZE} />
        <shaderMaterial
          ref={staticMatRef}
          vertexShader={staticVertexShader}
          fragmentShader={staticFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: 1 },
          }}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* DEBUG WIRES: bright magenta plane shows where SCREEN_POSITION points.
          Renders even when DEBUG_MODE is "off" if you want a quick check —
          just flip the conditional. */}
      {DEBUG_MODE === "wires" && (
        <mesh position={SCREEN_POSITION}>
          <planeGeometry args={SCREEN_SIZE} />
          <meshBasicMaterial
            color="#ff00ff"
            wireframe
            depthTest={false}
          />
        </mesh>
      )}
    </group>
  );
}