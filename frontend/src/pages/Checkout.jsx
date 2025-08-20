import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder(billingInfo);
      navigate("/orders");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={billingInfo.name} onChange={handleChange} className="border p-2 rounded" />
        <input name="address" placeholder="Address" value={billingInfo.address} onChange={handleChange} className="border p-2 rounded" />
        <input name="city" placeholder="City" value={billingInfo.city} onChange={handleChange} className="border p-2 rounded" />
        <input name="postalCode" placeholder="Postal Code" value={billingInfo.postalCode} onChange={handleChange} className="border p-2 rounded" />
        <input name="phone" placeholder="Phone" value={billingInfo.phone} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded mt-2">
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
