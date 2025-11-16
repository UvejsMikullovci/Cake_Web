import React from "react";
import { Sphere } from "@react-three/drei";

export default function Cake({ layers }) {
  return (
    <group position={[0, -1, 0]}>
      {layers.map((layer, i) => {
        const heightOffset = layers
          .slice(0, i)
          .reduce((acc, l) => acc + l.height, 0);

        return (
          <mesh
            key={i}
            position={[0, heightOffset + layer.height / 2, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[layer.radius, layer.radius, layer.height, 48]} />
            <meshStandardMaterial color={layer.color} roughness={0.6} />
          </mesh>
        );
      })}

      <mesh position={[0, layers.reduce((a, l) => a + l.height, 0) + 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Sphere
        args={[0.15, 16, 16]}
        position={[0, layers.reduce((a, l) => a + l.height, 0) + 1.2, 0]}
      >
        <meshStandardMaterial
          emissive="#ffdf4f"
          color="#ffdf4f"
          emissiveIntensity={2}
        />
      </Sphere>
    </group>
  );
}