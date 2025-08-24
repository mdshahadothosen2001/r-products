import React, { useEffect, useState, useRef } from 'react';
import { getRecommendations } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendedProducts = ({ productId = null }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getRecommendations(productId)
      .then((res) => {
        setRecommendedProducts(res.data);
      })
      .catch((error) => {
        console.error('Error fetching recommended products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-6">Loading recommended products...</div>;
  }

  if (!recommendedProducts.length) {
    return <div className="text-center text-gray-400 py-6">No recommended products found.</div>;
  }
  
  
  return (
    <div className="relative max-w-[1600px] mx-auto mb-10 mt-20 px-4">
      <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>

      {/* Arrow buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>

      {/* Scrollable product list */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 px-6 no-scrollbar"
        style={{
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/details/${product.id}`)}
            className="min-w-[200px] max-w-[200px] bg-white border rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-2xl"
            />
            <div className="p-3">
              <h4 className="text-sm font-medium truncate">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.brand}</p>
              <p className="text-lg font-semibold text-indigo-600 mt-1">${product.price_ceil}</p>
            </div>
          </div>
        ))}

      </div>

      
    </div>
  );
};

export default RecommendedProducts;
