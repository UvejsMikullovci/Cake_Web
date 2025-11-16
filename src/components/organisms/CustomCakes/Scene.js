import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cake from "./Cake";

export default function Scene({ layers }) {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 6], fov: 45 }}
      style={{ height: "100vh", background: "#fffaf8" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.5}
        castShadow
      />

      <Cake layers={layers} />

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}