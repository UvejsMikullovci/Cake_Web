// DashboardDesserts.jsx
import React, { useState, useEffect } from "react";
import "./dashboardDesserts.css";

import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const CATEGORY_OPTIONS = ["Cakes", "Cookies", "Pies", "Wedding", "Other"];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function DashboardDesserts() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [category, setCategory] = useState("Cakes");
  const [desserts, setDesserts] = useState([]);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "desserts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setDesserts(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setImage(base64);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description || !image) {
      alert("Please fill all fields.");
      return;
    }

    const data = {
      title,
      price,
      description,
      ingredients: ingredients
        ? ingredients.split(",").map((x) => x.trim())
        : [],
      image,
      category,
    };

    if (editID) {
      await updateDoc(doc(db, "desserts", editID), data);
    } else {
      await addDoc(collection(db, "desserts"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setIngredients("");
    setImage("");
    setPreview("");
    setCategory("Cakes");
    setEditID(null);
  };

  const editDessert = (d) => {
    setTitle(d.title || "");
    setPrice(d.price || "");
    setDescription(d.description || "");
    setIngredients(d.ingredients?.join(", ") || "");
    setImage(d.image || "");
    setPreview(d.image || "");
    setCategory(d.category || "Other");
    setEditID(d.id);
  };

  const deleteDessert = async (id) => {
    await deleteDoc(doc(db, "desserts", id));
  };

  return (
    <div className="dashboard-desserts">
      <h2>Desserts Dashboard</h2>

      <div className="dashboard-desserts-form-preview-container">
        <form className="dashboard-desserts-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Dessert Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="dashboard-desserts-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />

          <label className="dashboard-desserts-image-upload">
            Upload Image
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>

          <button type="submit" className="dashboard-desserts-submit-btn">
            {editID ? "Update Dessert" : "Add Dessert"}
          </button>
        </form>

        <div className="dashboard-desserts-preview-card">
          <div className="dashboard-desserts-imageWrapper">
            {preview && (
              <img
                src={preview}
                alt={title || "Preview"}
                className="dashboard-desserts-card-image"
              />
            )}
          </div>

          <span className="dashboard-desserts-category-pill">
            {category}
          </span>

          <h4 className="dashboard-desserts-card-title">
            {title || "Chocolate Cake"}
          </h4>

          <p className="dashboard-desserts-card-desc">
            {description ||
              "A rich and moist chocolate dessert, topped with ganache and sprinkles."}
          </p>

          <p className="dashboard-desserts-card-price">
            €{price || "4.50"}
          </p>
        </div>
      </div>

      <h3>All Desserts</h3>

      <div className="dashboard-desserts-grid">
        {desserts.map((d) => (
          <div key={d.id} className="dashboard-desserts-card">
            <div className="dashboard-desserts-imageWrapper">
              <img
                src={d.image}
                alt={d.title}
                className="dashboard-desserts-card-image"
              />
            </div>

            <span className="dashboard-desserts-category-pill">
              {d.category || "Other"}
            </span>

            <h4 className="dashboard-desserts-card-title">{d.title}</h4>
            <p className="dashboard-desserts-card-desc">{d.description}</p>
            <p className="dashboard-desserts-card-price">€{d.price}</p>

            <div className="dashboard-desserts-card-actions">
              <button onClick={() => editDessert(d)}>Edit</button>
              <button
                onClick={() => deleteDessert(d.id)}
                className="dashboard-desserts-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}