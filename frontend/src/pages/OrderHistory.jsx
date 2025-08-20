import { useEffect, useState } from "react";
import { fetchOrders } from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul className="space-y-2">
          {orders.map(order => (
            <li key={order.id} className="border p-2 rounded flex justify-between">
              <span>Order #{order.id} - ${order.total}</span>
              <Link to={`/orders/cancel/${order.id}`} className="text-red-500">Cancel</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
