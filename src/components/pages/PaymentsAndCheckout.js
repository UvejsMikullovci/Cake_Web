// src/pages/PaymentsAndCheckout.js
import React, { useEffect, useMemo, useState } from "react";
import "./PaymentsAndCheckout.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function PaymentsAndCheckout() {
  const user = auth.currentUser;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | paypal | cod
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Listen to cart doc /carts/{uid}
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setCart([]);
      return;
    }
    const cartRef = doc(db, "carts", user.uid);
    const unsub = onSnapshot(
      cartRef,
      (snap) => {
        if (!snap.exists()) setCart([]);
        else setCart(snap.data().items || []);
        setLoading(false);
      },
      (err) => {
        console.error("cart snapshot error", err);
        setError("Could not load cart.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0),
    [cart]
  );

  const shipping = useMemo(() => (subtotal >= 100 ? 0 : 10), [subtotal]);

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "percent") return (subtotal * appliedPromo.value) / 100;
    if (appliedPromo.type === "fixed") return appliedPromo.value;
    return 0;
  }, [appliedPromo, subtotal]);

  const total = useMemo(() => Math.max(0, +(subtotal + shipping - promoDiscount).toFixed(2)), [
    subtotal,
    shipping,
    promoDiscount,
  ]);

  function handleShippingChange(e) {
    setShippingInfo((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  // Delete item from cart (Firestore)
  async function handleDeleteItem(itemId) {
    if (!user) return setError("You must be logged in.");
    setProcessing(true);
    try {
      const cartRef = doc(db, "carts", user.uid);
      const snap = await getDoc(cartRef);
      const items = (snap.exists() && snap.data().items) || [];
      const newItems = items.filter((i) => i.id !== itemId);
      await updateDoc(cartRef, { items: newItems });
    } catch (err) {
      console.error(err);
      setError("Could not remove item.");
    } finally {
      setProcessing(false);
    }
  }

  // Apply promo by reading Firestore /promoCodes/{CODE}
  async function handleApplyPromo() {
    setError(null);
    const code = (promoInput || "").trim().toUpperCase();
    if (!code) return setError("Enter a promo code.");
    setProcessing(true);
    try {
      const promoRef = doc(db, "promoCodes", code);
      const snap = await getDoc(promoRef);
      if (!snap.exists()) {
        setAppliedPromo(null);
        setError("Invalid promo code.");
      } else {
        const data = snap.data();
        // expected fields: { type: "percent"|"fixed"|"delivery", value: number }
        setAppliedPromo({ code, ...data });
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setAppliedPromo(null);
      setError("Promo validation failed.");
    } finally {
      setProcessing(false);
    }
  }

  // create order doc in Firestore
  async function createOrderRecord(method, paymentMeta = {}) {
    if (!user) throw new Error("Not logged in");
    const orderId = `${user.uid}_${Date.now()}`;
    const orderRef = doc(db, "orders", orderId);
    const order = {
      id: orderId,
      userId: user.uid,
      items: cart,
      subtotal,
      shipping,
      promo: appliedPromo || null,
      total,
      shippingInfo,
      method,
      paymentMeta,
      status: method === "cod" ? "pending" : "processing",
      createdAt: serverTimestamp(),
    };
    await setDoc(orderRef, order);
    return orderId;
  }

  // simulate payment (for card / paypal) -> mark paid, clear cart, redirect
  async function simulatePaymentFlow(orderId, providerName = "card") {
    // simulate realistic delay
    await new Promise((r) => setTimeout(r, 1500));

    // mark order as paid
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "paid",
      paidAt: serverTimestamp(),
      paymentProvider: providerName,
      paymentInfo: { simulated: true, provider: providerName },
    });

    // clear user's cart
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      await updateDoc(cartRef, { items: [] });
    }

    // redirect to success
    window.location.href = `/order-success?order=${orderId}`;
  }

  // complete order handler (branches by paymentMethod)
  async function handleCompleteOrder() {
    setError(null);

    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    // basic validation
    if (!shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
      setError("Please fill required shipping fields.");
      return;
    }

    setProcessing(true);
    try {
      const orderId = await createOrderRecord(paymentMethod, { simulated: true });

      if (paymentMethod === "card") {
        // Simulate redirect to Stripe Checkout by waiting and then marking paid
        // You could also open a modal or show a spinner before simulatePaymentFlow
        await simulatePaymentFlow(orderId, "stripe-sim");
        return;
      } else if (paymentMethod === "paypal") {
        // Simulate PayPal flow
        await simulatePaymentFlow(orderId, "paypal-sim");
        return;
      } else {
        // Cash on Delivery: set pending, clear cart, redirect
        // order already has status "pending"
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "pending", paymentProvider: "cod", confirmedAt: serverTimestamp() });
        // clear cart
        const cartRef = doc(db, "carts", user.uid);
        await updateDoc(cartRef, { items: [] });
        // redirect
        window.location.href = `/order-success?order=${orderId}`;
        return;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Order failed");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="checkout-wrapper">
      <Navbar />

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Almost there! Complete your order below</p>
      </div>

      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F7C0C3"></path>
      </svg>

      <div className="checkout-container">
        <div className="left-column">
          <div className="section-box">
            <h2 className="section-title">Shipping Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={shippingInfo.email} onChange={handleShippingChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={shippingInfo.phone} onChange={handleShippingChange} />
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input name="address" value={shippingInfo.address} onChange={handleShippingChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input name="city" value={shippingInfo.city} onChange={handleShippingChange} />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input name="zip" value={shippingInfo.zip} onChange={handleShippingChange} />
              </div>
            </div>
          </div>

          <div className="section-box">
            <h2 className="section-title">Payment Method</h2>

            <div className={`payment-option ${paymentMethod === "card" ? "active" : ""}`} onClick={() => setPaymentMethod("card")}>
              <div className="radio-dot" />
              <span>Credit / Debit Card</span>
            </div>

            <div className={`payment-option ${paymentMethod === "paypal" ? "active" : ""}`} onClick={() => setPaymentMethod("paypal")}>
              <div className="radio-dot" />
              <span>PayPal</span>
            </div>

            <div className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`} onClick={() => setPaymentMethod("cod")}>
              <div className="radio-dot" />
              <span>Cash on Delivery</span>
            </div>

            {paymentMethod === "card" && <div style={{ marginTop: 12 }}><small>You will be redirected to a secure payment (simulated).</small></div>}
            {paymentMethod === "paypal" && <div style={{ marginTop: 12 }}><small>PayPal flow will be simulated.</small></div>}
          </div>
        </div>

        <div className="right-column">
          <div className="summary-box">
            <h2 className="summary-title">Order Summary</h2>

            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <img src={item.image || "/images/placeholder.png"} alt={item.title} />
                <div style={{ flex: 1 }}>
                  <p className="item-name">{item.title}</p>
                  <p className="item-qty">Qty: {item.qty}</p>
                  <p className="item-price">${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)} disabled={processing}>🗑</button>
              </div>
            ))}

            <div className="promo-section">
              <label>Promo Code</label>
              <div className="promo-row">
                <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code" />
                <button className="promo-btn" onClick={handleApplyPromo} disabled={processing}>🏷</button>
              </div>
              <p className="promo-hint">Try "SWEET10" for 10% off</p>
              {appliedPromo && <p style={{ color: "#2a7a2a" }}>Applied: {appliedPromo.code} — {appliedPromo.type === "percent" ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`}</p>}
            </div>

            <div className="summary-totals">
              <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
              <p>Shipping: <span>${shipping.toFixed(2)}</span></p>
              {appliedPromo && <p>Discount: <span>- ${promoDiscount.toFixed(2)}</span></p>}
              <p className="total">Total: <span>${total.toFixed(2)}</span></p>
            </div>

            <button className="complete-btn" onClick={handleCompleteOrder} disabled={processing}>
              {processing ? "Processing..." : "Complete Order"}
            </button>

            {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
            <p className="ssl-text">🔒 Secure checkout (simulated) — production requires Stripe/PayPal keys</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
