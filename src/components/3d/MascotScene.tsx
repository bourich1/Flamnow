"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Preload } from "@react-three/drei";
import MascotModel from "./MascotModel";
import { useMouseFollow } from "@/hooks/useMouseFollow";

export default function MascotScene() {
  const { mouse, isMobile } = useMouseFollow();

  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.5], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      shadows
      className="!absolute !inset-0"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Transparent background via gl={{ alpha: true }} */}

      {/* Ambient light for general soft illumination */}
      <ambientLight intensity={0.6} />

      {/* Directional light to create highlights and cast shadows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Soft fill light from the opposite side */}
      <directionalLight position={[-5, 5, 2]} intensity={0.4} />

      {/* Dynamic theme rim light (Flamnow Red) to create a premium glow effect */}
      <pointLight position={[-4, 4, -3]} intensity={1.5} color="#ed3f27" />
      <pointLight position={[4, -4, 3]} intensity={0.5} color="#ed3f27" />

      <Suspense fallback={null}>
        <MascotModel mouse={mouse} isMobile={isMobile} />
        {/* Ground contact shadow */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.35}
          scale={5}
          blur={2.8}
          far={3}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
