import React, { useEffect, useMemo, useState } from "react";
import "./dashboardOrders.css";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();

        return {
          docId: d.id,
          orderId: data.id || d.id,
          status: data.status || "pending",
          createdAt: data.createdAt || null,
          total: data.total ?? 0,
          subtotal: data.subtotal ?? 0,
          discount: data.discount ?? 0,
          shipping: data.shipping ?? 0,
          paymentMethod: data.paymentMethod || "unknown",
          cardInfo: data.cardInfo || null,
          shippingInfo: data.shippingInfo || null,
          items: Array.isArray(data.items) ? data.items : [],
        };
      });

      setOrders(list);
    });

    return () => unsub();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const pending = orders.filter((o) => o.status === "pending").length;
    return { total, completed, processing, pending };
  }, [orders]);

  const formatDateTime = (ts) => {
    if (!ts) return "";
    try {
      const d =
        typeof ts.toDate === "function" ? ts.toDate() : new Date(ts.seconds * 1000);
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-pill status-completed";
      case "processing":
        return "status-pill status-processing";
      default:
        return "status-pill status-pending";
    }
  };

  const handleToggleCompleted = async (order) => {
    const nextStatus =
      order.status === "completed" ? "processing" : "completed";

    try {
      await updateDoc(doc(db, "orders", order.docId), { status: nextStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header-row">
        <div>
          <h1 className="orders-page-title">Orders</h1>
          <p className="orders-page-subtitle">
            Overview of all custom cake orders placed on CakeCrush.
          </p>
        </div>

        <div className="orders-header-actions">
          <div className="filter-chip-group">
            <button
              className={
                statusFilter === "all"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setStatusFilter("all")}
            >
              All ({stats.total})
            </button>

            <button
              className={
                statusFilter === "processing"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setStatusFilter("processing")}
            >
              Processing ({stats.processing})
            </button>

            <button
              className={
                statusFilter === "pending"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({stats.pending})
            </button>

            <button
              className={
                statusFilter === "completed"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      <div className="orders-card">
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Created</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="orders-empty">
                    No orders found for this filter.
                  </td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr key={order.docId}>
                  <td>
                    <button
                      className="order-id-pill"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {order.orderId}
                    </button>
                  </td>

                  <td>
                    {order.shippingInfo ? (
                      <>
                        <div className="customer-name">
                          {order.shippingInfo.firstName}{" "}
                          {order.shippingInfo.lastName}
                        </div>
                        <div className="customer-email">
                          {order.shippingInfo.email}
                        </div>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="cell-muted">{order.paymentMethod}</td>
                  <td className="cell-muted">
                    {formatDateTime(order.createdAt)}
                  </td>

                  <td className="cell-amount">€{order.total.toFixed(2)}</td>

                  <td>
                    <span className={statusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>

                  <td className="cell-actions">
                    <button
                      className="text-button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>

                    <button
                      className="text-button text-button-primary"
                      onClick={() => handleToggleCompleted(order)}
                    >
                      {order.status === "completed"
                        ? "Mark Processing"
                        : "Mark Completed"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-modal-header">
              <h2>Order {selectedOrder.orderId}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-modal-grid">
                <div>
                  <h3>Overview</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={statusClass(selectedOrder.status)}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Payment:</strong> {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <strong>Total:</strong> €
                    {selectedOrder.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> €
                    {selectedOrder.subtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Shipping:</strong> €
                    {selectedOrder.shipping.toFixed(2)}
                  </p>
                  <p>
                    <strong>Discount:</strong> €
                    {selectedOrder.discount.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3>Customer</h3>
                  {selectedOrder.shippingInfo ? (
                    <>
                      <p>
                        <strong>Name:</strong>{" "}
                        {selectedOrder.shippingInfo.firstName}{" "}
                        {selectedOrder.shippingInfo.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrder.shippingInfo.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedOrder.shippingInfo.phone}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedOrder.shippingInfo.address},{" "}
                        {selectedOrder.shippingInfo.city}{" "}
                        {selectedOrder.shippingInfo.zip}
                      </p>
                    </>
                  ) : (
                    <p>No shipping info.</p>
                  )}
                </div>
              </div>

              <div className="order-items-section">
                <h3>Items</h3>
                {selectedOrder.items.length === 0 && (
                  <p className="cell-muted">No items.</p>
                )}

                {selectedOrder.items.length > 0 && (
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.title}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.number}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            €{item.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="order-modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

              <button
                className="primary-btn"
                onClick={() => handleToggleCompleted(selectedOrder)}
              >
                {selectedOrder.status === "completed"
                  ? "Mark Processing"
                  : "Mark Completed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}