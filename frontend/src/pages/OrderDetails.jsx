import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/api";
import OrderStatusTracker from "../components/OrderStatusTracker";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { FiDollarSign } from "react-icons/fi";
import TrackingUpdate from "../components/TrackUpdate";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "payment",
    "paid",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!order) return <p className="text-center text-red-500">Order not found</p>;

  // ✅ current status index
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div>

      <WelcomeNavBar />
      <NavBar />

      


        <div className="max-w-4xl mx-auto py-8 space-y-8">
          {/* ✅ Page Header */}


          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Track</h2>
            <button
              onClick={() => (window.location.href = "/orders")}
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors"
            >
              Order List
            </button>
          </div>


          <div className="flex justify-between items-center mt-10">
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>

            {order.status === "payment" && (
              <button
                onClick={() => (window.location.href = `/order/${order.id}/billing`)}
                className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                <FiDollarSign className="mr-2 text-lg" />
                Now Pay It
              </button>
            )}
          </div>


          {/* ✅ Order Status Tracking */}
          <OrderStatusTracker currentStatus={order?.status} />



          <h2 className="text-2xl font-bold text-gray-800">Order Information</h2>
          {/* ✅ Order Info Section */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {order.status}
              </p>
              <p>
                <span className="font-semibold">Total:</span> $
                {order.total_price}
              </p>
            </div>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          {/* ✅ Items Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            {order.items?.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold">${item.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>



        <TrackingUpdate actionType="order" uid={order.id} />
        <Footer />
    </div>
  );
}
