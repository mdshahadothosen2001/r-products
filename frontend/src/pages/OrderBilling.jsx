import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { postBillingInfoOrder, patchPayOrder } from "../api/api";

const OrderBilling = () => {
  const { id } = useParams(); // URL theke order ID nibe
  const orderId = id; // just for clarity
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1️⃣ Post billing info
      await postBillingInfoOrder(orderId, formData);

      // 2️⃣ Patch order status to 'paid'
      await patchPayOrder(orderId, { status: "paid" });

      Swal.fire({
        icon: "success",
        title: "Order completed",
        text: "Billing info submitted and order marked as paid.",
      });

      setFormData({
        first_name: "",
        last_name: "",
        address1: "",
        address2: "",
        city: "",
        postal_code: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label>First Name *</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label>Last Name *</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label>Address (Street, P.O. box) *</label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label>Address line 2 (Apartment, suite, unit)</label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label>City *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label>Postal/Zip code *</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Submit Order"}
      </button>
    </form>
  );
};

export default OrderBilling;
