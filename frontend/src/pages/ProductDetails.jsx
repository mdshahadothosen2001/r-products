import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import WelcomeNavBar from "../components/WelcomeNavBar";
import RecommendedProducts from "../components/RecommendedProducts";
import FAQ from "../components/FAQ";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showPopup, setShowPopup] = useState(false);
  const relatedProductIds = [1, 2, 3, 4];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res.data);
      setSelectedImage(res.data.thumbnail);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(product.id)) {
      cart.push(product.id);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // hide after 2 seconds
  };

  if (loading)
    return <h2 className="text-center text-xl mt-10">Loading...</h2>;
  if (!product)
    return (
      <h2 className="text-center text-red-600 mt-10">Product not found</h2>
    );

  return (
    <div>
      <WelcomeNavBar />
      <NavBar />
      <Category />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-gray-800">
          {product.name}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Image gallery */}
          <div className="flex flex-col w-full lg:w-1/2">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-md mb-4"
              />
            )}
            {product.thumbnail && (
              <div className="flex gap-3">
                <img
                  src={product.thumbnail}
                  alt="thumbnail"
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => setSelectedImage(product.thumbnail)}
                />
              </div>
            )}
          </div>


          {/* Product Information */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <p className="text-gray-600 font-medium">Brand: {product.brand}</p>
            <p className="text-gray-600 font-medium">Category: {product.category_name}</p>

            {product.price_ceil && product.discount_ceil && product.discount_price ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 line-through text-lg">
                  ${Number(product.price_ceil)}
                </span>
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                  -${Number(product.discount_ceil)}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${ (Number(product.discount_price)) }
                </span>
              </div>
            ) : product.price_ceil ? (
              <span className="text-2xl font-bold text-blue-600">
                ${Number(product.price_ceil)}
              </span>
            ) : null}

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2"
            >
              Add to Cart
            </button>

          {/* Popup after add to cart */}
          {showPopup && (
            <div className="fixed top-20 right-10 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl text-lg font-semibold flex items-center gap-3 transform transition-all duration-300 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 44 84"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Product added to cart!
            </div>
          )}

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex border-b border-gray-300">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "description"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "specs"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("specs")}
                >
                  Specifications
                </button>
              </div>

              <div className="mt-4 text-gray-700">
                {activeTab === "description" && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
                {activeTab === "details" && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.detail }}
                  />
                )}
                {activeTab === "specs" && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.specifications ||
                        "<p>No specifications available</p>",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecommendedProducts productId={product.id} />
      <div className="h-40"></div>

      <FAQ />
      <Footer />
    </div>
  );
}
