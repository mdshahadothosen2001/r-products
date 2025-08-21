import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import { GETfreeDeliveryProducts } from "../api/api";
import "../pages/style.css";

const DiscountedProducts = () => {
    const [discountedProductList, setDiscountedProducts] = useState([]);

    useEffect(() => {
        GETfreeDeliveryProducts()
          .then((res) => setDiscountedProducts(res.data))
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
      
      <h2 className="section-title">Discounted Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "free-delivery-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="free-delivery-products-carousel">
            {discountedProductList.map(product => (
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
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg inline-block mb-4 shadow-sm">
                        <FaTag className="text-green-600" />
                        <span>50% Discount</span>
                      </div>
                    </div>
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

    </div>
  );
};

export default DiscountedProducts;
