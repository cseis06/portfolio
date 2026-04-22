"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ---- Types ---- */

export interface Project {
  title: string;
  description: string;
  stack: string[];
  url?: string;
  year: string;
}

interface TVModelProps {
  project: Project;
  isDark: boolean;
}

/* ---- CRT Screen Texture (Canvas2D) ---- */

function useCRTTexture(project: Project) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const timeRef = useRef(0);

  if (!canvasRef.current) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 384;
    canvasRef.current = c;
    textureRef.current = new THREE.CanvasTexture(c);
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;
  }

  useFrame((_, delta) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !textureRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;
    const W = canvas.width;
    const H = canvas.height;

    /* Background */
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    /* Lightweight noise — random small rects instead of per-pixel getImageData */
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    for (let i = 0; i < 120; i++) {
      const nx = Math.random() * W;
      const ny = Math.random() * H;
      ctx.fillRect(nx, ny, Math.random() * 3 + 1, Math.random() * 2 + 1);
    }

    /* Scanlines */
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let y = 0; y < H; y += 3) {
      ctx.fillRect(0, y, W, 1);
    }

    /* CRT sweep band */
    const sweepY = ((t * 0.15) % 1.4 - 0.2) * H;
    const sweepGrad = ctx.createLinearGradient(0, sweepY - 40, 0, sweepY + 40);
    sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
    sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.04)");
    sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(0, sweepY - 40, W, 80);

    const pad = 40;

    /* REC indicator */
    ctx.fillStyle = "rgba(220,38,38,0.7)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "right";
    ctx.fillText("\u25CF REC", W - pad, pad);

    /* Year */
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(project.year, pad, pad);

    /* Title */
    ctx.fillStyle = "#dc2626";
    ctx.font = "italic 42px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText(project.title, pad, H * 0.4);

    /* Description — word wrap */
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "13px monospace";
    const words = project.description.split(" ");
    let line = "";
    let lineY = H * 0.5;
    const maxWidth = W - pad * 2;

    for (const word of words) {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        ctx.fillText(line.trim(), pad, lineY);
        line = word + " ";
        lineY += 20;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), pad, lineY);

    /* Stack pills */
    ctx.font = "11px monospace";
    let pillX = pad;
    const pillY = H - pad - 10;
    project.stack.forEach((tech) => {
      const textW = ctx.measureText(tech).width + 16;
      ctx.strokeStyle = "rgba(220,38,38,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY - 14, textW, 22, 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(220,38,38,0.5)";
      ctx.fillText(tech, pillX + 8, pillY + 2);
      pillX += textW + 8;
    });

    /* Vignette */
    const vignetteGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.65);
    vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
    vignetteGrad.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, W, H);

    textureRef.current.needsUpdate = true;
  });

  return textureRef.current;
}

/* ---- TV Model ---- */

/*
 * TV Model — auto-centered and auto-oriented using bounding box + screen normals.
 * The model is centered at origin, scaled to ~3 units, and rotated so the screen faces the camera.
 */

