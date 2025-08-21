import React, { useEffect, useState } from "react";
import { getProductById, GetCartAmount, postOrder } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";

export default function CartPage() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [amounts, setAmounts] = useState({
    total_amount: 0,
    payable_amount: 0,
    saved_money: 0,
  });
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
      const products = await Promise.all(
        cartIds.map(async (id) => {
          const res = await getProductById(id);
          return { ...res.data, quantity: 1 };
        })
      );
      setCartProducts(products);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    } finally {
      setLoading(false);
    }
  };

  // API call for selected products
  const updateCartAmount = async (selected = selectedProducts, products = cartProducts) => {
    try {
      const payload = selected.map((id) => {
        const product = products.find((p) => p.id === id);
        return { product_id: product.id, quantity: product.quantity };
      });

      if (payload.length === 0) {
        setAmounts({ total_amount: 0, payable_amount: 0, saved_money: 0 });
        return;
      }

      const res = await GetCartAmount(payload);
      setAmounts(res.data);
    } catch (error) {
      console.error("Error fetching cart amounts:", error);
    }
  };

  // Quantity + / - buttons
  const handleQuantityChange = (productId, delta) => {
    const updatedProducts = cartProducts.map(p =>
      p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
    );
    setCartProducts(updatedProducts);

    if (selectedProducts.includes(productId)) {
      updateCartAmount(selectedProducts, updatedProducts);
    }
  };

  // Checkbox select/unselect
  const handleCheckboxChange = (productId, checked) => {
    let updatedSelected = [];
    if (checked) {
      updatedSelected = [...selectedProducts, productId];
    } else {
      updatedSelected = selectedProducts.filter((id) => id !== productId);
    }
    setSelectedProducts(updatedSelected);
    updateCartAmount(updatedSelected);
  };

  // Remove product
  const handleRemove = (productId) => {
    const updatedCart = cartProducts.filter((p) => p.id !== productId);
    setCartProducts(updatedCart);
    const updatedSelected = selectedProducts.filter((id) => id !== productId);
    setSelectedProducts(updatedSelected);

    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    const newCartIds = cartIds.filter((id) => id !== productId);
    localStorage.setItem("cart", JSON.stringify(newCartIds));

    updateCartAmount(updatedSelected, updatedCart);
  };

  // Confirm order
const handleConfirmOrder = async () => {
  if (selectedProducts.length === 0) return;
  setOrderLoading(true);

  const payload = selectedProducts.map((id) => {
    const product = cartProducts.find((p) => p.id === id);
    return { product_id: product.id, quantity: product.quantity };
  });

  try {
    const res = await postOrder(payload);

    // Success condition 200 or 2001
    if (res.status === 201 || res.status === 200 || res.data.code === 2001) {
      alert("Order placed successfully!");

      // Remove ordered product ids from localStorage
      const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
      const remainingCart = cartIds.filter((id) => !selectedProducts.includes(id));
      localStorage.setItem("cart", JSON.stringify(remainingCart));

      // Update cart state
      const updatedCartProducts = cartProducts.filter(
        (p) => !selectedProducts.includes(p.id)
      );
      setCartProducts(updatedCartProducts);
      setSelectedProducts([]);
      setAmounts({ total_amount: 0, payable_amount: 0, saved_money: 0 });
    } else {
      alert("Order could not be placed. Try again.");
    }
  } catch (error) {
    console.error("Order failed:", error);
    alert("Failed to place order. Try again.");
  } finally {
    setOrderLoading(false);
  }
};






  if (loading) return <h2 className="text-center text-xl mt-10">Loading...</h2>;
  if (cartProducts.length === 0)
    return <h2 className="text-center text-red-600 mt-10">Your cart is empty</h2>;

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />
      <Category />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-gray-800">
          Your Cart
        </h1>

        <div className="flex flex-col gap-6">
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-center gap-4 border p-4 rounded-lg shadow"
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                className="w-5 h-5"
              />
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-blue-600 font-semibold">${product.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-3">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemove(product.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}

          {selectedProducts.length > 0 && (
            <div className="border-t pt-4 mt-4 text-right">
              <p>Total Amount: ${amounts.total_amount.toFixed(2)}</p>
              <p>Payable Amount: ${amounts.payable_amount.toFixed(2)}</p>
              <p>Saved Money: ${amounts.saved_money.toFixed(2)}</p>
              <button
                onClick={handleConfirmOrder}
                disabled={orderLoading}
                className="bg-green-600 text-white px-6 py-3 rounded mt-2 hover:bg-green-700 transition disabled:opacity-50"
              >
                {orderLoading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-40"></div>
      <Footer />
    </div>
  );
}
