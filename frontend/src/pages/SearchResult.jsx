import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GETsearchResultProducts } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WelcomeNavBar from "../components/WelcomeNavBar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResult() {
  const [toastMessage, setToastMessage] = useState("");
  const query = useQuery().get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Add to Cart function
  const addToCart = (productId, productName) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.includes(productId)) {
      cart.push(productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      setToastMessage(`"${productName}" added to cart`);
    } else {
      setToastMessage(`"${productName}" is already in the cart`);
    }

    setTimeout(() => setToastMessage(""), 2000);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await GETsearchResultProducts(query);
        setProducts(data || []);
      } catch (err) {
        console.error("Search fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">
          Search results for "<span className="text-blue-600">{query}</span>"
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/details/${product.id}`)}
                className="border rounded shadow hover:shadow-lg transition duration-200 flex flex-col cursor-pointer"
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <div
                    className="text-sm text-gray-700 mb-2"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <p className="text-blue-600 font-semibold text-md mb-4">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent triggering card click
                      addToCart(product.id, product.name);
                    }}
                    className="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Toast Message */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`px-6 py-4 text-lg font-medium rounded shadow-lg transition-all duration-300
                ${
                  toastMessage.includes("already")
                    ? "bg-yellow-400 text-black"
                    : "bg-green-600 text-white"
                }
              `}
            >
              {toastMessage}
            </div>
          </div>
        )}
      </div>

      <div className="h-60"></div>
      <Footer />
    </div>
  );
}
