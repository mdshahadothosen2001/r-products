import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Category from "../components/Category";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res.data);
      setSelectedImage(res.data.thumbnail); // main image
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 className="text-center text-xl mt-10">Loading...</h2>;
  if (!product) return <h2 className="text-center text-red-600 mt-10">Product not found</h2>;

  // Function to parse detail/specifications with bold labels
  const formatText = (text) => {
    return text.split(/\r\n|\n/).map((line, index) => {
      if (!line.trim()) return null; // skip empty lines
      const [label, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      return (
        <p key={index} className="mb-1">
          <span className="font-semibold text-gray-700">{label}:</span>{" "}
          <span className="text-gray-600">{value}</span>
        </p>
      );
    });
  };

  return (
    <div>
      <NavBar />
      <Category />
      


      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-gray-800">{product.name}</h1>

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

            {/* Thumbnail */}
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

          {/* Right: Product info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <p className="text-gray-600 font-medium">Brand: {product.brand}</p>
            <p className="text-gray-600 font-medium">Category: {product.category_name}</p>
            {product.price && <p className="text-2xl font-bold text-blue-600">${product.price}</p>}

            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mt-2">
              Add to Cart
            </button>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex border-b border-gray-300">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "description" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "specs" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("specs")}
                >
                  Specifications
                </button>
              </div>

              <div className="mt-4 text-gray-700">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "details" && <div>{formatText(product.detail)}</div>}
                {activeTab === "specs" && (
                  <div>{formatText(product.specifications || "No specifications available")}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     <div className="h-40"></div>


      <Footer/>

    </div>
  );
}
