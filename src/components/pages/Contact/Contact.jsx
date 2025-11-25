import React, { useState, useRef, useEffect } from "react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import emailjs from "@emailjs/browser";
import "./ContactFaqPage.css";
import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer"; 

const faqData = [
  { question: "What are your delivery areas?", answer: "We deliver within a 25-mile radius of our bakery..." },
  { question: "How far in advance should I order a custom cake?", answer: "We recommend ordering at least 2–3 weeks..." },
  { question: "Do you offer vegan or gluten-free options?", answer: "Yes! We offer both vegan and gluten-free cakes..." },
  { question: "Can I schedule a cake tasting?", answer: "Cake tastings are available by appointment only..." },
  { question: "What is your cancellation policy?", answer: "Orders cancelled within 48 hours may not be refunded..." },
  { question: "Do you ship cakes nationwide?", answer: "Currently, we do not ship cakes nationwide..." },
];

const ContactFaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    emailjs.init("IyzrrMLeesthFmSC7");
    contentRefs.current = contentRefs.current.slice(0, faqData.length);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSending(true);

    emailjs
      .send("service_aiqcgge", "template_ek5hkpa", {
        from_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
      })
      .then(
        () => {
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", phone: "", address: "", message: "" });
          setSending(false);
        },
        () => {
          alert("Failed to send message. Try again later.");
          setSending(false);
        }
      );
  };

  return (
    <div className="cf-page">
      <Navbar />
      <section className="cf-hero">
        <div className="cf-hero-nav">
          <Navbar />
        </div>
        <div className="cf-hero-inner">
          <h1>Get in Touch</h1>
          <p>Have a question or special request? We'd love to hear from you!</p>
        </div>
        <div className="cf-hero-wave" aria-hidden="true" />
      </section>
      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#F7C0C3"
        ></path>
      </svg>
      <main className="cf-main">
        <div className="cf-grid">
          <aside className="cf-card form-card" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title">Send Us a Message</h2>
            <form className="cf-form" onSubmit={handleSubmit}>
              <div className="cf-row">
                <label>
                  <span className="cf-label">Your Name</span>
                  <input
                    type="text"
                    name="name"
                    className="cf-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </label>
                <label>
                  <span className="cf-label">Email</span>
                  <input
                    type="email"
                    name="email"
                    className="cf-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </label>
              </div>
              <label>
                <span className="cf-label">Phone (Optional)</span>
                <input
                  type="tel"
                  name="phone"
                  className="cf-input"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span className="cf-label">Address (Optional)</span>
                <input
                  type="text"
                  name="address"
                  className="cf-input"
                  placeholder="123 Sweet Street"
                  value={formData.address}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span className="cf-label">Message</span>
                <textarea
                  name="message"
                  className="cf-textarea"
                  placeholder="Tell us about your special occasion or question..."
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <p className="error">{errors.message}</p>}
              </label>

              <button className="cf-btn" type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </aside>
          <section className="cf-card info-card" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title">Contact Information</h2>
            <div className="info-list">
              <div className="info-row">
                <div className="icon-badge"><MapPinIcon /></div>
                <div className="info-text">
                  <h4>Address</h4>
                  <p>123 Sweet Street<br />Bakery Town, BT 12345</p>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-badge"><PhoneIcon /></div>
                <div className="info-text">
                  <h4>Phone</h4>
                  <p>(555) 123-4567</p>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-badge"><EnvelopeIcon /></div>
                <div className="info-text">
                  <h4>Email</h4>
                  <p>hello@cakecrush.com</p>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-badge"><ClockIcon /></div>
                <div className="info-text">
                  <h4>Hours</h4>
                  <p>Monday – Saturday: 7am – 8pm<br />Sunday: 8am – 6pm</p>
                </div>
              </div>
            </div>

            <div className="map-wrapper" title="Map location">
              <iframe
                title="Bakery location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2926.2737129279!2d20.959317676232782!3d42.824831705612034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13535bf904a0b329%3A0x9c767fc069643180!2sInnovation%20Academy!5e0!3m2!1sen!2s!4v1763395839573!5m2!1sen!2s"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="logos-row" aria-hidden="true"></div>
          </section>
        </div>
        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-header">
            <h2 id="faq-title">Frequently Asked Questions</h2>
            <p>Find answers to common questions about our products and services</p>
          </div>

          <div className="faq-list">
            {faqData.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <article
                  key={i}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  onClick={() => toggleFAQ(i)}
                >
                  <header className="faq-q">
                    <span>{f.question}</span>
                    <ChevronDownIcon className={`chev ${isOpen ? "rot" : ""}`} />
                  </header>

                  <div
                    ref={(el) => (contentRefs.current[i] = el)}
                    className="faq-a"
                    style={
                      isOpen && contentRefs.current[i]
                        ? { height: contentRefs.current[i].scrollHeight }
                        : { height: 0 }
                    }
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-a-inner">{f.answer}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default ContactFaqPage;