import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrder } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";
import OrderTrack from "../components/OrderTrack";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrder();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading orders...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
   <div>

    <WelcomeNavBar />
    <NavBar />
    <OrderTrack />

     <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order/details/${order.id}`)}
              className="cursor-pointer border rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.status === "delivered"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-1">
                Total Price: <span className="font-medium">${order.total_price}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Date: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    <Footer />
   </div>
  );
};

export default Order;
