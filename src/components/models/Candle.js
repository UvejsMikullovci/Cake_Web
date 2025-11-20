import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export default function Candle({ color, ...props }) {
  const group = useRef();
  const { scene } = useGLTF("/models/birthday_candle.glb");

  const clonedScene = clone(scene);

  if (color) {
    clonedScene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        if (obj.material.name === "Kaars1") {
          obj.material.color.set(color);
        }
      }
    });
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/birthday_candle.glb");