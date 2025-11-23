// src/pages/PaymentsAndCheckout.js
import React, { useEffect, useMemo, useState } from "react";
import "./PaymentsAndCheckout.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

// ---------- HELPERS ----------

// format: "1234 1234 1234 1234"
function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

// format: "MM/YY"
function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

export default function PaymentsAndCheckout() {
  const user = auth.currentUser;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // SHIPPING DATA
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  // CREDIT CARD DATA
  const [cardInfo, setCardInfo] = useState({
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingZip: "",
    country: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState(null);

  // --- LOAD CART FROM users/{uid}/cart ---
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setCart([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "cart");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const items = snap.docs
          .map((d) => ({
            id: d.id,
            title: d.data().message || "Custom Cake",
            price: d.data().price || 0,
            deleted: d.data().deleted || false,
          }))
          .filter((i) => !i.deleted);

        setCart(items);
        setLoading(false);
      },
      () => {
        setCart([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + Number(it.price), 0),
    [cart]
  );

  const shipping = subtotal >= 100 ? 0 : 10;

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percent"
      ? (subtotal * appliedPromo.value) / 100
      : appliedPromo.value
    : 0;

  const total = Math.max(0, subtotal + shipping - promoDiscount);

  // ---------- HANDLERS ----------

  function handleShippingChange(e) {
    setShippingInfo((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleCardChange(e) {
    let { name, value } = e.target;

    if (name === "cardNumber") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiry(value);

    setCardInfo((s) => ({ ...s, [name]: value }));
  }

  async function handleDeleteItem(id) {
    if (!user) return;
    setProcessing(true);

    try {
      const ref = doc(db, "users", user.uid, "cart", id);
      await updateDoc(ref, { deleted: true });
    } catch (err) {
      console.error(err);
    }

    setProcessing(false);
  }

  async function handleApplyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (code === "SWEET10")
      setAppliedPromo({ code, type: "percent", value: 10 });
    else setAppliedPromo(null);
  }

  // ---------- CREATE ORDER WITH GLOBAL COUNTER ----------

  async function createOrderRecord(method) {
    if (!user) throw new Error("Not logged in");

    // global counter: orderCounters/global
    const counterRef = doc(db, "orderCounters", "global");
    const counterSnap = await getDoc(counterRef);
    const lastNum = counterSnap.exists()
      ? counterSnap.data().lastOrderNumber || 0
      : 0;

    const newNumber = lastNum + 1;
    const orderId = `ORDER-${String(newNumber).padStart(5, "0")}`;

    await setDoc(
      counterRef,
      { lastOrderNumber: newNumber },
      { merge: true }
    );

    const orderRef = doc(db, "orders", orderId);
    const order = {
      id: orderId,
      number: newNumber,
      userId: user.uid,
      items: cart,
      subtotal,
      shipping,
      discount: promoDiscount,
      total,
      shippingInfo,
      paymentMethod: method,
      cardInfo: method === "card" ? cardInfo : null,
      paypal: method === "paypal" ? { simulated: true } : null,
      createdAt: serverTimestamp(),
      status: "processing",
    };

    await setDoc(orderRef, order);
    return orderId;
  }

  async function completeOrder() {
    if (!user) return;
    if (cart.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      const orderId = await createOrderRecord(paymentMethod);

      const userCart = collection(db, "users", user.uid, "cart");
      const snap = await getDocs(userCart);
      for (const d of snap.docs) {
        await updateDoc(d.ref, { deleted: true });
      }

      setRecentOrderId(orderId);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setError("Order could not be completed.");
    }

    setProcessing(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="checkout-wrapper">
      <Navbar />

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Almost there! Complete your order below</p>
      </div>

      {/* Wave Banner */}
      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#F7C0C3"
        ></path>
      </svg>

      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="left-column">
          {/* SHIPPING BOX */}
          <div className="section-box">
            <h2 className="section-title">Shipping Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
              />
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleShippingChange}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="section-box">
            <h2 className="section-title">Payment Method</h2>

            {/* CREDIT CARD OPTION */}
            <div
              className={`payment-option ${
                paymentMethod === "card" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="radio-dot">
                {paymentMethod === "card" && <div className="inner-dot" />}
              </div>
              <span>Credit / Debit Card</span>
            </div>

            {paymentMethod === "card" && (
              <>
                {/* LIVE DIGITAL CARD */}
                <div className="live-card">
                  <div className="card-chip" />
                  <div className="live-card-number">
                    {cardInfo.cardNumber || "#### #### #### ####"}
                  </div>
                  <div className="live-card-footer">
                    <div>
                      <label>Card Holder</label>
                      <p>{cardInfo.fullName || "FULL NAME"}</p>
                    </div>
                    <div>
                      <label>Expires</label>
                      <p>{cardInfo.expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                {/* CARD FORM */}
                <div className="card-form">
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    value={cardInfo.fullName}
                    onChange={handleCardChange}
                  />

                  <input
                    name="cardNumber"
                    placeholder="Card Number"
                    value={cardInfo.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19} // 16 digits + 3 spaces
                  />

                  <div className="form-row">
                    <div className="form-group">
                      <input
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={handleCardChange}
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        name="cvv"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={handleCardChange}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <input
                    name="billingZip"
                    placeholder="Billing ZIP"
                    value={cardInfo.billingZip}
                    onChange={handleCardChange}
                  />

                  <input
                    name="country"
                    placeholder="Country"
                    value={cardInfo.country}
                    onChange={handleCardChange}
                  />
                </div>
              </>
            )}


            {/* CASH ON DELIVERY */}
            <div
              className={`payment-option ${
                paymentMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="radio-dot">
                {paymentMethod === "cod" && <div className="inner-dot" />}
              </div>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="right-column">
          <div className="summary-box">
            <h2 className="summary-title">Order Summary</h2>

            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <div style={{ flex: 1 }}>
                  <p className="item-name">{item.title}</p>
                  <p className="item-price">${item.price}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={processing}
                >
                  🗑
                </button>
              </div>
            ))}

            <div className="summary-totals">
              <p>
                Subtotal <span>${subtotal.toFixed(2)}</span>
              </p>
              <p>
                Shipping <span>${shipping.toFixed(2)}</span>
              </p>
              {appliedPromo && (
                <p>
                  Discount <span>- ${promoDiscount.toFixed(2)}</span>
                </p>
              )}
              <p className="total">
                Total <span>${total.toFixed(2)}</span>
              </p>
            </div>

            {error && (
              <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>
            )}

            <button
              className="complete-btn"
              onClick={completeOrder}
              disabled={processing}
            >
              {processing ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </div>
      </div>

      {/* POPUP THANK YOU CARD */}
      {showPopup && (
        <div className="order-popup-overlay">
          <div className="order-popup">
            <h2>🎉 Thank You!</h2>
            <p>Your order has been placed successfully.</p>

            <div className="popup-details">
              <p>
                <strong>Order ID:</strong> {recentOrderId}
              </p>
              <p>
                <strong>Total Paid:</strong> ${total.toFixed(2)}
              </p>
              <p>
                <strong>Method:</strong> {paymentMethod.toUpperCase()}
              </p>
            </div>

            <button
              className="popup-close-btn"
              onClick={() =>
                (window.location.href = `/order-success?order=${recentOrderId}`)
              }
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}