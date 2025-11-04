import React, { useState, useEffect, useRef } from "react";
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

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = 250;

    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="top-rated-products-section">
      
      <h2 className="section-title">Discounted Products</h2>

        <div className="scroll-carousel">
          <button
            className="arrow left"
            onClick={() => scrollCarousel("left")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollCarousel('left'); } }}
            aria-label="Scroll left"
          >
            &lt;
          </button>

          <div className="cards-container" id="free-delivery-products-carousel" ref={carouselRef}>
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
                      <p><strong>Price:</strong> {product.price_ceil} BDT</p>
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg mb-4 shadow-sm">
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
            onClick={() => scrollCarousel("right")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollCarousel('right'); } }}
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>

    </div>
  );
};

export default DiscountedProducts;
