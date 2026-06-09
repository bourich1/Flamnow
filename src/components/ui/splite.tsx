'use client'

import { Suspense, lazy, useRef } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<any>(null);

  const handleLoad = (splineApp: any) => {
    splineRef.current = splineApp;
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
        // Attempt to set the variable. Note: If the Spline file was not exported
        // with this variable name exposed in the Spline Editor, this will fail or do nothing.
        splineApp.setVariable(variableName, brandColor);
      } catch {
        console.warn(`Spline variable "${variableName}" was not found or could not be updated.`);
      }
    });

    // NOTE TO USER: If the robot color does not change, it means the imported Spline scene
    // does not expose these variables. You will need to remix/edit the scene in the Spline
    // Editor (https://spline.design), configure the variables or recolor the materials directly,
    // and export a new .splinecode URL.
  };

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
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
