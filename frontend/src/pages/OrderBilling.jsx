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
  const [payNow, setPayNow] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({ card_number: "", expiry: "", cvc: "", cardholder_name: "" });
  const [mobileInfo, setMobileInfo] = useState({ mobile_number: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    
    // Validate delivery information
    if (!formData.first_name || !formData.last_name || !formData.phone || 
        !formData.address1 || !formData.city || !formData.postal_code) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete",
        text: "Please fill in all required delivery information",
      });
      return;
    }

    // If pay_now is checked, show payment modal
    if (payNow) {
      setShowPaymentModal(true);
    } else {
      // If cash on delivery, submit directly
      submitOrder(false);
    }
  };

  const submitOrder = async (includePayment) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        pay_now: includePayment,
      };

      if (includePayment) {
        // Validate payment fields
        if (paymentMethod === "card") {
          if (!cardInfo.card_number || !cardInfo.expiry || !cardInfo.cvc) {
            Swal.fire({
              icon: "warning",
              title: "Incomplete",
              text: "Please fill in all card details",
            });
            setLoading(false);
            return;
          }
          payload.payment_method = paymentMethod;
          payload.card_number = cardInfo.card_number;
          payload.expiry = cardInfo.expiry;
          payload.cvc = cardInfo.cvc;
          payload.cardholder_name = cardInfo.cardholder_name;
        } else {
          // mobile banking
          if (!mobileInfo.mobile_number || !mobileInfo.password) {
            Swal.fire({
              icon: "warning",
              title: "Incomplete",
              text: "Please fill in mobile number and password",
            });
            setLoading(false);
            return;
          }
          payload.payment_method = paymentMethod;
          payload.mobile_number = mobileInfo.mobile_number;
          payload.password = mobileInfo.password;
        }
      }

      const response = await postBillingInfoOrder(orderId, payload);

      setShowPaymentModal(false);

      Swal.fire({
        icon: "success",
        title: "Order Confirmed!",
        text: response.data.message || "Your order has been confirmed successfully.",
      });

      // Navigate to order details page
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
      setPayNow(false);
      setPaymentMethod("card");
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
      onSubmit={handleDeliverySubmit}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6"
    >
      
    <div className="flex justify-between items-center mb-20">
      <h2 className="text-2xl font-bold text-gray-800">Delivery Information</h2>

      <button
        type="button"
        onClick={() => (window.location.href = "/orders")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Order List
      </button>

      <button
        type="button"
        onClick={() => (window.location.href = "/order/details/" + orderId)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
    <div className="h-20"></div>

      {/* Pay Now Checkbox */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={payNow}
            onChange={(e) => setPayNow(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">Pay Now (Online Payment)</span>
        </label>
        <p className="text-sm text-gray-500 mt-1 ml-7">
          {payNow ? "You will be asked for payment details after confirming delivery information" : "Cash on Delivery will be used"}
        </p>
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
          {loading ? "Processing..." : "Confirm Delivery Information"}
        </button>
      </div>
    </form>

    {/* Payment Modal */}
    {showPaymentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>

          {/* Payment method selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setPaymentMethod('card')} 
                className={`px-4 py-3 rounded-lg font-medium transition ${paymentMethod==='card' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Card
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('nagad')} 
                className={`px-4 py-3 rounded-lg font-medium transition ${paymentMethod==='nagad' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Nagad
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('rocket')} 
                className={`px-4 py-3 rounded-lg font-medium transition ${paymentMethod==='rocket' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Rocket
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('bkash')} 
                className={`px-4 py-3 rounded-lg font-medium transition ${paymentMethod==='bkash' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                BKash
              </button>
            </div>
          </div>

          {/* Payment fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-700">Card Details</h3>
              <input
                type="text"
                placeholder="Card number"
                value={cardInfo.card_number}
                onChange={(e) => setCardInfo({ ...cardInfo, card_number: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardInfo.expiry}
                  onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                  className="flex-1 border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  value={cardInfo.cvc}
                  onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                  className="w-28 border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder name"
                value={cardInfo.cardholder_name}
                onChange={(e) => setCardInfo({ ...cardInfo, cardholder_name: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {['nagad','rocket','bkash'].includes(paymentMethod) && (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-700">
                {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} Details
              </h3>
              <input
                type="text"
                placeholder="Mobile number"
                value={mobileInfo.mobile_number}
                onChange={(e) => setMobileInfo({ ...mobileInfo, mobile_number: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password / PIN"
                value={mobileInfo.password}
                onChange={(e) => setMobileInfo({ ...mobileInfo, password: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => submitOrder(true)}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}






    <div className="h-40"></div>
    <FAQ />
    <Footer/>
   </div>
  );
};

export default OrderBilling;
