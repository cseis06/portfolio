"use client";

import { useRef, useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ---- Types ---- */

export interface Project {
  title: string;
  description: string;
  stack: string[];
  image: string;
  url?: string;
  year: string;
}

interface TVModelProps {
  project: Project;
  isDark: boolean;
}

/* ---- CRT Shader (simplified for compatibility) ---- */

const CRT_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CRT_FRAGMENT = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHasTexture;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vec2(1.0 - vUv.x, vUv.y);

    vec2 centered = uv * 2.0 - 1.0;
    float r2 = dot(centered, centered);
    vec2 d = centered * (1.0 + 0.03 * r2);
    vec2 fuv = d * 0.5 + 0.5;

    if (fuv.x < 0.0 || fuv.x > 1.0 || fuv.y < 0.0 || fuv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    vec3 col;
    if (uHasTexture > 0.5) {
      float ab = 0.002;
      col.r = texture2D(uTexture, fuv + vec2(ab, 0.0)).r;
      col.g = texture2D(uTexture, fuv).g;
      col.b = texture2D(uTexture, fuv - vec2(ab, 0.0)).b;
    } else {
      /* Classic TV static — bright, grainy, flickering */
      float n1 = hash(fuv * 500.0 + uTime * 6.0);
      float n2 = hash(fuv * 300.0 + uTime * 4.5 + 7.0);
      float n3 = hash(vec2(fuv.y * 100.0, uTime * 10.0));
      float grain = n1 * 0.6 + n2 * 0.3;
      /* Horizontal interference bands */
      grain += n3 * 0.1;
      col = vec3(grain * 0.7);
    }

    float scan = sin(fuv.y * 250.0) * 0.5 + 0.5;
    col *= mix(0.88, 1.0, scan);

    col += hash(fuv * 100.0 + fract(uTime * 2.0)) * 0.04 - 0.02;

    float sweep = fract(uTime * 0.08);
    col += smoothstep(0.05, 0.0, abs(fuv.y - sweep)) * 0.03;

    float vig = 1.0 - smoothstep(0.3, 0.85, length(centered * vec2(0.9, 1.1)));
    col *= vig;

    col *= vec3(0.95, 1.0, 0.93);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ---- Context Loss Recovery ---- */

function ContextGuard() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (e: Event) => {
      e.preventDefault();
      console.warn("[TV] WebGL context lost — will restore");
    };

    const handleRestored = () => {
      console.log("[TV] WebGL context restored");
    };

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl]);

  return null;
}

/* ---- TV Model with staged loading ---- */

