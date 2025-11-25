import React from "react";
import "./cakeStyles.css";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const SIZE_LABELS = {
  small: { title: "Small", subtitle: "6–8 servings" },
  medium: { title: "Medium", subtitle: "10–14 servings" },
  large: { title: "Large", subtitle: "16–20 servings" },
};

const BASE_FLAVORS = [
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "redVelvet", label: "Red Velvet" },
  { value: "strawberryCake", label: "Strawberry Cake" },
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

const FLAVOR_COLORS = {
  vanilla: "#f4e3d3",
  chocolate: "#5c3b2b",
  redVelvet: "#b73a4c",
  strawberryCake: "#f5a8b3",
  strawberry: "#f5a8b3",
  lemon: "#f4de7a",
  hazelnut: "#c7a27b",
};

const CANDLE_COLORS = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "black", label: "Black" },
];

function FlavorDotsRow({ options, value, onChange }) {
  return (
    <div className="cake-flavor-dot-row">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={
            "cake-flavor-dot" + (value === opt.value ? " selected" : "")
          }
          style={{ "--flavor-color": FLAVOR_COLORS[opt.value] }}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}

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
  textSize,
  setTextSize,
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

  const removeLayer = () =>
    setLayers((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const toggleDecoration = (key) =>
    setDecorations((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFullFrosting = () =>
    setDecorations((prev) => ({
      ...prev,
      fullFrosting: !prev.fullFrosting,
    }));

  return (
    <div className="cake-controls">
      <div className="cake-controls-header">
        <div>
          <div className="cake-controls-title">Custom Cake Builder</div>
          <div className="cake-controls-subtitle">
            Build your dream cake step-by-step
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Size</div>
          <div className="cake-section-badge">Diameter & servings</div>
        </div>

        <div className="cake-size-options">
          {Object.entries(SIZE_LABELS).map(([key, info]) => (
            <button
              key={key}
              className={"cake-pill" + (cakeSize === key ? " active" : "")}
              onClick={() => setCakeSize(key)}
            >
              <span className="cake-pill-label">{info.title}</span>
              <span className="cake-pill-sub">{info.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layers */}
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
                <span className="cake-layer-label">Layer {index + 1}</span>
              </div>

              {/* Layer height */}
              <div className="cake-slider-row">
                <div className="cake-slider-label">
                  Height: {layer.height.toFixed(2)}
                </div>
                <input
                  className="cake-slider"
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={layer.height}
                  onChange={(e) =>
                    updateLayer(layer.id, "height", parseFloat(e.target.value))
                  }
                />
              </div>

              {/* Base */}
              <div className="cake-flavor-group">
                <div className="cake-flavor-group-title">Base</div>
                <FlavorDotsRow
                  options={BASE_FLAVORS}
                  value={layer.baseFlavor}
                  onChange={(val) =>
                    updateLayer(layer.id, "baseFlavor", val)
                  }
                />
              </div>

              {/* Frosting */}
              <div className="cake-flavor-group">
                <div className="cake-flavor-group-title">Frosting</div>
                <FlavorDotsRow
                  options={FROSTING_FLAVORS}
                  value={layer.frostingFlavor}
                  onChange={(val) =>
                    updateLayer(layer.id, "frostingFlavor", val)
                  }
                />
              </div>

              {/* Filling */}
              <div className="cake-flavor-group">
                <div className="cake-flavor-group-title">Filling</div>
                <FlavorDotsRow
                  options={FILLING_FLAVORS}
                  value={layer.fillingFlavor}
                  onChange={(val) =>
                    updateLayer(layer.id, "fillingFlavor", val)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cake-btn-row">
          <button className="cake-btn primary" onClick={addLayer}>
            + Add Layer
          </button>
          <button className="cake-btn secondary" onClick={removeLayer}>
            – Remove Layer
          </button>
        </div>
      </div>

      {/* Full Frosting Toggle */}
      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Frosting Coverage</div>
          <div className="cake-section-badge">Full or top only</div>
        </div>

        <div className="cake-toggle-row1">
          <div className="cake-toggle-label">Full Frosting</div>

          <div
            className={
              "ios-toggle " + (decorations.fullFrosting ? "on" : "off")
            }
            onClick={toggleFullFrosting}
          >
            <div className="ios-toggle-thumb" />
          </div>
        </div>
      </div>

      {/* Decorations */}
      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Decorations</div>
          <div className="cake-section-badge">Top & around</div>
        </div>

        <div className="cake-toggle-row">
          <button
            className={
              "cake-toggle-pill" + (decorations.candles ? " active" : "")
            }
            onClick={() => toggleDecoration("candles")}
          >
            Candles
          </button>

          <button
            className={
              "cake-toggle-pill" + (decorations.strawberries ? " active" : "")
            }
            onClick={() => toggleDecoration("strawberries")}
          >
            Strawberries
          </button>

          <button
            className={
              "cake-toggle-pill" + (decorations.oreos ? " active" : "")
            }
            onClick={() => toggleDecoration("oreos")}
          >
            Oreos
          </button>

          <button
            className={
              "cake-toggle-pill" + (decorations.sprinkles ? " active" : "")
            }
            onClick={() => toggleDecoration("sprinkles")}
          >
            Sprinkles
          </button>
        </div>
      </div>

      {/* Candle Color */}
      {decorations.candles && (
        <div className="cake-section">
          <div className="cake-section-header">
            <div className="cake-section-title">Candle Color</div>
            <div className="cake-section-badge">8 colors</div>
          </div>

          <div className="cake-flavor-dot-row">
            {CANDLE_COLORS.map((c) => (
              <button
                key={c.value}
                className={
                  "cake-flavor-dot" +
                  (decorations.candleColor === c.value ? " selected" : "")
                }
                style={{ "--flavor-color": c.value }}
                onClick={() =>
                  setDecorations((prev) => ({ ...prev, candleColor: c.value }))
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Text + Gift */}
      <div className="cake-section">
        <div className="cake-section-header">
          <div className="cake-section-title">Top Text & Gift</div>
          <div className="cake-section-badge">Text · Gift box</div>
        </div>

        <input
          className="cake-input"
          placeholder="Write your message..."
          maxLength={32}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="cake-gift-row">
          <div className="cake-gift-label">Send as gift</div>

          <div
            className={"cake-switch " + (sendAsGift ? "on" : "")}
            onClick={() => setSendAsGift((prev) => !prev)}
          >
            <div className="cake-switch-thumb" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cake-footer">
        <div className="cake-price-chip">
          <div className="cake-price-label">Live price</div>
          <div className="cake-price-value">${price}</div>
        </div>

        <button className="cake-primary-action">Add to Cart</button>
      </div>
    </div>
  );
}