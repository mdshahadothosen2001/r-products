import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { postBillingInfoOrder } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FAQ from "../components/FAQ";


const OrderBilling = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postal_code: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("billing");
  const [cardInfo, setCardInfo] = useState({ card_number: "", expiry: "", cvc: "", cardholder_name: "" });
  const [mobileInfo, setMobileInfo] = useState({ mobile_number: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // assemble payload: billing fields + optional payment fields
      const payload = {
        ...formData,
      };

      if (paymentMethod && paymentMethod !== "billing") {
        payload.payment_method = paymentMethod;
        if (paymentMethod === "card") {
          payload.card_number = cardInfo.card_number;
          payload.expiry = cardInfo.expiry;
          payload.cvc = cardInfo.cvc;
          payload.cardholder_name = cardInfo.cardholder_name;
        } else {
          // mobile banking
          payload.mobile_number = mobileInfo.mobile_number;
          payload.password = mobileInfo.password;
        }
      }

      const response = await postBillingInfoOrder(orderId, payload);

      Swal.fire({
        icon: "success",
        title: "Order completed",
        text: response.data.message || "Billing info submitted and order marked as paid.",
      });

      // Navigate to order details page using returned order_id
      navigate(`/order/details/${response.data.order_id}`);

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        postal_code: "",
      });
      setPaymentMethod("billing");
      setCardInfo({ card_number: "", expiry: "", cvc: "", cardholder_name: "" });
      setMobileInfo({ mobile_number: "", password: "" });
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
      
    <div className="flex justify-between items-center mb-20">
      <h2 className="text-2xl font-bold text-gray-800">Billing Information</h2>

      <button
        onClick={() => (window.location.href = "/orders")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Order List
      </button>

      <button
        onClick={() => (window.location.href = "/order/details/" + orderId)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
    <div className="h-20"></div>

      {/* Payment method selector */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Payment method</label>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => setPaymentMethod('billing')} className={`px-3 py-2 rounded ${paymentMethod==='billing' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Billing (Home delivery)</button>
          <button type="button" onClick={() => setPaymentMethod('card')} className={`px-3 py-2 rounded ${paymentMethod==='card' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Card</button>
          <button type="button" onClick={() => setPaymentMethod('nagad')} className={`px-3 py-2 rounded ${paymentMethod==='nagad' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Nagad</button>
          <button type="button" onClick={() => setPaymentMethod('rocket')} className={`px-3 py-2 rounded ${paymentMethod==='rocket' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Rocket</button>
          <button type="button" onClick={() => setPaymentMethod('bkash')} className={`px-3 py-2 rounded ${paymentMethod==='bkash' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>BKash</button>
        </div>
      </div>


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


      {/* Phone Number */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Payment fields when needed */}
      {paymentMethod === 'card' && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Card number"
            value={cardInfo.card_number}
            onChange={(e) => setCardInfo({ ...cardInfo, card_number: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MM/YY"
              value={cardInfo.expiry}
              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
              className="flex-1 border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              value={cardInfo.cvc}
              onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
              className="w-28 border rounded px-3 py-2"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Full name on card"
            value={cardInfo.cardholder_name}
            onChange={(e) => setCardInfo({ ...cardInfo, cardholder_name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      )}

      {['nagad','rocket','bkash'].includes(paymentMethod) && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Mobile number"
            value={mobileInfo.mobile_number}
            onChange={(e) => setMobileInfo({ ...mobileInfo, mobile_number: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password / PIN"
            value={mobileInfo.password}
            onChange={(e) => setMobileInfo({ ...mobileInfo, password: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      )}

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






    <div className="h-40"></div>
    <FAQ />
    <Footer/>
   </div>
  );
};

export default OrderBilling;
