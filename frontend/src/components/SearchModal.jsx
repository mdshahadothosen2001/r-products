export default function SearchModal({
  query,
  recentSearches,
  suggestions,
  products,
  onSelect,
  onClose,
}) {
  return (
    <div
      className="fixed top-[150px] left-[20%] w-[60%] max-h-[70vh] bg-white border rounded shadow-lg overflow-y-auto z-50"
      onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
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
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recent Searches</h3>
          {recentSearches.map((search, i) => (
            <div
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => onSelect(search)}
            >
              {search}
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {query !== "" && suggestions.length > 0 && (
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Suggestions</h3>
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => onSelect(item.name)}
            >
              {item.name}
            </div>
          ))}
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
                className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
