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
          ml-5
          flex items-center gap-2 px-4 py-2 
          border border-blue-500 text-blue-500 
          bg-transparent rounded-lg shadow
          hover:bg-blue-500 hover:text-white
          transition-colors duration-300
        "
      >
        <Heart className="h-5 w-5" />
        {loading ? "Adding..." : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default WishlistButton;
