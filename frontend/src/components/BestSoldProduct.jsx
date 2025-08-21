import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaTrophy, FaShoppingCart } from "react-icons/fa";
import { GETbestSellingProducts } from "../api/api";
import "../pages/style.css";

const BestSoldProducts = () => {
const [bestSellingProductList, setBestSellingProducts] = useState([]);

  useEffect(() => {
      GETbestSellingProducts()
        .then((res) => setBestSellingProducts(res.data))
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
      <h2 className="section-title">Best Solds Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "best-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="best-products-carousel">
            {bestSellingProductList.map(product => (
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
                  <p><strong>Price:</strong> {product.price} BDT</p>
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11.3 1.046c.038.77.105 1.6-.08 2.528-.48 3.36-2.423 4.735-3.65 6.4-.785 1.034-1.21 2.16-1.21 3.293a3.5 3.5 0 006.97 0c0-1.164-.626-2.207-1.242-3.03.997-1.02 2.58-2.257 3.63-5.19.342-.86.514-1.63.514-2.33 0-2.485-2.015-4.5-4.5-4.5-1.004 0-1.933.37-2.64.978a4.49 4.49 0 00-1.1 1.2z" />
                    </svg>
                    10K Solds
                  </div>

                </div>
              </div>

              </Link>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "best-products-carousel")}
          >
            &gt;
          </button>
        </div>

    </div>
  );
};

export default BestSoldProducts;
