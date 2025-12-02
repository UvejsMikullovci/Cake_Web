import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./dashboardSettings.css";

export default function DashboardSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    brandPrimary: "#581B28",
    brandSecondary: "#F7C0C3",
    brandCream: "#FFFCF6",
    brandText: "#2b2b2b",
    brandTextLight: "#6d6d6d",
    brandBorderSoft: "#f4d5d8",
  });

  useEffect(() => {
    const loadConfig = async () => {
      const ref = doc(db, "brandConfig", "dynamic");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSettings({ ...settings, ...snap.data() });
      }
      setLoading(false);
    };

    loadConfig();
  }, []);

  const applyToCSS = (newSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", newSettings.brandPrimary);
    root.style.setProperty("--brand-secondary", newSettings.brandSecondary);
    root.style.setProperty("--brand-cream", newSettings.brandCream);
    root.style.setProperty("--brand-text", newSettings.brandText);
    root.style.setProperty("--brand-text-light", newSettings.brandTextLight);
    root.style.setProperty("--brand-border-soft", newSettings.brandBorderSoft);
  };

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    applyToCSS(updated);
  };

  const saveSettings = async () =>
  {
    setSaving(true);

    const ref = doc(db, "brandConfig", "dynamic");
    await setDoc(ref, settings, { merge: true });

    setSaving(false);
    alert("Brand colors updated successfully!");
  };

  if (loading) return <div className="settings-loading">Loading...</div>;

  return (
    <div className="settings-wrapper">
      <h1 className="settings-title">Brand Settings</h1>
      <p className="settings-subtitle">Customize the website theme colors</p>

      <div className="settings-grid">

        <div className="setting-box">
          <label>Primary Color</label>
          <input
            type="color"
            value={settings.brandPrimary}
            onChange={(e) => handleChange("brandPrimary", e.target.value)}
          />
        </div>

        <div className="setting-box">
          <label>Secondary Color</label>
          <input
            type="color"
            value={settings.brandSecondary}
            onChange={(e) => handleChange("brandSecondary", e.target.value)}
          />
        </div>

        <div className="setting-box">
          <label>Cream Background</label>
          <input
            type="color"
            value={settings.brandCream}
            onChange={(e) => handleChange("brandCream", e.target.value)}
          />
        </div>

        <div className="setting-box">
          <label>Main Text</label>
          <input
            type="color"
            value={settings.brandText}
            onChange={(e) => handleChange("brandText", e.target.value)}
          />
        </div>
        
        <div className="setting-box">
          <label>Muted Text</label>
          <input
            type="color"
            value={settings.brandTextLight}
            onChange={(e) => handleChange("brandTextLight", e.target.value)}
          />
        </div>

        <div className="setting-box">
          <label>Soft Border</label>
          <input
            type="color"
            value={settings.brandBorderSoft}
            onChange={(e) => handleChange("brandBorderSoft", e.target.value)}
          />
        </div>
      </div>

      <button className="save-btn" onClick={saveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}