import React from "react";
import { Text } from "@react-three/drei";
import Strawberry from "../../models/Strawberry";
import Candle from "../../models/Candle";
import Oreo from "../../models/Oreo";

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

const SPRINKLE_COLORS = [
  "#ff6f91",
  "#ffd166",
  "#06d6a0",
  "#4cc9f0",
  "#ff9e9e",
  "#f7a6b8",
];

export default function Cake({
  layers,
  cakeSize,
  decorations,
  sendAsGift,
  message,
  textSize,
}) {
  const baseRadius = SIZE_RADIUS[cakeSize] ?? 1.4;
  const radialSegments = 64;

  const topLayerYOffset = layers
    .slice(0, layers.length - 1)
    .reduce((sum, l) => sum + l.height, 0);

  const topLayerHeight = layers[layers.length - 1].height;
  const topY = topLayerYOffset + topLayerHeight / 2;

  const boxWidth = baseRadius * 2.6;
  const boxDepth = boxWidth;

  return (
    <group position={[0, -1.2, 0]}>
      {/* Table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[baseRadius * 1.8, 64]} />
        <meshStandardMaterial color="#fdf4ec" roughness={0.8} />
      </mesh>

      {/* Cake Layers */}
      {layers.map((layer, index) => {
        const radius = baseRadius - index * 0.18;
        const height = layer.height;

        const baseColor = BASE_COLORS[layer.baseFlavor];
        const frostingColor = FROSTING_COLORS[layer.frostingFlavor];

        const yOffset = layers.slice(0, index).reduce((s, l) => s + l.height, 0);

        const cakeBodyY = yOffset + height / 2;
        const frostingTopY = yOffset + height + 0.08;

        const useFullFrosting =
          decorations.fullFrosting === true ? frostingColor : baseColor;
        const topFrostingColor =
          decorations.fullFrosting === true ? frostingColor : frostingColor;

        return (
          <group key={layer.id}>
            {/* Cake Body (Base or Full Frosting Color) */}
            <mesh position={[0, cakeBodyY, 0]} castShadow receiveShadow>
              <cylinderGeometry
                args={[radius, radius, height, radialSegments, 2]}
              />
              <meshStandardMaterial
                color={useFullFrosting}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>

            {/* Top Frosting (always visible) */}
            <mesh position={[0, frostingTopY, 0]} castShadow>
              <cylinderGeometry
                args={[radius * 1.02, radius * 1.01, 0.18, radialSegments]}
              />
              <meshStandardMaterial
                color={topFrostingColor}
                roughness={0.55}
                metalness={0.08}
              />
            </mesh>

            {/* Rope Balls Around */}
            <group position={[0, frostingTopY + 0.08, 0]}>
              {Array.from({ length: 18 }).map((_, i2) => {
                const angle = (i2 / 18) * Math.PI * 2;
                const rPos = radius * 1.02;
                return (
                  <mesh
                    key={i2}
                    position={[Math.cos(angle) * rPos, 0, Math.sin(angle) * rPos]}
                  >
                    <sphereGeometry args={[0.07, 18, 18]} />
                    <meshStandardMaterial
                      color={topFrostingColor}
                      roughness={0.5}
                    />
                  </mesh>
                );
              })}
            </group>
          </group>
        );
      })}

      {/* Decorations container */}
      <group position={[0, topY + topLayerHeight / 2 + 0.24, 0]}>
        {/* Sprinkles */}
        {decorations.sprinkles && (
          <group>
            {Array.from({ length: 220 }).map((_, i) => {
              const inner = baseRadius * 0.55;   // inner part of the ring
              const outer = baseRadius * 0.85;   // outer part
              const r = inner + Math.random() * (outer - inner); // RANGE radius

              const angle = Math.random() * Math.PI * 2;
              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;

              return (
                <mesh
                  key={i}
                  position={[x, -0.08, z]}
                  rotation={[
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                  ]}
                >
                  <cylinderGeometry args={[0.015, 0.015, 0.07, 12]} />
                  <meshStandardMaterial
                    color={
                      SPRINKLE_COLORS[
                      Math.floor(Math.random() * SPRINKLE_COLORS.length)
                      ]
                    }
                  />
                </mesh>
              );
            })}
          </group>
        )}
        {/* Candles */}
        {decorations.candles && (
          <group>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = baseRadius * 0.78;

              return (
                <Candle
                  key={i}
                  color={decorations.candleColor || "red"}
                  position={[Math.cos(angle) * r, -0.3, Math.sin(angle) * r]}
                  rotation={[0, angle + Math.PI / 2, 0]}
                  scale={0.3}
                />
              );
            })}
          </group>
        )}

        {/* Strawberries / Oreos */}
        {(decorations.strawberries || decorations.oreos) && (
          <group>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
              const r = baseRadius * 0.78;

              let Comp = null;
              if (decorations.strawberries && decorations.oreos)
                Comp = i % 2 === 0 ? Strawberry : Oreo;
              else if (decorations.strawberries) Comp = Strawberry;
              else if (decorations.oreos) Comp = Oreo;

              return (
                <Comp
                  key={i}
                  position={[Math.cos(angle) * r, -0.02, Math.sin(angle) * r]}
                  rotation={[0, angle + Math.PI / 2, 0]}
                  scale={Comp === Oreo ? 0.35 : 0.8}
                />
              );
            })}
          </group>
        )}

        {/* Cake Top Text */}
        {message && message.length > 0 && (
          <Text
            position={[0, topLayerHeight + -0.55, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.32}
            maxWidth={baseRadius * 1.4}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            lineHeight={1.2}
            color="#ff6f91"
          >
            {message}
          </Text>
        )}
      </group>

      {/* Gift Box */}
      {sendAsGift && (
        <group position={[0, 0.5, -4.4]}>
          <mesh castShadow>
            <boxGeometry args={[boxWidth * 0.9, 1.2, boxDepth * 0.9]} />
            <meshStandardMaterial color="#fef2f5" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[boxWidth * 0.92, 0.25, boxDepth * 0.92]} />
            <meshStandardMaterial color="#ff7e8b" />
          </mesh>
        </group>
      )}
    </group>
  );
}