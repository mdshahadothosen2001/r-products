import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, cancelOrder } from "../api/api";
import OrderStatusTracker from "../components/OrderStatusTracker";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { FiDollarSign } from "react-icons/fi";
import TrackingUpdate from "../components/TrackUpdate";
import OrderSummary from "../components/OrderSummary";
import OrderTrack from "../components/OrderTrack";
import RatingReview from "../components/RatingReview";

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
        const res = await getOrderById(id); // API hit always
        // Check if response is empty object
        setOrder(Object.keys(res.data).length ? res.data : null);
      } catch (err) {
        console.error("Failed to fetch order", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />

      

      <OrderTrack />

      {/* Order list btn only login */}
      <div className="flex justify-center">
        {localStorage.getItem("access_token") && (
          <button
            onClick={() => (window.location.href = "/orders/")}
            className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors mr-4"
          >
            Order List
          </button>
        )}
      </div>

      {order ? (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
          {/* Page Header */}


          

          <div className="flex justify-between items-center mt-10">
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>

            {order.status === "start" && (
              <button
                onClick={() => (window.location.href = `/order/${order.id}/billing`)}
                className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                <FiDollarSign className="mr-2 text-lg" />
                Billing Address
              </button>
            )}

            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={async () => {
                  try {
                    await cancelOrder(order.id);
                    setOrder({ ...order, status: "cancelled" });
                    window.location.reload();
                  } catch (err) {
                    console.error("Failed to cancel order", err);
                  }
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Order Status Tracking */}
          <OrderStatusTracker currentStatus={order.status} />

          <OrderSummary order={order} />
          <p>{order.is_review}</p>

          
          {(order.status === "cancelled" || order.status === "delivered") && (
            <RatingReview order={order} />
          )}

          
          <TrackingUpdate actionType="order" order_id={order.id} />
        </div>
      ) : (
        <p className="text-center text-gray-500 py-20">No order found.</p>
      )}

      <div className="h-40"></div>
      <Footer />
    </div>
  );
}
