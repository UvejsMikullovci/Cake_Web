import React from "react";
import "./cakeStyles.css";

const SIZE_LABELS = {
  small: { title: "Small", subtitle: "Ø 15 cm" },
  medium: { title: "Medium", subtitle: "Ø 20 cm" },
  large: { title: "Large", subtitle: "Ø 25 cm" },
};

const BASE_FLAVORS = [
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "redVelvet", label: "Red Velvet" },
  { value: "strawberryCake", label: "Strawberry" },
];

const FROSTING_FLAVORS = [
  { value: "vanilla", label: "Vanilla Frosting" },
  { value: "chocolate", label: "Chocolate Ganache" },
  { value: "strawberry", label: "Strawberry Cream" },
  { value: "lemon", label: "Lemon Buttercream" },
];

const FILLING_FLAVORS = [
  { value: "vanilla", label: "Vanilla Cream" },
  { value: "chocolate", label: "Chocolate Mousse" },
  { value: "strawberry", label: "Strawberry Jam" },
  { value: "hazelnut", label: "Hazelnut Praline" },
];

export default function CakeControls({
  layers,
  setLayers,
  cakeSize,
  setCakeSize,
  decorations,
  setDecorations,
  message,
  setMessage,
  sendAsGift,
  setSendAsGift,
  price,
}) {
  const updateLayer = (id, key, value) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, [key]: value } : layer
      )
    );
  };

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      {
        id: Date.now(),
        baseFlavor: "vanilla",
        frostingFlavor: "vanilla",
        fillingFlavor: "vanilla",
        height: 0.5,
      },
    ]);
  };

  const removeLayer = () => {
    setLayers((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const toggleDecoration = (key) => {
    setDecorations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="cake-controls">
      <div className="cake-controls-header">
        <div>
          <div className="cake-controls-title">Custom Cake Builder</div>
          <div className="cake-controls-subtitle">
            Live 3D preview · Gift ready
          </div>
        </div>
      </div>

      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Size & Diameter</div>
          <div className="cake-section-badge">Per party size</div>
        </div>
        <div className="cake-size-options">
          {Object.entries(SIZE_LABELS).map(([key, info]) => (
            <button
              key={key}
              type="button"
              className={
                "cake-pill" + (cakeSize === key ? " active" : "")
              }
              onClick={() => setCakeSize(key)}
            >
              <span className="cake-pill-label">{info.title}</span>
              <span className="cake-pill-sub">{info.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">
            Layers & Flavors ({layers.length})
          </div>
          <div className="cake-section-badge">Base · Frosting · Filling</div>
        </div>

        <div className="cake-layers-list">
          {layers.map((layer, index) => (
            <div key={layer.id} className="cake-layer-card">
              <div className="cake-layer-row">
                <span className="cake-layer-label">
                  Layer {index + 1}
                </span>
                <span className="cake-layer-chip">
                  {layer.baseFlavor.replace(/([A-Z])/g, " $1")}
                </span>
              </div>

              <div className="cake-select-row">
                <select
                  className="cake-select"
                  value={layer.baseFlavor}
                  onChange={(e) =>
                    updateLayer(layer.id, "baseFlavor", e.target.value)
                  }
                >
                  {BASE_FLAVORS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  className="cake-select"
                  value={layer.frostingFlavor}
                  onChange={(e) =>
                    updateLayer(layer.id, "frostingFlavor", e.target.value)
                  }
                >
                  {FROSTING_FLAVORS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cake-select-row">
                <select
                  className="cake-select"
                  value={layer.fillingFlavor}
                  onChange={(e) =>
                    updateLayer(layer.id, "fillingFlavor", e.target.value)
                  }
                >
                  {FILLING_FLAVORS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cake-slider-row">
                <div className="cake-slider-label">
                  Height: {layer.height.toFixed(2)} (thicker → taller cake)
                </div>
                <input
                  className="cake-slider"
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={layer.height}
                  onChange={(e) =>
                    updateLayer(
                      layer.id,
                      "height",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cake-btn-row">
          <button
            type="button"
            className="cake-btn primary"
            onClick={addLayer}
          >
            + Add Layer
          </button>
          <button
            type="button"
            className="cake-btn secondary"
            onClick={removeLayer}
          >
            – Remove Layer
          </button>
        </div>
      </div>

      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Decorations</div>
          <div className="cake-section-badge">Top & around</div>
        </div>

        <div className="cake-toggle-row">
          <button
            type="button"
            className={
              "cake-toggle-pill" +
              (decorations.candles ? " active" : "")
            }
            onClick={() => toggleDecoration("candles")}
          >
            Candles
          </button>
          <button
            type="button"
            className={
              "cake-toggle-pill" +
              (decorations.strawberries ? " active" : "")
            }
            onClick={() => toggleDecoration("strawberries")}
          >
            Strawberries
          </button>
          <button
            type="button"
            className={
              "cake-toggle-pill" +
              (decorations.sprinkles ? " active" : "")
            }
            onClick={() => toggleDecoration("sprinkles")}
          >
            Sprinkles
          </button>
        </div>
      </div>

      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Top Text & Gift</div>
          <div className="cake-section-badge">3D text · Gift box</div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            className="cake-input"
            placeholder="Write your message..."
            maxLength={32}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="cake-gift-row">
          <div className="cake-gift-label">Send as a gift (with box)</div>
          <div
            className={
              "cake-switch" + (sendAsGift ? " on" : "")
            }
            onClick={() => setSendAsGift((prev) => !prev)}
          >
            <div className="cake-switch-thumb" />
          </div>
        </div>
      </div>

      <div className="cake-footer">
        <div className="cake-price-chip">
          <div className="cake-price-label">Live price</div>
          <div className="cake-price-value">${price}</div>
        </div>
        <button type="button" className="cake-primary-action">
          Add to Cart & Gift
        </button>
      </div>
    </div>
  );
}