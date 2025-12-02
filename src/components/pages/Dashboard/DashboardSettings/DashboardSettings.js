import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    logoBase64: "",  // NEW
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      const ref = doc(db, "brandConfig", "dynamic");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setSettings(prev => ({ ...prev, ...data }));
        if (data.logoBase64) setPreviewLogo(data.logoBase64);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings(prev => ({ ...prev, logoBase64: reader.result }));
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    setSaving(true);

    const ref = doc(db, "brandConfig", "dynamic");
    await setDoc(ref, settings, { merge: true });

    setSaving(false);
    alert("Brand settings updated successfully!");
  };

  if (loading) return <div className="settings-loading">Loading...</div>;

  return (
    <div className="settings-wrapper">
      <h1 className="settings-title">Brand Settings</h1>
      <p className="settings-subtitle">Customize theme colors and logo</p>

      <div className="settings-grid">

        {/* Colors */}
        {[
          ["Primary Color", "brandPrimary"],
          ["Secondary Color", "brandSecondary"],
          ["Cream Background", "brandCream"],
          ["Main Text", "brandText"],
          ["Muted Text", "brandTextLight"],
          ["Soft Border", "brandBorderSoft"],
        ].map(([label, key]) => (
          <div className="setting-box" key={key}>
            <label>{label}</label>
            <input
              type="color"
              value={settings[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}

        {/* Logo Upload */}
        <div className="setting-box logo-box">
          <label>Logo (Base64)</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />

          {previewLogo && (
            <img
              className="logo-preview"
              src={previewLogo}
              alt="Logo Preview"
            />
          )}
        </div>

      </div>

      <button className="save-btn" onClick={saveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}