import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, updateCartQuantity } from "../api/api";
import CartItem from "../components/CartItem";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    fetchCart().then(res => setCart(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadCart(); }, []);

  const handleRemove = (id) => { removeFromCart(id).then(loadCart); };
  const handleChangeQuantity = (id, quantity) => { updateCartQuantity(id, quantity).then(loadCart); };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {cart.map(item => (
        <CartItem key={item.id} item={item} onRemove={handleRemove} onChangeQuantity={handleChangeQuantity} />
      ))}
    </div>
  );
}