function TVModel({ project, isDark }: TVModelProps) {
  const { scene } = useGLTF("/tv_model.glb");
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const screenTexture = useCRTTexture(project);
  const hasSetup = useRef(false);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /* Auto-center and auto-scale using bounding box */
  useEffect(() => {
    if (hasSetup.current) return;

    /* 1. Compute bounding box in model space */
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    /* 2. Center the model */
    clonedScene.position.sub(center);

    /* 3. Normalize scale — fit to ~3 units */
    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizedScale = 3 / maxDim;

    if (innerRef.current) {
      innerRef.current.scale.setScalar(normalizedScale);
    }

    /* 4. Find screen mesh and determine facing direction */
    let screenNormal = new THREE.Vector3();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const isScreen =
          mat.name === "Material #25" ||
          mat.name.includes("#25") ||
          (mat.color && mat.color.r < 0.3 && mat.color.g < 0.3 && mat.color.b < 0.3);

        if (isScreen) {
          /* Get average normal of screen mesh */
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

    /* 5. Calculate rotation to face screen toward camera (+Z) */
    if (screenNormal.length() > 0 && innerRef.current) {
      const target = new THREE.Vector3(0, 0, 1); // toward camera
      const quat = new THREE.Quaternion().setFromUnitVectors(screenNormal, target);
      innerRef.current.quaternion.copy(quat);
    }

    console.log("[TV Debug] center:", center);
    console.log("[TV Debug] size:", size);
    console.log("[TV Debug] screen normal:", screenNormal);
    console.log("[TV Debug] scale:", normalizedScale);

    hasSetup.current = true;
  }, [clonedScene]);

  /* Apply materials */
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const isScreen =
          mat.name === "Material #25" ||
          mat.name.includes("#25") ||
          (mat.color && mat.color.r < 0.3 && mat.color.g < 0.3 && mat.color.b < 0.3);

        /* Recompute smooth normals for less chunky look */
        child.geometry.computeVertexNormals();

        if (isScreen) {
          child.material = new THREE.MeshBasicMaterial({
            map: screenTexture,
            toneMapped: false,
          });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: isDark ? "#5c4a3a" : "#7a6550",
            roughness: 0.75,
            metalness: 0.05,
            flatShading: false,
          });
        }
      }
    });
  }, [clonedScene, screenTexture, isDark]);

  /* Subtle idle animation */
  useFrame((state) => {
    if (!outerRef.current) return;
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.y = Math.sin(t * 0.3) * 0.06;
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
  const textPrimary = isDark ? "rgba(250,245,240,0.8)" : "rgba(26,22,20,0.85)";

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-6">
        <button
          onClick={onPrev}
          className="cursor-pointer transition-all duration-300"
          style={{
            background: "transparent",
            border: `1px solid ${isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"}`,
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textSoft,
            fontFamily: "var(--font-mono)",
            fontSize: 16,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"; e.currentTarget.style.color = textSoft; }}
        >
          ‹
        </button>

        <div className="text-center" style={{ minWidth: 120 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(220,38,38,0.4)", fontFamily: "var(--font-mono)", margin: "0 0 4px 0" }}>
            CH {String(currentIndex + 1).padStart(2, "0")}
          </p>
          <p style={{ fontSize: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", color: textPrimary, margin: 0, transition: "color 0.5s" }}>
            {projects[currentIndex].title}
          </p>
        </div>

        <button
          onClick={onNext}
          className="cursor-pointer transition-all duration-300"
          style={{
            background: "transparent",
            border: `1px solid ${isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"}`,
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textSoft,
            fontFamily: "var(--font-mono)",
            fontSize: 16,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"; e.currentTarget.style.color = textSoft; }}
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {projects.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? 16 : 6,
              height: 6,
              background: i === currentIndex ? "#dc2626" : (isDark ? "rgba(250,245,240,0.1)" : "rgba(26,22,20,0.1)"),
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      {/* Project link */}
      {projects[currentIndex].url && (
        <a
          href={projects[currentIndex].url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-all duration-300"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-mono)",
            color: "#dc2626",
            borderBottom: "1px solid rgba(220,38,38,0.25)",
            paddingBottom: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "#dc2626"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "rgba(220,38,38,0.25)"; }}
        >
          Visit project →
        </a>
      )}
    </div>
  );
}

/* ---- Main Exported Component ---- */

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
          camera={{ position: [0, 45, 4], fov: 4 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          {/* 3-point lighting */}
          <ambientLight intensity={isDark ? 0.4 : 0.6} />
          <directionalLight position={[4, 4, 5]} intensity={isDark ? 0.8 : 1} color="#faf0e6" />
          <directionalLight position={[-3, 2, 3]} intensity={0.3} color="#c4d4e0" />
          <pointLight position={[0, -1, 3]} intensity={0.15} color="#dc2626" distance={8} />

          <TVModel project={projects[currentIndex]} isDark={isDark} />
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

useGLTF.preload("/tv_model.glb");