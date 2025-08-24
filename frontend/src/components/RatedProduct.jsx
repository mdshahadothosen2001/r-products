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

      <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "top-rated-product-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="top-rated-product-carousel">
            {topRatedProductList.map(product => (
              <Link
                  to={`/products/details/${product.id}`}
                  key={product.id}
                  className="product-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105 flex-shrink-0 w-60"
                >
                    <div key={product.id} className="">
                      <img src={product.thumbnail} alt={product.name} />
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p><strong>Rating:</strong> {product.rating} ⭐</p>
                        <p><strong>Price:</strong> {product.price_ceil} BDT</p>
                      </div>
                    </div>
                </Link>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "top-rated-product-carousel")}
          >
            &gt;
          </button>
        </div>


    </div>
  );
};

export default TopRatedProducts;
