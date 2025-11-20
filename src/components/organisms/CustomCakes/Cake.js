import React from "react";
import { Text } from "@react-three/drei";
import Strawberry from "../../models/Strawberry";
import Candle from "../../models/Candle";

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

  const boxInnerHeight = totalHeight + 0.9;
  const boxWidth = baseRadius * 2.6;
  const boxDepth = boxWidth;

  return (
    <group position={[0, -1.2, 0]}>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
      >
        <circleGeometry args={[baseRadius * 1.8, 64]} />
        <meshStandardMaterial
          color="#fdf4ec"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <circleGeometry args={[baseRadius * 1.5, 48]} />
        <meshBasicMaterial color="#e0c8ba" />
      </mesh>

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

        {decorations.candles && (
          <group>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = (baseRadius - (layers.length - 1) * 0.18) * 0.78;
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;
              const rotY = angle + Math.PI / 2;

              return (
                <Candle
                  color="red"
                  key={i}
                  position={[x, -0.3, z]}
                  rotation={[0, rotY, 0]}
                  scale={0.3}
                />
              );
            })}
          </group>
        )}
        {decorations.strawberries && (
          <group>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;

              const offset = Math.PI / 8;

              const shiftedAngle = angle + offset;

              const r = (baseRadius - (layers.length - 1) * 0.18) * 0.78;
              const x = Math.cos(shiftedAngle) * r;
              const z = Math.sin(shiftedAngle) * r;
              const rotY = shiftedAngle + Math.PI / 2;

              return (
                <Strawberry
                  key={i}
                  position={[x, -0.02, z]}
                  rotation={[0, rotY, 0]}
                  scale={0.8}
                />
              );
            })}
          </group>
        )}

        {decorations.sprinkles && (
          <group>
            {Array.from({ length: 26 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const r =
                (baseRadius - (layers.length - 1) * 0.18) *
                (0.45 + Math.random() * 0.35);
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;

              const colors = ["#ffd166", "#06d6a0", "#ef476f", "#118ab2"];
              const c = colors[i % colors.length];

              return (
                <mesh key={i} position={[x, 0.04, z]}>
                  <boxGeometry args={[0.03, 0.015, 0.08]} />
                  <meshStandardMaterial color={c} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>

      {sendAsGift && (
        <group position={[0, 0.5, -3.4]}>
          <mesh castShadow>
            <boxGeometry args={[boxWidth * 0.9, 1.2, boxDepth * 0.9]} />
            <meshStandardMaterial color="#fef2f5" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[boxWidth * 0.92, 0.25, boxDepth * 0.92]} />
            <meshStandardMaterial color="#ff7e8b" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.1, 1.25, boxDepth * 0.92]} />
            <meshStandardMaterial color="#ff7e8b" />
          </mesh>
          <mesh>
            <boxGeometry args={[boxWidth * 0.92, 1.25, 0.1]} />
            <meshStandardMaterial color="#ff7e8b" />
          </mesh>
        </group>
      )}
    </group>
  );
}