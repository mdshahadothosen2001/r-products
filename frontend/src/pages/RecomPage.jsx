import React from "react";
import RecommendedProducts from "../components/RecommendedProducts";
import DeliveryProducts from "../components/DeliveryProduct";
import DiscountedProducts from "../components/DiscountedProduct";
import WelcomeNavBar from "../components/WelcomeNavBar";
import NavBar from "../components/NavBar";
import Category from "../components/Category";
import Footer from "../components/Footer";


const RecomPage = () => {
  return (
    
    <div>
      <WelcomeNavBar />
      <NavBar />
      <Category />

      <div className="recom-page" style={{ padding: "20px" }}>
        {/* No productId passed, so general recommendations */}
        <RecommendedProducts productId={0} />
      </div>

      <div className="recom-page relative max-w-[1600px] mx-auto mb-10 mt-20 px-4" style={{ padding: "20px" }}>
        <DiscountedProducts />
      </div>

      <div className="relative max-w-[1600px] mx-auto mb-10 mt-20 px-4">
        <DeliveryProducts />
      </div>

      
        


      <div className="h-40"></div>
      <Footer />
    </div>
  );
};

export default RecomPage;
