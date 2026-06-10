'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Dynamically import Spline with SSR disabled to prevent hydration mismatches
// Spline relies on WebGL/Canvas which is browser-only
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

interface SplineSceneProps {
  scene: string
  className?: string
  fallbackSrc?: string
}

export function SplineScene({ scene, className, fallbackSrc }: SplineSceneProps) {
  const splineRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback timeout: if Spline hasn't loaded within 15 seconds, show the fallback
  useEffect(() => {
    if (!mounted || isLoaded) return;
    const timer = setTimeout(() => {
      setHasError(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [mounted, isLoaded]);

  const handleLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsLoaded(true);
    const brandColor = "#ED3F27";

    const possibleVariables = [
      "RobotColor",
      "robotColor",
      "PrimaryColor",
      "primaryColor",
      "MainColor",
      "mainColor",
      "BodyColor",
      "bodyColor",
      "Color",
      "color",
      "brandColor",
      "BrandColor"
    ];

    possibleVariables.forEach((variableName) => {
      try {
        splineApp.setVariable(variableName, brandColor);
      } catch {
        // Variable not exposed in the Spline scene — this is expected
      }
    });
  };

  // During SSR or before mount, render a static loading placeholder
  if (!mounted) {
    return (
      <div className={`${className || ''} flex items-center justify-center bg-surface-base/20 rounded-card`}>
        <div className="flex flex-col items-center gap-3">
          <span className="loader"></span>
          <span className="text-[10px] font-mono text-white-base/40 uppercase tracking-widest">Loading 3D...</span>
        </div>
      </div>
    );
  }

  // If Spline failed or errored, show fallback image
  if (hasError) {
    return (
      <div className={`${className || ''} relative flex items-center justify-center bg-surface-base/20 rounded-card overflow-hidden`}>
        {fallbackSrc ? (
          <Image
            src={fallbackSrc}
            alt="Robot Mascot"
            fill
            className="object-contain p-4"
            priority
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white-base/40">
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7.02 7.02 0 0 1 17 21h-5a7 7 0 0 1-6.73-5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            </svg>
            <span className="text-xs font-mono">3D Unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loader"></span>
            <span className="text-[10px] font-mono text-white-base/40 uppercase tracking-widest">Loading 3D...</span>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
      />
    </Suspense>
  )
}
