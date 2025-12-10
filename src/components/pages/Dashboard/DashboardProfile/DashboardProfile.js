import React, { useEffect, useState } from "react";
import "./DashboardProfile.css";

import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function DashboardProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    photoURL: "",
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setProfile({
          displayName: data.displayName || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          photoURL: data.photoURL || user.photoURL || "",
        });
      } else {
        // if doc doesn't exist, fallback to auth user
        setProfile({
          displayName: user.displayName || "",
          email: user.email || "",
          phone: "",
          photoURL: user.photoURL || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // Save updates to Firestore
  const handleSave = async () => {
    setSaving(true);

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      displayName: profile.displayName,
      phone: profile.phone,
      photoURL: profile.photoURL,
    });

    setSaving(false);
    alert("Profile updated successfully!");
  };

  if (loading) return <p className="profile-loading">Loading...</p>;

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">My Profile</h1>
      <p className="profile-sub">Manage your account details</p>

      <div className="profile-card">
        {/* LEFT */}
        <div className="profile-left">
          <div className="profile-avatar">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="Profile" />
            ) : (
              <span className="profile-initial">
                {profile.email?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <h2 className="profile-name">
            {profile.displayName || "User"}
          </h2>
          <p className="profile-email">{profile.email}</p>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <div className="profile-section">
            <label>Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="No name set"
            />
          </div>

          <div className="profile-section">
            <label>Email</label>
            <input disabled value={profile.email} />
          </div>

          <div className="profile-section">
            <label>Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="Add phone number"
            />
          </div>

          <button
            className="profile-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}