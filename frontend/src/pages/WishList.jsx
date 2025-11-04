import React, { useEffect, useState } from "react";
import { getWishlist, deleteWishlist } from "../api/api";
import { ShoppingCart, Trash2, HeartOff } from "lucide-react";
import Swal from "sweetalert2";
import WelcomeNavBar from "../components/WelcomeNavBar";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // ✅ Load wishlist
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    getWishlist()
      .then((res) => setWishlist(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Add to cart
  const handleAddToCart = (product) => {
    if (cart.includes(product.id)) {
      setPopupMessage(`${product.name} is already in cart!`);
    } else {
      const updatedCart = [...cart, product.id];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setPopupMessage(`${product.name} added to cart!`);
    }

    // Show popup
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500); // hide after 2.5s
  };

  // ✅ Remove from wishlist with SweetAlert
  const handleRemove = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove "${name}" from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWishlist(id)
          .then(() => {
            setWishlist(wishlist.filter((item) => item.id !== id));
            Swal.fire("Removed!", `"${name}" has been removed.`, "success");
          })
          .catch((err) => console.error(err));
      }
    });
  };

  // ✅ Not logged in
  if (!localStorage.getItem("access_token")) {
    return (
      <div>

        <WelcomeNavBar />
        <NavBar />

        <div className="flex flex-col items-center justify-center mt-20 space-y-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full">
            <HeartOff size={48} className="text-pink-500" />
          </div>

          {/* Text */}
          <p className="text-xl font-semibold text-gray-700 text-center">
            Please login to view your wishlist
          </p>
          <p className="text-gray-500 text-center">
            Login to start saving your favorite products.
          </p>

          {/* Login Button */}
          <Link
            to="/login/"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
          >
            Login
          </Link>
        </div>



        <div className="h-80"></div>

        <Footer />
      </div>
    );
  }

  return (
    <div>

        <WelcomeNavBar />
        <NavBar />


        <div className="p-6 max-w-4xl mx-auto relative">
            {/* ✅ Popup after add to cart */}
            {showPopup && (
                <div className="fixed top-20 right-10 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl text-lg font-semibold flex items-center gap-3 transform transition-all duration-300 animate-bounce z-50">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {popupMessage}
                </div>
            )}

            <h2 className="flex flex-row items-center text-2xl font-bold mb-20 mt-10 text-gray-800 gap-2">
                    <HeartOff size={24} className="text-gray-400" />
                    My Wishlist
            </h2>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <HeartOff size={64} className="mb-4 text-gray-400" />
                <p className="text-lg font-medium">No items in wishlist</p>
                <p className="text-sm text-gray-400">Start adding products to see them here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                {wishlist.map((item) => (
                    <div
                    key={item.id}
                    className="flex items-center justify-between bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition"
                    >
                    <div className="flex items-center gap-4">
                        {item.product.image ? (
                        <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                        ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <ShoppingCart size={24} />
                        </div>
                        )}

                        <div>
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-gray-500">{item.product.price} BDT</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                        onClick={() => handleAddToCart(item.product)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                        >
                        <ShoppingCart size={18} />
                        Add to Cart
                        </button>
                        <button
                        onClick={() => handleRemove(item.id, item.product.name)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                        >
                        <Trash2 size={18} />
                        Remove
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
        </div>


        <div className="h-80"></div>

        <Footer />



    </div>
  );
};

export default WishList;
