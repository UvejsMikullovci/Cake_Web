import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Cake from "./Cake";

export default function Scene({
  layers,
  cakeSize,
  decorations,
  message,
  sendAsGift,
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [4.5, 3.2, 6.2], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight
        skyColor={0xfff7f2}
        groundColor={0xf5d7c4}
        intensity={0.2}
      />

      <Environment preset="city" />

      <Cake
        layers={layers}
        cakeSize={cakeSize}
        decorations={decorations}
        message={message}
        sendAsGift={sendAsGift}
      />

      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minDistance={4}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}