import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, limit, getDocs } from "firebase/firestore";

import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer";
import "./singelBlog.css";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

// YOUR LOGO (author image always)
import Logo from "../../Photos/Logos/logo.jpg";

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }

        const q = query(collection(db, "blogs"), limit(3));
        const snapshot = await getDocs(q);

        const related = snapshot.docs
          .filter((d) => d.id !== id)
          .map((d) => ({ id: d.id, ...d.data() }));

        setRelatedPosts(related);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!post) return <div className="loading-screen">Post not found</div>;

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="single-blog-page">
      <Navbar />

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* HEADER */}
      <section className="single-blog-banner">
        <h1>{post.title}</h1>
        <p className="single-intro">Discover stories, tips, and inspiration</p>
      </section>

      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="var(--brand-secondary)"
        ></path>
      </svg>

      <div className="single-blog-container">
        {/* AUTHOR BOX */}
        <div className="author-box">
          <img src={Logo} alt="author" className="author-img" />
          <div>
            <h4>CakeCrush Team</h4>
            <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* MAIN IMAGE */}
        <div className="single-blog-image">
          <img src={post.imageBase64} alt={post.title} />
        </div>

        {/* META */}
        <div className="single-meta">
          <span>{post.readingTime || 5} min read</span>
          <span>•</span>
          <span className="tag">{post.type}</span>
        </div>

        {/* CONTENT */}
        <p className="single-blog-text">{post.content}</p>

        {/* SHARE SECTION */}
        <div className="share-section">
          <h3>Share this post</h3>
          <div className="share-buttons">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              className="share-btn fb"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${shareUrl}`}
              target="_blank"
              className="share-btn wa"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>

            <button className="share-btn copy" onClick={handleCopy}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>

          {copied && <div className="copy-alert">Link copied!</div>}
        </div>

        {/* RELATED POSTS */}
        <div className="related-section">
          <h2>You may also like</h2>

          <div className="related-grid">
            {relatedPosts.map((rp) => (
              <div
                key={rp.id}
                className="related-card"
                onClick={() => navigate(`/blog/${rp.id}`)}
              >
                <img src={rp.imageBase64} alt={rp.title} />
                <h4>{rp.title}</h4>
                <p>{rp.content?.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
