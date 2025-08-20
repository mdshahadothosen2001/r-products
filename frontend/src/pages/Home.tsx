import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";
import "./style.css";
import Footer from "../components/Footer"
import HeaderUser from "../components/HeaderUser";
import productIcon from "../assets/icons/product-icon.png";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/category/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Dummy products
  const products = [
    { id: 1, name: "Smart Watch", image: "/dummy1.png", brand: "Brand A", category: "Wearables", rating: 4.5, price: "$49.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 2, name: "Hair Trimmer", image: "/dummy2.png", brand: "Brand B", category: "Grooming", rating: 4, price: "$19.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 3, name: "Universal Plug", image: "/dummy3.png", brand: "Brand C", category: "Electronics", rating: 3.8, price: "$9.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 4, name: "Electric Grill", image: "/dummy4.png", brand: "Brand D", category: "Kitchen", rating: 4.2, price: "$79.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
    { id: 5, name: "Smartphone", image: "/dummy5.png", brand: "Brand E", category: "Mobile", rating: 4.7, price: "$399.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 6, name: "Smart Watch", image: "/dummy1.png", brand: "Brand A", category: "Wearables", rating: 4.5, price: "$49.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
    { id: 7, name: "Hair Trimmer", image: "/dummy2.png", brand: "Brand B", category: "Grooming", rating: 4, price: "$19.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 8, name: "Universal Plug", image: "/dummy3.png", brand: "Brand C", category: "Electronics", rating: 3.8, price: "$9.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 9, name: "Electric Grill", image: "/dummy4.png", brand: "Brand D", category: "Kitchen", rating: 4.2, price: "$79.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
    { id: 10, name: "Smartphone", image: "/dummy5.png", brand: "Brand E", category: "Mobile", rating: 4.7, price: "$399.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 11, name: "Smart Watch", image: "/dummy1.png", brand: "Brand A", category: "Wearables", rating: 4.5, price: "$49.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
    { id: 12, name: "Hair Trimmer", image: "/dummy2.png", brand: "Brand B", category: "Grooming", rating: 4, price: "$19.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 13, name: "Universal Plug", image: "/dummy3.png", brand: "Brand C", category: "Electronics", rating: 3.8, price: "$9.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
    { id: 14, name: "Electric Grill", image: "/dummy4.png", brand: "Brand D", category: "Kitchen", rating: 4.2, price: "$79.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Single_Lens_V380_Pro_PTZ_WiFi_IP_Wireles-Non_Brand-eca42-476751.png" },
    { id: 15, name: "Smartphone", image: "/dummy5.png", brand: "Brand E", category: "Mobile", rating: 4.7, price: "$399.99", thumbnail: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Colmi_P71_Voice_Calling_19_Inch_Display_-Colmi-0f14c-367166.png" },
  ];


  const scrollCarousel = (direction, id) => {
    const container = document.getElementById(id);
    if (!container) return;

    const scrollAmount = 250; // একবারে কতটা scroll হবে

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* welcome */}
      <div className="header-links">
        <h2 className="header-links-left">Welcome</h2>
        <div className="header-links-right">
          <a href="#">Order Track</a>
          <a href="#">Recommender</a>
          <a href="#">Cart</a>
        </div>
      </div>


      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="" id="head_title">FemmeNest world</div>
        <img
          src={productIcon}
          alt="Product Icon"
          className="h-8 w-8 mr-2"
        />

        <div className="flex-1 mx-6" id="head_search">
          <input
            type="text"
            placeholder="Search by Product | Category | Brand..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <HeaderUser />
        </div>

      </nav>

      {/* Categories */}
      <div id="categories-container">
        {categories.map((cat) => (
          <button key={cat.id}>
            {cat.name}
          </button>
        ))}
      </div>


      {/* Top Rated Products Section */}
      <section className="scroll-section">
        <h2 className="section-title">Top Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "top-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="top-products-carousel">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>Rating:</strong> {product.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "top-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Recent Products */}
      <section className="scroll-section">
        <h2 className="section-title">Recent selling Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "recent-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="recent-products-carousel">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>Rating:</strong> {product.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "recent-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Best Selling Products */}
      <section className="scroll-section">
        <h2 className="section-title">Best selling Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "best-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="best-products-carousel">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>Rating:</strong> {product.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "best-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* New Arrivals Products */}
      <section className="scroll-section">
        <h2 className="section-title">New Arrivals Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "new-arrivals-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="best-products-carousel">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>Rating:</strong> {product.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "best-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>



      {/* Top brand's products */}
      <section className="scroll-section">
        <h2 className="section-title">Top brand's products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "top-brand-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="best-products-carousel">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>Rating:</strong> {product.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="arrow right" 
            onClick={() => scrollCarousel("right", "best-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>




    <Footer/>
    </div>
  );
}
