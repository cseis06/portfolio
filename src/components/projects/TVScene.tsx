"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import TVModel from "./TVModel";

export default function TVScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-3, 2, 3]} intensity={1.4} color="#ffe4c0" />
      <directionalLight position={[10, 0, -4]} intensity={1.5} color="#5a3838" />

      <Suspense fallback={null}>
        <TVModel />
      </Suspense>
    </Canvas>
  );
}