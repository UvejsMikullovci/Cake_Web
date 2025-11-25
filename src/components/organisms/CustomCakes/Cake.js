import React from "react";
import { Text3D } from "@react-three/drei";
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
      {/* PLATE */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
      >
        <circleGeometry args={[baseRadius * 1.8, 64]} />
        <meshStandardMaterial color="#fdf4ec" roughness={0.8} metalness={0.05} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <circleGeometry args={[baseRadius * 1.5, 48]} />
        <meshBasicMaterial color="#e0c8ba" />
      </mesh>

      {/* LAYERS */}
      {layers.map((layer, index) => {
        const radius = baseRadius - index * 0.18;
        const height = layer.height;

        const baseColor = BASE_COLORS[layer.baseFlavor];
        const frostingColor = FROSTING_COLORS[layer.frostingFlavor];

        const yOffset = layers.slice(0, index).reduce((s, l) => s + l.height, 0);

        const cakeBodyY = yOffset + height / 2;
        const frostingTopY = yOffset + height + 0.08;

        return (
          <group key={layer.id}>
            {/* Cake Body */}
            <mesh position={[0, cakeBodyY, 0]} castShadow receiveShadow>
              <cylinderGeometry
                args={[radius, radius * 0.98, height, radialSegments, 2]}
              />
              <meshStandardMaterial
                color={baseColor}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>

            {/* Frosting Cap */}
            <mesh position={[0, frostingTopY, 0]} castShadow>
              <cylinderGeometry
                args={[radius * 1.02, radius * 1.01, 0.18, radialSegments, 1]}
              />
              <meshStandardMaterial
                color={frostingColor}
                roughness={0.55}
                metalness={0.08}
              />
            </mesh>

            {/* Frosting Balls */}
            <group position={[0, frostingTopY + 0.08, 0]}>
              {Array.from({ length: 18 }).map((_, i2) => {
                const angle = (i2 / 18) * Math.PI * 2;
                const rPos = radius * 1.02;
                const x = Math.cos(angle) * rPos;
                const z = Math.sin(angle) * rPos;
                return (
                  <mesh key={i2} position={[x, 0, z]} castShadow>
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
          </group>
        );
      })}

      {/* TOP DECORATIONS */}
      <group position={[0, topY + topLayerHeight / 2 + 0.24, 0]}>
        {/* Sprinkles */}
        {decorations.sprinkles && (
          <group>
            {Array.from({ length: 180 }).map((_, i) => {
              const r = baseRadius * 0.5 + Math.random() * (baseRadius * 0.3);
              const angle = Math.random() * Math.PI * 2;

              const x = Math.cos(angle) * r;
              const z = Math.sin(angle) * r;

              const length = 0.08 + Math.random() * 0.05;
              const radius = 0.015 + Math.random() * 0.01;

              const color =
                SPRINKLE_COLORS[
                Math.floor(Math.random() * SPRINKLE_COLORS.length)
                ];

              return (
                <mesh
                  key={i}
                  position={[x, -0.08, z]}
                  rotation={[
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry args={[radius, radius, length, 12, 1]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.4}
                    metalness={0.15}
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
              const r =
                (baseRadius - (layers.length - 1) * 0.18) * 0.78;

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
              const r =
                (baseRadius - (layers.length - 1) * 0.18) * 0.78;

              let Component = null;
              if (decorations.strawberries && decorations.oreos)
                Component = i % 2 === 0 ? Strawberry : Oreo;
              else if (decorations.strawberries) Component = Strawberry;
              else if (decorations.oreos) Component = Oreo;

              if (!Component) return null;

              return (
                <Component
                  key={i}
                  position={[Math.cos(angle) * r, -0.02, Math.sin(angle) * r]}
                  rotation={[0, angle + Math.PI / 2, 0]}
                  scale={Component === Oreo ? 0.35 : 0.8}
                />
              );
            })}
          </group>
        )}

        {/* FLAT ICING TEXT ON CAKE SURFACE */}
        
        {message && message.length > 0 && (
          <Text3D
            font="/fonts/CakeFont.json"
            size={textSize * 0.8}
            height={0.03}
            curveSegments={32}
            bevelEnabled={false}
            position={[
              -(message.length * textSize * 0.2),
              topLayerHeight + 10.25,  // LIFTED UP to surface
              0
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {message}
            <meshStandardMaterial
              color="#ff6f91"
              roughness={0.35}
              metalness={0.25}
            />
          </Text3D>
        )}
      </group>

      {/* GIFT BOX */}
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