function TVModel({ project, isDark }: TVModelProps) {
  const { scene } = useGLTF("/tv_small.glb");
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const hasSetup = useRef(false);

  /* Stages: 0=geometry only, 1=body textured, 2=screen shader active */
  const [stage, setStage] = useState(0);
  const crtMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const bodyTextureRef = useRef<THREE.Texture | null>(null);
  const screenTextureRef = useRef<THREE.Texture | null>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /* Stage 0: Auto-center, auto-scale, auto-orient, basic materials */
  useEffect(() => {
    if (hasSetup.current) return;

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    clonedScene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    if (innerRef.current) {
      innerRef.current.scale.setScalar(3 / maxDim);
    }

    /* Orient screen toward camera */
    let screenNormal = new THREE.Vector3();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.name === "TV_Small_Screen_Off" || mat.name.includes("Screen")) {
          const normals = child.geometry.attributes.normal;
          if (normals) {
            const avg = new THREE.Vector3();
            for (let i = 0; i < normals.count; i++) {
              avg.x += normals.getX(i);
              avg.y += normals.getY(i);
              avg.z += normals.getZ(i);
            }
            avg.normalize();
            screenNormal.copy(avg);
          }
        }
      }
    });

    if (screenNormal.length() > 0 && innerRef.current) {
      const quat = new THREE.Quaternion().setFromUnitVectors(screenNormal, new THREE.Vector3(0, 0, 1));
      innerRef.current.quaternion.copy(quat);
    }

    /* Apply basic flat materials first */
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const isScreen = mat.name === "TV_Small_Screen_Off" || mat.name.includes("Screen");
        if (isScreen) {
          child.material = new THREE.MeshBasicMaterial({ color: "#111111" });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: "#5c4a3a",
            roughness: 0.85,
            metalness: 0.02,
          });
        }
      }
    });

    hasSetup.current = true;

    /* Progress to stage 1 after a beat */
    setTimeout(() => setStage(1), 600);
  }, [clonedScene]);

  /* Stage 1: Load body texture */
  useEffect(() => {
    if (stage < 1) return;

    const loader = new THREE.TextureLoader();
    loader.load("/tv_small_body.png", (tex) => {
      tex.flipY = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      bodyTextureRef.current = tex;

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          if (mat.type === "MeshStandardMaterial" && !(mat as THREE.MeshStandardMaterial).map) {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              map: tex,
              roughness: 0.85,
              metalness: 0.02,
            });
          }
        }
      });

      /* Progress to stage 2 after texture is applied */
      setTimeout(() => setStage(2), 400);
    });
  }, [stage, clonedScene]);

  /* Stage 2: Create CRT shader and apply to screen */
  useEffect(() => {
    if (stage < 2) return;

    const mat = new THREE.ShaderMaterial({
      vertexShader: CRT_VERTEX,
      fragmentShader: CRT_FRAGMENT,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 },
        uHasTexture: { value: 0 },
      },
    });

    crtMaterialRef.current = mat;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.type === "MeshBasicMaterial") {
          child.material = mat;
        }
      }
    });

    /* Load the first project screenshot */
    loadProjectImage(project.image);
  }, [stage]);

  /* Load project screenshot into shader */
  const loadProjectImage = useCallback((imagePath: string) => {
    if (!crtMaterialRef.current) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      imagePath,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;

        if (screenTextureRef.current) {
          screenTextureRef.current.dispose();
        }
        screenTextureRef.current = tex;

        if (crtMaterialRef.current) {
          crtMaterialRef.current.uniforms.uTexture.value = tex;
          crtMaterialRef.current.uniforms.uHasTexture.value = 1.0;
        }
      },
      undefined,
      () => {
        if (crtMaterialRef.current) {
          crtMaterialRef.current.uniforms.uHasTexture.value = 0.0;
        }
      }
    );
  }, []);

  /* When project changes, swap screenshot */
  useEffect(() => {
    if (stage >= 2) {
      loadProjectImage(project.image);
    }
  }, [project.image, stage, loadProjectImage]);

  /* Animate shader time + idle sway */
  useFrame((state) => {
    if (crtMaterialRef.current) {
      crtMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/* ---- Channel Controls ---- */

interface ChannelControlsProps {
  projects: Project[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isDark: boolean;
}

function ChannelControls({ projects, currentIndex, onPrev, onNext, isDark }: ChannelControlsProps) {
  const textSoft = isDark ? "rgba(250,245,240,0.45)" : "rgba(26,22,20,0.4)";
  const textMuted = isDark ? "rgba(250,245,240,0.25)" : "rgba(26,22,20,0.2)";
  const project = projects[currentIndex];

  const btnStyle = {
    background: "transparent",
    border: `1px solid ${isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"}`,
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: textSoft,
    fontFamily: "var(--font-mono)",
    fontSize: 16,
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-6">
        <button onClick={onPrev} className="cursor-pointer transition-all duration-300" style={btnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"; e.currentTarget.style.color = textSoft; }}>‹</button>
        <div className="text-center" style={{ minWidth: 140 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", margin: "0 0 4px 0" }}>
            CH {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <p style={{ fontSize: 18, fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#dc2626", margin: 0 }}>{project.title}</p>
        </div>
        <button onClick={onNext} className="cursor-pointer transition-all duration-300" style={btnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"; e.currentTarget.style.color = textSoft; }}>›</button>
      </div>

      <div className="flex gap-2">
        {projects.map((_, i) => (
          <span key={i} className="block rounded-full transition-all duration-300" style={{ width: i === currentIndex ? 16 : 6, height: 6, background: i === currentIndex ? "#dc2626" : (isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"), borderRadius: 3 }} />
        ))}
      </div>

      <p className="text-center" style={{ fontSize: 13, lineHeight: 1.7, color: textSoft, fontFamily: "var(--font-display)", maxWidth: 420, transition: "color 0.5s" }}>{project.description}</p>

      <div className="flex flex-wrap justify-center gap-2">
        {project.stack.map((tech) => (
          <span key={tech} style={{ fontSize: 10, letterSpacing: "0.08em", padding: "4px 12px", borderRadius: 3, border: "1px solid rgba(220,38,38,0.2)", color: "rgba(220,38,38,0.5)", fontFamily: "var(--font-mono)" }}>{tech}</span>
        ))}
        <span style={{ fontSize: 10, letterSpacing: "0.08em", padding: "4px 12px", color: textMuted, fontFamily: "var(--font-mono)" }}>{project.year}</span>
      </div>

      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="no-underline transition-all duration-300"
          style={{ fontSize: 11, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", color: "#dc2626", borderBottom: "1px solid rgba(220,38,38,0.25)", paddingBottom: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "rgba(220,38,38,0.25)"; }}>
          Visit project →
        </a>
      )}
    </div>
  );
}

/* ---- Main Component ---- */

interface TVSceneProps {
  projects: Project[];
  isDark: boolean;
}

export default function TVScene({ projects, isDark }: TVSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => setCurrentIndex((i) => (i - 1 + projects.length) % projects.length);
  const handleNext = () => setCurrentIndex((i) => (i + 1) % projects.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div>
      <div style={{ width: "100%", height: "clamp(350px, 50vw, 550px)" }}>
        <Canvas
          camera={{ position: [0, 0.3, 4.5], fov: 50 }}
          dpr={1}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ background: "transparent" }}
        >
          <ContextGuard />

          <ambientLight intensity={isDark ? 1.6 : 2.2} />
          <directionalLight position={[4, 4, 5]} intensity={isDark ? 1 : 1.2} color="#faf0e6" />
          <directionalLight position={[-3, 2, 3]} intensity={0.3} color="#c4d4e0" />

          <Suspense fallback={null}>
            <TVModel project={projects[currentIndex]} isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      <ChannelControls
        projects={projects}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        isDark={isDark}
      />
    </div>
  );
}

useGLTF.preload("/tv_small.glb");