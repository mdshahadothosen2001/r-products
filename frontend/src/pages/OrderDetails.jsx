import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { getOrderById, patchPayOrder } from "../api/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleMarkPaid = async () => {
    setUpdating(true);
    try {
      await patchPayOrder(id, { status: "paid" });
      Swal.fire({
        icon: "success",
        title: "Order Updated",
        text: "Order marked as paid.",
      });
      // Refresh order
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update order",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading order...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />


      <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order #{order.id}</h1>

      {/* Order Status */}
      <div className="flex justify-between items-center mb-6">
        <span
          className={`px-4 py-2 rounded-full font-medium text-white ${
            order.status === "paid"
              ? "bg-green-600"
              : order.status === "delivered"
              ? "bg-blue-600"
              : "bg-yellow-500"
          }`}
        >
          {order.status.toUpperCase()}
        </span>
        <button
          onClick={handleMarkPaid}
          disabled={updating || order.status === "paid"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {updating ? "Updating..." : "Mark as Paid"}
        </button>
      </div>

      {/* Billing Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <p>
          <span className="font-medium">Name:</span> {order.billing?.first_name}{" "}
          {order.billing?.last_name}
        </p>
        <p>
          <span className="font-medium">Address:</span> {order.billing?.address1},{" "}
          {order.billing?.address2 ? order.billing.address2 + ", " : ""}{" "}
          {order.billing?.city}, {order.billing?.postal_code}
        </p>
      </div>

      {/* Items List */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        {order.items?.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300"
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

      {/* Total Price */}
      <div className="bg-white shadow-md rounded-lg p-6 text-right">
        <h2 className="text-xl font-semibold">
          Total Price: ${order.total_price}
        </h2>
        <p className="text-gray-500 text-sm">
          Date: {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
    </div>


    <Footer/>


    </div>
  );
};

export default OrderDetails;
