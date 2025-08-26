import React, { useState } from "react";
import { addWishlist } from "../api/api";
import { Heart } from "lucide-react";

const WishlistButton = ({ productId, productName }) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleAdd = () => {
    setLoading(true);
    addWishlist(productId)
      .then(() => {
        setPopupMessage(`${productName} added to wishlist!`);
        setShowPopup(true);

        // hide popup after 2.5s
        setTimeout(() => setShowPopup(false), 2500);
      })
      .catch((err) => {
        console.error(err);
        setPopupMessage(`Failed to add ${productName}`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2500);
      })
      .finally(() => setLoading(false));
  };

  // ✅ only show if logged in
  if (!localStorage.getItem("access_token")) return null;

  return (
    <div>
      {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed top-20 right-10 bg-pink-500 text-white px-6 py-4 rounded-xl shadow-2xl text-lg font-semibold flex items-center gap-3 transform transition-all duration-300 animate-bounce z-50">
          <Heart className="h-6 w-6 text-white" />
          {popupMessage}
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={loading}
        className="
          ml-2 sm:ml-5        /* Mobile small, laptop/desktop large margin */
          flex items-center gap-1 sm:gap-2  /* smaller gap on mobile, larger on bigger screens */
          px-3 py-2 sm:px-4 sm:py-2        /* padding responsive */
          border border-blue-500 text-blue-500 
          bg-transparent rounded-lg shadow
          hover:bg-blue-500 hover:text-white
          transition-colors duration-300
          text-sm sm:text-base                /* font size responsive */
        "
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" /> {/* icon size responsive */}
        {loading ? "Adding..." : "Add to Wishlist"}
      </button>
      
    </div>
  );
};

export default WishlistButton;
