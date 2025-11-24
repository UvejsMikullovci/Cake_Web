import React, { useState, useEffect, useMemo } from "react";
import "./dashboardBlog.css";

import { db } from "../../../firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp,
    orderBy,
    query,
} from "firebase/firestore";

// Convert image → Base64
const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default function DashboardBlog() {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [blogs, setBlogs] = useState([]);

    // LIVE BLOGS FROM FIRESTORE
    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBlogs(list);
        });

        return () => unsub();
    }, []);

    // PREVIEW READING TIME
    const previewReadingTime = useMemo(() => {
        if (!content) return 1;
        const words = content.trim().split(/\s+/).length;
        return Math.max(1, Math.round(words / 200));
    }, [content]);

    const todayPreviewText = useMemo(
        () =>
            new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        []
    );

    // HANDLE IMAGE CHANGE (Preview)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file || null);

        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreviewImage(previewURL);
        } else {
            setPreviewImage(null);
        }
    };

    // SAVE BLOG INTO FIRESTORE WITH BASE64 IMAGE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("Title and content are required.");
            return;
        }

        let imageBase64 = "";

        // 🔥 Convert to Base64 and save in Firestore
        if (image) {
            imageBase64 = await toBase64(image);
        }

        const now = new Date();
        const publishedAt = now.toISOString();

        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.round(words / 200));

        await addDoc(collection(db, "blogs"), {
            title,
            content,
            type: type || "Tips & Tricks",
            imageBase64, // 🔥 SAVED TO FIRESTORE
            publishedAt,
            readingTime,
            createdAt: serverTimestamp(),
        });

        // RESET FORM
        setTitle("");
        setType("");
        setContent("");
        setImage(null);
        setPreviewImage(null);
    };

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="dashboardBlog">
            {/* LEFT SIDE FORM */}
            <div className="leftSide">
                <h2 className="sectionTitle">Add New Blog</h2>

                <form className="blogForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Blog title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Blog type</option>
                        <option value="Tips & Tricks">Tips & Tricks</option>
                        <option value="Guides">Guides</option>
                        <option value="Inspiration">Inspiration</option>
                        <option value="Recipes">Recipes</option>
                    </select>

                    <textarea
                        placeholder="Blog content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <label className="customFileUpload">
                        Upload Image Here:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>

                    <button type="submit">Publish blog</button>
                </form>

                <hr className="divider" />

                <h2 className="sectionTitle">Your Blogs</h2>

                <div className="blogList">
                    {blogs.map((blog) => {
                        const base64Image = blog.imageBase64 || null;

                        const dateText = formatDate(blog.publishedAt);
                        const minutes = blog.readingTime || 5;

                        return (
                            <article className="blogCard" key={blog.id}>
                                <div className="blogCard-imageWrapper">
                                    {base64Image ? (
                                        <img src={base64Image} alt={blog.title} />
                                    ) : (
                                        <div className="blogCard-imagePlaceholder" />
                                    )}

                                    <span className="blogTypeBadge">
                                        {blog.type || "Tips & Tricks"}
                                    </span>
                                </div>

                                <div className="blogCard-body">
                                    <h3 className="blogCard-title">{blog.title}</h3>
                                    <p className="blogCard-excerpt">{blog.content}</p>

                                    <div className="blogMeta">
                                        <span>{dateText}</span>
                                        <span>•</span>
                                        <span>{minutes} min read</span>
                                    </div>

                                    <button className="blogReadButton" type="button">
                                        Read →
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT SIDE — LIVE PREVIEW */}
            <aside className="rightPreview">
                <h2 className="sectionTitle">Live Preview</h2>

                <article className="previewCard">
                    <div className="blogCard-imageWrapper">
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" />
                        ) : (
                            <div className="blogCard-imagePlaceholder" />
                        )}

                        <span className="blogTypeBadge">
                            {type || "Tips & Tricks"}
                        </span>
                    </div>

                    <div className="blogCard-body">
                        <h3 className="blogCard-title">
                            {title || "10 Tips for the Perfect Birthday Cake"}
                        </h3>

                        <p className="blogCard-excerpt">
                            {content ||
                                "Planning a birthday celebration? Here are our top tips for choosing and customizing the perfect cake…"}
                        </p>

                        <div className="blogMeta">
                            <span>{todayPreviewText}</span>
                            <span>•</span>
                            <span>{previewReadingTime} min read</span>
                        </div>

                        <button className="blogReadButton" type="button">
                            Read →
                        </button>
                    </div>
                </article>
            </aside>
        </div>
    );
}