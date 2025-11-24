import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Recipes");
  const [imageBase64, setImageBase64] = useState("");

  // Convert image → Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);  // STORE BASE64 HERE
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageBase64) {
      alert("Image missing!");
      return;
    }

    await addDoc(collection(db, "blogs"), {
      title,
      content,
      type,
      imageBase64,          // SAVE BASE64 TO FIRESTORE
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      readingTime: 5,
    });

    alert("Blog Created!");
  };

  return (
    <div className="create-blog">
      <h2>Create Blog</h2>

      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Recipes</option>
        <option>Tips & Tricks</option>
        <option>Guides</option>
        <option>Inspiration</option>
      </select>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageBase64 && (
        <img
          src={imageBase64}
          style={{ width: "200px", borderRadius: "10px", marginTop: "10px" }}
        />
      )}

      <button onClick={handleSubmit}>Publish Blog</button>
    </div>
  );
}