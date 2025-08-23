import React from "react";
import RecommendedProducts from "../components/RecommendedProducts";
import DeliveryProducts from "../components/DeliveryProduct";
import DiscountedProducts from "../components/DiscountedProduct";


const RecomPage = () => {
  return (
    <div className="recom-page" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Recommended For You</h2>
      {/* No productId passed, so general recommendations */}
      <RecommendedProducts productId={0} />

      <DiscountedProducts />
      <DeliveryProducts />
    </div>
  );
};

export default RecomPage;
