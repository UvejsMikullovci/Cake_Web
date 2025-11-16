import React from "react";
import "./cakeStyles.css";

export default function CakeControls({ layers, setLayers }) {
  const updateLayer = (index, key, value) => {
    const newLayers = [...layers];
    newLayers[index][key] = value;
    setLayers(newLayers);
  };

  const addLayer = () => {
    setLayers([
      ...layers,
      {
        radius: 1.5 - layers.length * 0.2,
        height: 0.6,
        color: "#d79f6f"
      }
    ]);
  };

  const removeLayer = () => {
    if (layers.length > 1) {
      setLayers(layers.slice(0, -1));
    }
  };

  return (
    <div className="cake-controls">
      <h3>Cake Customizer</h3>

      {layers.map((layer, i) => (
        <div key={i} className="cake-layer-box">
          <strong>Layer {i + 1}</strong>

          <label>Color</label>
          <input
            type="color"
            value={layer.color}
            onChange={(e) => updateLayer(i, "color", e.target.value)}
          />

          <label>Height</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={layer.height}
            onChange={(e) => updateLayer(i, "height", parseFloat(e.target.value))}
          />
        </div>
      ))}

      <button className="cake-btn add" onClick={addLayer}>+ Add Layer</button>
      <button className="cake-btn remove" onClick={removeLayer}>– Remove Layer</button>
    </div>
  );
}