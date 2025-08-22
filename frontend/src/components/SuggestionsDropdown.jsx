export default function SuggestionsDropdown({
  query,
  recentSearches,
  suggestions,
  products,
  onSelect,
}) {
  return (
    <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-[400px] overflow-y-auto">
      {/* 🕘 Recent Searches */}
      {query === "" && recentSearches.length > 0 && (
        <div>
          <div className="px-4 py-2 text-sm text-gray-500">Recent Searches</div>
          {recentSearches.map((search, i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(search)}
            >
              {search}
            </div>
          ))}
        </div>
      )}

      {/* 💡 Suggestions */}
      {query !== "" && suggestions.length > 0 && (
        <div>
          <div className="px-4 py-2 text-sm text-gray-500">Suggestions</div>
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item.name)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* 🛒 Product Cards */}
      {query !== "" && products.length > 0 && (
        <div className="border-t mt-2">
          <div className="px-4 py-2 text-sm text-gray-500">Recommended Products</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {products.slice(0, 4).map((product, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50"
              >
                <img
                  src={product.image || "/placeholder.png"}
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
