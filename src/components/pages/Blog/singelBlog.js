import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer";
import "./singelBlog.css";

export default function SingleBlog() {
  const { id } = useParams(); // Get the blog ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogs", id); // Fetch the specific blog by ID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data()); // Set post data in state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // Re-fetch when the ID changes (i.e., when navigating to a different post)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="single-blog-wrapper">
      <Navbar />
      <div className="single-blog-content">
        <h1>{post.title}</h1>
        <div className="blog-img-wrapper">
          {post.imageBase64 ? (
            <img src={post.imageBase64} alt={post.title} />
          ) : (
            <div className="blog-img-placeholder" />
          )}
        </div>
        <p>{post.content}</p> {/* Display full content */}

        <div className="blog-meta">
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span> • </span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
