import React, { useEffect, useState } from 'react';
import { GETrecomProducts } from '../api/api'; // adjust path as needed

const RecommendedProducts = ({ productIds }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds && productIds.length > 0) {
      const query = productIds.join(',');
      GETrecomProducts(query)
        .then((data) => {
          setRecommendedProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching recommended products:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productIds]);

  if (loading) {
    return <div>Loading recommended products...</div>;
  }

  if (!recommendedProducts.length) {
    return <div>No recommended products found.</div>;
  }

  return (
    <div className="recommended-products">
      <h3>Recommended Products</h3>
      <div className="products-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {recommendedProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            style={{
              width: '200px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h4 style={{ fontSize: '16px', margin: '10px 0 5px' }}>{product.name}</h4>
            <p style={{ margin: 0, color: '#555' }}>{product.brand}</p>
            <p style={{ fontWeight: 'bold', marginTop: '5px' }}>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
