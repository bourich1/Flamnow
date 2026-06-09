"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

interface MascotModelProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isMobile: React.MutableRefObject<boolean>;
}

export default function MascotModel({ mouse, isMobile }: MascotModelProps) {
  // Load the GLB model
  const { scene } = useGLTF("/models/sample.glb");
  const modelRef = useRef<THREE.Group>(null);
  const targetScale = useRef<number>(6.2);
  const currentScale = useRef<number>(0);

  // Find a head mesh or bone if it exists
  const headRef = useRef<THREE.Object3D | null>(null);

  // Make the scene background transparent
  const { gl, scene: threeScene } = useThree();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    threeScene.background = null;
    gl.setClearColor(0x000000, 0);
  }, [gl, threeScene]);

  useEffect(() => {
    // Traverse the scene to find any node that looks like a head/neck/face
    let foundHead: THREE.Object3D | null = null;
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if (
        name.includes("head") ||
        name.includes("skull") ||
        name.includes("face") ||
        name.includes("neck")
      ) {
        foundHead = child;
      }
    });

    if (foundHead) {
      headRef.current = foundHead;
    }

    // Set materials to cast and receive shadows if possible
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Entrance Scale-in Animation
    if (currentScale.current < targetScale.current) {
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale.current,
        0.05
      );
      if (modelRef.current) {
        modelRef.current.scale.setScalar(currentScale.current);
      }
    }

    if (!modelRef.current) return;

    // 2. Base Y position — shift model down to center it in the frame
    const baseY = -0.5;

    // 3. Subtle Idle Animations
    // Floating Y-axis motion (smooth sine wave)
    const floatOffset = Math.sin(time * 1.5) * 0.06;
    modelRef.current.position.y = baseY + floatOffset;

    // Soft breathing scale oscillation
    const breatheScale = currentScale.current * (1 + Math.sin(time * 2.0) * 0.012);
    modelRef.current.scale.setScalar(breatheScale);

    // Subtle breathing rotation on Z-axis
    modelRef.current.rotation.z = Math.sin(time * 0.8) * 0.015;

    // 4. Mouse Follow Rotation
    // Clamp coordinates to keep rotation looking natural
    const targetX = mouse.current.x * 0.35; // Max ~20 degrees horizontal rotation
    const targetY = mouse.current.y * 0.2;  // Max ~11 degrees vertical rotation

    if (isMobile.current) {
      // Very subtle idle rotation on mobile, no mouse tracking
      const mobileIdleX = Math.sin(time * 0.8) * 0.04;
      const mobileIdleY = Math.cos(time * 0.6) * 0.025;
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        mobileIdleX,
        0.05
      );
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        mobileIdleY,
        0.05
      );
    } else {
      // Check if we rotate a specific head part or the whole model
      if (headRef.current) {
        // Rotate only the head bone/mesh
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          targetX,
          0.1
        );
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          -targetY,
          0.1
        );
      } else {
        // Rotate the entire mascot group subtly
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          modelRef.current.rotation.y,
          targetX,
          0.08
        );
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          -targetY,
          0.08
        );
      }
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.5, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

// Preload the GLB model
useGLTF.preload("/models/sample.glb");
