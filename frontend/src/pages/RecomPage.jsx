import React from "react";
import RecommendedProducts from "../components/RecommendedProducts";
import DeliveryProducts from "../components/DeliveryProduct";
import DiscountedProducts from "../components/DiscountedProduct";
import WelcomeNavBar from "../components/WelcomeNavBar";
import NavBar from "../components/NavBar";
import Category from "../components/Category";
import Footer from "../components/Footer";
import { FaStar, FaHeart, FaBolt } from "react-icons/fa"


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

      
      
      <div className="max-w-[1600px] mx-auto my-12 px-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          
          {/* Text + Icons */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Top Picks Just For You
            </h2>
            <p className="text-gray-600 mb-4 flex items-center gap-2">
              <FaHeart className="text-red-500" /> Discover products curated based on your interests and trending items.
            </p>
            <p className="text-gray-600 mb-6 flex items-center gap-2">
              <FaBolt className="text-blue-500" /> Limited-time deals you don’t want to miss!
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Explore Now
            </button>
          </div>

          {/* Image Banner */}
          <div className="flex-1">
            <img 
              src="https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FWhat_is_E_commerce_and_What_are_its_Applications_2_d2eb0d4402.jpg&w=1200&q=90" 
              alt="Top Picks" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>


      <div className="flex flex-wrap gap-4 justify-center">
        {["Electronics", "Fashion", "Home", "Books"].map((cat) => (
          <button 
            key={cat} 
            className="bg-white shadow-md px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            {cat}
          </button>
        ))}
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
