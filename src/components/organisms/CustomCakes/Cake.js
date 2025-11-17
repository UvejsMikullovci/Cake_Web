import React from "react";
import { Text } from "@react-three/drei";

const BASE_COLORS = {
  vanilla: "#f5d8a9",
  chocolate: "#8b4a2b",
  redVelvet: "#b0343c",
  strawberryCake: "#f7a6b8",
};

const FROSTING_COLORS = {
  vanilla: "#fff7ea",
  chocolate: "#5a2e1a",
  strawberry: "#ffd1df",
  lemon: "#fff4b8",
};

const FILLING_COLORS = {
  vanilla: "#f9ead7",
  chocolate: "#6c3b26",
  strawberry: "#ffb3c6",
  hazelnut: "#c28b5a",
};

const SIZE_RADIUS = {
  small: 1.1,
  medium: 1.4,
  large: 1.8,
};

export default function Cake({
  layers,
  cakeSize,
  decorations,
  message,
  sendAsGift,
}) {
  const baseRadius = SIZE_RADIUS[cakeSize] ?? 1.4;
  const radialSegments = 64;

  const totalHeight = layers.reduce((sum, l) => sum + l.height, 0);
  const topLayerYOffset = layers
    .slice(0, layers.length - 1)
    .reduce((sum, l) => sum + l.height, 0);
  const topLayerHeight = layers[layers.length - 1].height;
  const topY = topLayerYOffset + topLayerHeight / 2;

  const boxWidth = baseRadius * 2.6;
  const boxDepth = boxWidth;
  const boxInnerHeight = totalHeight + 0.9;
  const boxBaseHeight = 0.35;

  return (
    <group position={[0, -1.2, 0]}>
      {sendAsGift && (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[boxWidth, 0.3, boxDepth]} />
            <meshStandardMaterial color="#f7e3d7" roughness={0.9} />
          </mesh>

          <mesh position={[0, boxInnerHeight / 2 + 0.2, 0]}>
            <boxGeometry args={[boxWidth * 1.1, boxInnerHeight, boxDepth * 1.1]} />
            <meshPhysicalMaterial
              transparent={true}
              opacity={0.12}
              roughness={0}
              metalness={0}
              transmission={1}
              thickness={0.25}
              ior={1.2}
              color="#ffffff"
            />
          </mesh>

          <mesh position={[0, boxInnerHeight + 0.35, 0]}>
            <torusGeometry args={[boxWidth * 0.42, 0.08, 16, 40]} />
            <meshStandardMaterial color="#ff7e8b" roughness={0.2} />
          </mesh>

          <group position={[0, boxInnerHeight + 0.42, 0]}>
            <mesh rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[0.14, 0.38, 0.12]} />
              <meshStandardMaterial color="#ff7e8b" />
            </mesh>

            <mesh rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.14, 0.38, 0.12]} />
              <meshStandardMaterial color="#ff7e8b" />
            </mesh>
          </group>
        </group>
      )}

      {layers.map((layer, index) => {
        const radius = baseRadius - index * 0.18;
        const height = layer.height;

        const baseColor = BASE_COLORS[layer.baseFlavor];
        const frostingColor = FROSTING_COLORS[layer.frostingFlavor];
        const fillingColor = FILLING_COLORS[layer.fillingFlavor];

        const yOffset = layers
          .slice(0, index)
          .reduce((sum, l) => sum + l.height, 0);

        const cakeBodyY = yOffset + height / 2;
        const frostingTopY = yOffset + height + 0.08;

        return (
          <group key={layer.id}>
            <mesh
              position={[0, cakeBodyY, 0]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[radius, radius * 0.98, height, radialSegments, 2]}
              />
              <meshStandardMaterial
                color={baseColor}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>

            <mesh position={[0, frostingTopY, 0]} castShadow>
              <cylinderGeometry
                args={[radius * 1.02, radius * 0.98, 0.18, radialSegments, 1]}
              />
              <meshStandardMaterial
                color={frostingColor}
                roughness={0.55}
                metalness={0.08}
              />
            </mesh>

            <group position={[0, frostingTopY + 0.08, 0]}>
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (i / 18) * Math.PI * 2;
                const r = radius * 1.02;
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                return (
                  <mesh key={i} position={[x, 0, z]} castShadow>
                    <sphereGeometry args={[0.07, 18, 18]} />
                    <meshStandardMaterial
                      color={frostingColor}
                      roughness={0.5}
                      metalness={0.1}
                    />
                  </mesh>
                );
              })}
            </group>

            {layer.frostingFlavor === "chocolate" && (
              <group>
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle =
                    (i / 12) * Math.PI * 2 + (index * Math.PI) / 16;
                  const r = radius * 1.01;
                  const dripLength = 0.15 + Math.random() * 0.16;
                  const x = Math.cos(angle) * r;
                  const z = Math.sin(angle) * r;

                  return (
                    <mesh
                      key={i}
                      position={[x, frostingTopY - dripLength / 2, z]}
                      castShadow
                    >
                      <cylinderGeometry
                        args={[0.032, 0.028, dripLength, 10]}
                      />
                      <meshStandardMaterial
                        color={FROSTING_COLORS.chocolate}
                        roughness={0.35}
                        metalness={0.2}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}

            {decorations.slice && (
              <mesh
                position={[0, cakeBodyY, radius * 0.01]}
                rotation={[0, Math.PI / 2, 0]}
                castShadow
              >
                <cylinderGeometry
                  args={[
                    radius * 0.72,
                    radius * 0.72,
                    height * 0.75,
                    48,
                    1,
                    false,
                    Math.PI * 0.4,
                    Math.PI * 0.2,
                  ]}
                />
                <meshStandardMaterial
                  color={fillingColor}
                  roughness={0.82}
                  metalness={0.02}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <group position={[0, topY + topLayerHeight / 2 + 0.24, 0]}>
        {message && (
          <Text
            position={[0, 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.32}
            maxWidth={baseRadius * 2.1}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#5a2e1a"
            color="#ffffff"
          >
            {message}
          </Text>
        )}

        {decorations.candles && (
          <group>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = (baseRadius - (layers.length - 1) * 0.18) * 0.7;
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;
              return (
                <group key={i} position={[x, 0.15, z]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
                    <meshStandardMaterial color="#ffffff" />
                  </mesh>
                  <mesh position={[0, 0.25, 0]}>
                    <coneGeometry args={[0.06, 0.1, 12]} />
                    <meshStandardMaterial
                      emissive="#ffdd55"
                      color="#ffdd55"
                      emissiveIntensity={2}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {decorations.strawberries && (
          <group>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = (baseRadius - (layers.length - 1) * 0.18) * 0.9;
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;

              return (
                <group key={i} position={[x, 0.22, z]}>
                  {/* Strawberry Body */}
                  <mesh castShadow>
                    <sphereGeometry args={[0.1, 50, 50]} />
                    <meshPhysicalMaterial
                      color="#d5303e"
                      roughness={0.25}
                      metalness={0.15}
                      clearcoat={1}
                      clearcoatRoughness={0.15}
                      reflectivity={1}
                      sheen={1}
                      sheenRoughness={0.3}
                    />
                  </mesh>

                  {/* Seeds */}
                  {Array.from({ length: 32 }).map((_, j) => {
                    const seedAngle = Math.random() * Math.PI * 2;
                    const seedHeight = Math.random() * 0.15 - 0.05;

                    const sx = Math.cos(seedAngle) * 0.085;
                    const sz = Math.sin(seedAngle) * 0.085;

                    return (
                      <mesh
                        key={j}
                        position={[sx, seedHeight, sz]}
                        scale={[1, 1.4, 1]}
                      >
                        <sphereGeometry args={[0.008, 8, 8]} />
                        <meshStandardMaterial
                          color="#ffef8b"
                          roughness={0.3}
                          metalness={0.2}
                        />
                      </mesh>
                    );
                  })}

                  {/* Leaf Crown */}
                  {Array.from({ length: 5 }).map((_, k) => {
                    const leafAngle = (k / 5) * Math.PI * 2;
                    const lx = Math.cos(leafAngle) * 0.04;
                    const lz = Math.sin(leafAngle) * 0.04;

                    return (
                      <mesh key={k} position={[lx, 0.13, lz]} rotation={[0.4, 0, leafAngle]}>
                        <coneGeometry args={[0.04, 0.12, 8]} />
                        <meshStandardMaterial
                          color="#2e9e4f"
                          roughness={0.5}
                          metalness={0.1}
                        />
                      </mesh>
                    );
                  })}

                  {/* Stem */}
                  <mesh position={[0, 0.19, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
                    <meshStandardMaterial color="#3d7f3a" roughness={0.6} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}
        {decorations.sprinkles && (
          <group>
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;

              const r =
                (baseRadius - (layers.length - 1) * 0.18) *
                (0.82 + Math.random() * 0.18);

              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;

              const colors = ["#ffd166", "#06d6a0", "#ef476f", "#118ab2"];
              const c = colors[i % colors.length];

              return (
                <mesh key={i} position={[x, 0.12, z]}>
                  <boxGeometry args={[0.03, 0.015, 0.08]} />
                  <meshStandardMaterial color={c} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    </group>
  );
}