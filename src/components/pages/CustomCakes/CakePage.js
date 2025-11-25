import React, { useMemo, useState } from "react";
import Scene from "../../organisms/CustomCakes/Scene";
import CakeControls from "../../organisms/CustomCakes/CakeControls";
import "../../organisms/CustomCakes/cakeStyles.css";
import Header from "../../organisms/NavBar/Navbar";

export default function CakePage() {
  const [cakeSize, setCakeSize] = useState("medium");

  const [layers, setLayers] = useState([
    {
      id: 1,
      baseFlavor: "vanilla",
      frostingFlavor: "vanilla",
      fillingFlavor: "strawberry",
      height: 0.6,
    },
    {
      id: 2,
      baseFlavor: "chocolate",
      frostingFlavor: "vanilla",
      fillingFlavor: "vanilla",
      height: 0.5,
    },
  ]);

  const [decorations, setDecorations] = useState({
    candles: true,
    strawberries: true,
    oreos: false,
    sprinkles: false,
    candleColor: "red",
  });

  const [textSize, setTextSize] = useState(0.22);
  const [message, setMessage] = useState("Happy Birthday");
  const [sendAsGift, setSendAsGift] = useState(false);

  const price = useMemo(() => {
    const SIZE_BASE = {
      small: 22,
      medium: 30,
      large: 40,
    };

    const sizeMultiplier = {
      small: 1,
      medium: 1.25,
      large: 1.6,
    };

    const layersPrice = layers.length * 6;
    const heightBonus =
      layers.reduce((sum, l) => sum + (l.height - 0.5), 0) * 10;

    let decorationsPrice = 0;
    if (decorations.candles) decorationsPrice += 4;
    if (decorations.strawberries) decorationsPrice += 5;
    if (decorations.oreos) decorationsPrice += 4;
    if (decorations.sprinkles) decorationsPrice += 3;

    const giftPrice = sendAsGift ? 7 : 0;

    const base = SIZE_BASE[cakeSize] ?? 30;
    const total =
      (base + layersPrice + heightBonus + decorationsPrice + giftPrice) *
      (sizeMultiplier[cakeSize] ?? 1);

    return Math.max(15, Math.round(total));
  }, [layers, decorations, sendAsGift, cakeSize]);

  return (
    <div className="cake-page-layout">
      <Header />
      <div className="cake-left-panel">
        <div className="cake-canvas-wrapper">
          <Scene
            layers={layers}
            cakeSize={cakeSize}
            decorations={decorations}
            message={message}
            textSize={textSize}
            sendAsGift={sendAsGift}
          />
        </div>
      </div>

      <div className="cake-right-panel">
        <CakeControls
          layers={layers}
          setLayers={setLayers}
          cakeSize={cakeSize}
          setCakeSize={setCakeSize}
          decorations={decorations}
          setDecorations={setDecorations}
          message={message}
          setMessage={setMessage}
          textSize={textSize}
          setTextSize={setTextSize}
          sendAsGift={sendAsGift}
          setSendAsGift={setSendAsGift}
          price={price}
        />
      </div>
    </div>
  );
}