import { useState } from "react";
import WishlistButton from "./WishListBtn";

export default function SearchModal({
  query,
  recentSearches,
  suggestions,
  products,
  onSelect,
  onClose,
}) {
  const [addedIds, setAddedIds] = useState([]);

  const addToCart = (productId) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, productId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show "Added" state
    setAddedIds((prev) => [...prev, productId]);

    // Remove "Added" state after 2 seconds
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== productId));
    }, 2000);
  };

  return (
    <div
      className="fixed top-[150px] left-[20%] w-[60%] max-h-[70vh] bg-white border rounded shadow-lg overflow-y-auto z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <div className="flex justify-end p-2 border-b">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      {/* Recent Searches */}
      {query === "" && recentSearches.length > 0 && (
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recently Searched</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => onSelect(search)}
                className="text-sm px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Cards */}
      {query !== "" && products.length > 0 && (
        <div className="border-t mt-2 px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recommended Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.slice(0, 6).map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => onSelect(product.name)}
                >
                  <img
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.brand}</div>
                    <div className="text-sm text-green-600 font-semibold">৳ {product.price_ceil}</div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product.id)}
                  className={`ml-4 px-3 py-1 text-xs rounded ${
                    addedIds.includes(product.id)
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {addedIds.includes(product.id) ? "Added" : "Add to Cart"}
                </button>
                <WishlistButton productId={product.id}  productName={product.name}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
