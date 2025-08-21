import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { postBillingInfoOrder, patchPayOrder } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";


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
   <div>

    <WelcomeNavBar />
    <NavBar />

    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Billing Information
      </h2>

      {/* First + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Address (Street, P.O. box) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Address line 2 (Apartment, suite, unit)
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* City + Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Postal/Zip Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          {loading ? "Processing..." : "Submit Order"}
        </button>
      </div>
    </form>






    <Footer/>
   </div>
  );
};

export default OrderBilling;
