import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const defaultTheme = {
  primaryColor: "#581B28",
  secondaryColor: "#F7C0C3",
  creamColor: "#FFFCF6",
  textMain: "#2b2b2b",
  textMuted: "#6d6d6d",
  borderSoft: "#f4d5d8",
  logoBase64: null,  // NEW
};

const BrandThemeContext = createContext(defaultTheme);

export function BrandThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const ref = doc(db, "brandConfig", "dynamic");
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setTheme({ ...defaultTheme, ...snap.data() });
      } else setTheme(defaultTheme);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", theme.primaryColor);
    root.style.setProperty("--brand-secondary", theme.secondaryColor);
    root.style.setProperty("--brand-cream", theme.creamColor);
    root.style.setProperty("--brand-text-main", theme.textMain);
    root.style.setProperty("--brand-text-muted", theme.textMuted);
    root.style.setProperty("--brand-border-soft", theme.borderSoft);
  }, [theme]);

  return (
    <BrandThemeContext.Provider value={theme}>
      {children}
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme() {
  return useContext(BrandThemeContext);
}