"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, Clock, Edit, X, RotateCw } from "lucide-react"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

interface Order {
  _id: string;
  work: {
    title: string;
    price: number;
    category: string;
  };
  user: {
    name: string;
    email: string;
  };
  status: string;
  totalAmount: number;
}

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await axios.post(`/api/orders/${orderId}/status`, {
        status,
      });
      console.log("Order status updated:", response.data);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Order Management Dashboard
      </h1>
      {loading ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          Loading orders...
        </p>
      ) : (
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Edit size={20} className="text-blue-500" />
                {order.work.title}
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold">Category:</span>{" "}
                {order.work.category}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Client:</span> {order.user.name}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> {order.user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Amount:</span> $
                {order.totalAmount}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "in-progress"
                      ? "bg-blue-500"
                      : order.status === "completed"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <div className="mt-4 flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "in-progress")}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <RotateCw size={16} />
                    Start Work
                  </button>
                )}
                {order.status === "in-progress" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order._id, "completed")}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      <Check size={16} />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "disputed")}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <X size={16} />
                      Dispute
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;
