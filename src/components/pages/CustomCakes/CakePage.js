import React, { useState } from "react";
import Scene from "../../organisms/CustomCakes/Scene";
import CakeControls from "../../organisms/CustomCakes/CakeControls";
import "../../organisms/CustomCakes/cakeStyles.css";

export default function CakePage() {
  const [layers, setLayers] = useState([
    { radius: 1.5, height: 0.6, color: "#d79f6f" },
    { radius: 1.3, height: 0.5, color: "#fff2dd" },
    { radius: 1.1, height: 0.4, color: "#5a2e1a" }
  ]);

  return (
    <div className="cake-page-container">
      <Scene layers={layers} />
      <CakeControls layers={layers} setLayers={setLayers} />
    </div>
  );
}