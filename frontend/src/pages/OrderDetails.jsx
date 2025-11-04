import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, cancelOrder, returnOrder } from "../api/api";
import OrderStatusTracker from "../components/OrderStatusTracker";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { FiDollarSign } from "react-icons/fi";
import TrackingUpdate from "../components/TrackUpdate";
import OrderSummary from "../components/OrderSummary";
import OrderTrack from "../components/OrderTrack";
import RatingReview from "../components/RatingReview";
import { FaShoppingBag, FaTimesCircle, FaUndo } from "react-icons/fa";
import Swal from 'sweetalert2';


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
                ৳ Billing Address
              </button>
            )}

            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Cancel Order',
                    text: 'Are you sure you want to cancel this order?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes, cancel it',
                    cancelButtonText: 'No, keep it'
                  });

                  if (result.isConfirmed) {
                    try {
                      await cancelOrder(order.id);
                      setOrder({ ...order, status: "cancelled" });
                      Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
                      // refresh to ensure consistent state across app
                      window.location.reload();
                    } catch (err) {
                      console.error("Failed to cancel order", err);
                      Swal.fire('Error', 'Failed to cancel order. Please try again.', 'error');
                    }
                  }
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                <FaTimesCircle className="text-lg" />
                Cancel Order
              </button>
            )}


            {/* Return Order Button */}
            {order.status === "delivered" && order.order_return_condition && (
              <button
                onClick={async () => {
                  try {
                    await returnOrder(order.id);
                    setOrder({ ...order, status: "returned" }); // optional if you track returned status
                    window.location.reload();
                  } catch (err) {
                    console.error("Failed to return order", err);
                  }
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <FaUndo className="text-lg" />
                Return Order
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
        <p className="flex flex-col items-center justify-center mt-20 mb-20 text-gray-500">
          <FaShoppingBag className="text-8xl mb-4" />
          <span className="text-lg font-medium">Track Your Order Here by Order ID.</span>
          <span className="text-sm mt-2 text-center max-w-md">
            Our main goal is to make your order tracking easy and reliable.
          </span>
        </p>
      )}

      <div className="h-40"></div>
      <Footer />
    </div>
  );
}
