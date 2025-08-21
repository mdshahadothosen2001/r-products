import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GETtopRatedProducts } from "../api/api";
import "../pages/style.css";

const TopRatedProducts = () => {
  const [topRatedProductList, setTopRatedProducts] = useState([]);

  useEffect(() => {
    GETtopRatedProducts()
      .then((res) => setTopRatedProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const scrollCarousel = (direction, id) => {
        const container = document.getElementById(id);
        if (!container) return;
        const scrollAmount = 250;

        if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

  return (
    <div className="top-rated-products-section">
      <h2 className="section-title text-2xl font-bold mb-4">Top Rating Products</h2>

      <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "free-delivery-products-carousel")}
      >
        &lt;
      </button>

      <div className="cards-container flex gap-4 overflow-x-auto" id="top-products-carousel">
        {topRatedProductList.map((product) => (
          <Link
            to={`/products/details/${product.id}`}
            key={product.id}
            className="product-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105 flex-shrink-0 w-60"
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <div className="product-info">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                <strong>Rating:</strong> {product.rating} ⭐
              </p>
            </div>
          </Link>
        ))}
      </div>

      <button 
        className="arrow right" 
        onClick={() => scrollCarousel("right", "free-delivery-products-carousel")}
      >
        &gt;
      </button>


    </div>
  );
};

export default TopRatedProducts;
