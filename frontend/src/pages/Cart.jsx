import React, { useEffect, useState } from "react";
import { getProductById, GetCartAmount, postOrder } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart,  FaSmile, FaCoins, FaMoneyCheckAlt } from "react-icons/fa";
import FAQ from "../components/FAQ";


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

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      // Example: call your backend to validate/apply the coupon
      const res = await applyCouponAPI({ code: couponCode, products: selectedProducts });
      if (res.data.success) {
        Swal.fire({
          title: "✅ Coupon Applied",
          text: res.data.message,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });

        // Update amounts if needed
        setAmounts(res.data.updatedAmounts);
      } else {
        Swal.fire({
          title: "⚠️ Invalid Coupon",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Coupon error:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Failed to apply coupon. Try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

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

  const handleQuantityChange = (productId, delta) => {
    const updatedProducts = cartProducts.map(p =>
      p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
    );
    setCartProducts(updatedProducts);

    if (selectedProducts.includes(productId)) {
      updateCartAmount(selectedProducts, updatedProducts);
    }
  };

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

  const handleRemove = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartProducts.filter((p) => p.id !== productId);
        setCartProducts(updatedCart);

        const updatedSelected = selectedProducts.filter((id) => id !== productId);
        setSelectedProducts(updatedSelected);

        const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
        const newCartIds = cartIds.filter((id) => id !== productId);
        localStorage.setItem("cart", JSON.stringify(newCartIds));

        updateCartAmount(updatedSelected, updatedCart);

        Swal.fire("Removed!", "The product has been removed.", "success");
      }
    });
  };



  const handleConfirmOrder = async () => {
      if (selectedProducts.length === 0) return;

      // ✅ Check login
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          title: "⚠️ Login Required",
          text: "Please login to confirm your order.",
          icon: "warning",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#2563eb",
        }).then(() => {
          navigate("/login"); // redirect to login page
        });
        return;
      }

      setOrderLoading(true);

      const payload = selectedProducts.map((id) => {
          const product = cartProducts.find((p) => p.id === id);
          return { product_id: product.id, quantity: product.quantity, coupon_code: couponCode || null, };
        });

      try {
    const res = await postOrder(payload);
        const orderId = res.data?.order_id;
        const message = res.data?.message || "Operation completed";

        if ((res.status === 201 || res.status === 200 || res.data.code === 2001) && orderId) {
          Swal.fire({
            title: "✅ Success",
            text: message,
            icon: "success",
            confirmButtonColor: "#16a34a",
          }).then(() => {
            navigate(`/order/${orderId}/billing`);
          });

          // ✅ Update cart after order
          const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
          const remainingCart = cartIds.filter((id) => !selectedProducts.includes(id));
          localStorage.setItem("cart", JSON.stringify(remainingCart));

          const updatedCartProducts = cartProducts.filter(
            (p) => !selectedProducts.includes(p.id)
          );
          setCartProducts(updatedCartProducts);
          setSelectedProducts([]);
          setAmounts({ total_amount: 0, payable_amount: 0, saved_money: 0 });
          setCouponCode("");
        } else {
          Swal.fire({
            title: "⚠️ Failed",
            text: message,
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
        }
      } catch (error) {
        console.error("Order failed:", error);
        Swal.fire({
          title: "❌ Error",
          text: error?.response?.data?.message || "Failed to place order. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setOrderLoading(false);
      }
  };




  if (loading)
    return (
      <div>
        <WelcomeNavBar />
        <NavBar />
        <Category />
        <h2 className="text-center text-red-600 mt-10">Loading</h2>
      </div>
    );

  if (cartProducts.length === 0)
  return (
    <div>
      <WelcomeNavBar />
      <NavBar />
      <Category />

      <div className="flex flex-col items-center justify-center mt-20 mb-20 text-gray-500">
        <FaShoppingCart className="text-8xl mb-6 text-gray-400" />
        <h2 className="text-2xl font-semibold mb-2 text-red-600">Your cart is empty</h2>
        <p className="text-center max-w-md text-gray-600">
          Start exploring our products and add items to your cart. 
          Our main goal is to make your shopping easy and enjoyable.
        </p>
      </div>


      <div className="h-40"></div>
      <div className="h-40"></div>

      <Footer />
    </div>
  );

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />
      <Category />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-gray-800">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
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
                  <p className="text-blue-600 font-semibold">${product.price_ceil}</p>
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
          </div>

          {/* Right side - Order Summary */}
          {selectedProducts.length > 0 && (
            <div className="lg:col-span-1">
              <div className="w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${amounts.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Payable Amount:</span>
                    <span className="font-bold text-green-600">
                      ${amounts.payable_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Saved Money:</span>
                    <span className="font-semibold text-blue-600">
                      ${amounts.saved_money.toFixed(2)}
                    </span>
                  </div>
                </div>



                {/* ✅ Coupon / Discount Box */}
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="coupon">
                    Apply Coupon / Discount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter your coupon code"
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {/* <button
                      onClick={handleApplyCoupon}
                      className="bg-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      Apply
                    </button> */}
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={orderLoading}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-green-700 transition disabled:opacity-50"
                >
                  {orderLoading ? "Placing Order..." : "Confirm Order"}
                </button>
              </div>
            </div>
          )}


        </div>
      </div>

      
      <div className="h-40"></div>

      <div className="max-w-[1200px] mx-auto my-12 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Return Policy */}
        <div className="relative flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          {/* New Badge */}
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          + NEW
          </span>

          <FaSmile className="text-5xl text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">7-Day Return</h3>
          <p className="text-gray-600 text-center">
            Shop with confidence with our easy 7-day return policy.
          </p>
        </div>

        {/* Earn Points */}
        <div className="relative flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          + NEW
          </span>

          <FaCoins className="text-5xl text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Earn Points</h3>
          <p className="text-gray-600 text-center">
            Earn reward points on every purchase and save on future orders.
          </p>
        </div>

        {/* EMI Option */}
        <div className="relative flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          + NEW
          </span>

          <FaMoneyCheckAlt className="text-5xl text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">EMI Available</h3>
          <p className="text-gray-600 text-center">
            Flexible EMI options available for hassle-free shopping.
          </p>
        </div>
      </div>
      


      
      <FAQ />
      <Footer />
    </div>
  );
}
