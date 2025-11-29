import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const defaultTheme = {
  brandName: "CakeCrush",
  primaryColor: "#581B28",
  secondaryColor: "#F7C0C3",
  creamColor: "#FFFCF6",
  softBg1: "#fff7f5",
  softBg2: "#fff3f0",
  borderSoft: "#f3c5c5",
  borderSoft2: "#f3c8c8",
  textMain: "#581B28",
  textMuted: "#6d5f63",
  bodyText: "#00211ABF",
  newsletterGradientStart: "#F7C0C3",
  newsletterGradientEnd: "#581B28",
  headingColor: "#4a1f28",
  secondarySoft: "#f7c0c329"
};

const BrandThemeContext = createContext(defaultTheme);

export function BrandThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const ref = doc(db, "brandConfig", "u4GxN4KD92LkA3h");
    const unsub = onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          setTheme({ ...defaultTheme, ...data });
        } else {
          setTheme(defaultTheme);
        }
      },
      () => {
        setTheme(defaultTheme);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", theme.primaryColor);
    root.style.setProperty("--brand-secondary", theme.secondaryColor);
    root.style.setProperty("--brand-cream", theme.creamColor);
    root.style.setProperty("--brand-soft-bg-1", theme.softBg1);
    root.style.setProperty("--brand-soft-bg-2", theme.softBg2);
    root.style.setProperty("--brand-border-soft", theme.borderSoft);
    root.style.setProperty("--brand-border-soft-2", theme.borderSoft2);
    root.style.setProperty("--brand-text-main", theme.textMain);
    root.style.setProperty("--brand-text-muted", theme.textMuted);
    root.style.setProperty("--brand-body-text", theme.bodyText);
    root.style.setProperty(
      "--brand-newsletter-gradient-start",
      theme.newsletterGradientStart
    );
    root.style.setProperty(
      "--brand-newsletter-gradient-end",
      theme.newsletterGradientEnd
    );
    root.style.setProperty("--brand-heading", theme.headingColor);
    root.style.setProperty("--brand-secondary-soft", theme.secondarySoft);
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