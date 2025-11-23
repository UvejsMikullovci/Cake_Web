// src/pages/OrderSuccess.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OrderSuccess() {
  const query = useQuery();
  const orderId = query.get("order");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return setLoading(false);

      const orderRef = doc(db, "orders", orderId);
      const snap = await getDoc(orderRef);

      if (snap.exists()) {
        setOrder({
          id: snap.id,          // <-- FIX – vendos ID e dokumentit
          ...snap.data()
        });
      }

      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;

  if (!order)
    return (
      <div>
        <Navbar />
        <div style={{ padding: 40 }}>
          <h2>Order not found</h2>
        </div>
        <Footer />
      </div>
    );

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
        <h1>Thanks — your order is placed!</h1>

        <p>Order ID: <strong>{order.id}</strong></p>
        <p>Status: <strong>{order.status}</strong></p>

        <h3>Items</h3>
        <div>
          {order.items.map((it) => (
            <div key={it.id} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <img
                src={it.image || "/images/placeholder.png"}
                alt={it.title}
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                <div>Qty: {it.qty}</div>
                <div>${(it.price * it.qty).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        <h3>Shipping</h3>
        <div>{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</div>
        <div>{order.shippingInfo?.address}</div>
        <div>{order.shippingInfo?.city} — {order.shippingInfo?.zip}</div>

        <h3>Total</h3>
        <div>${order.total?.toFixed(2)}</div>
      </div>
      <Footer />
    </div>
  );
}
