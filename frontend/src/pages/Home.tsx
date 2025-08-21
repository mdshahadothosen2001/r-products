import React, { useEffect, useState } from "react";
import { topRatedProducts, recentProducts, BestSellingProducts, arrivalProducts, topBrandProducts,
  newlyProducts, trendProducts, featuredProducts, freeDeliveryProducts, recentlyViewProducts, justYouProducts
 } from "../api/api";
import "./style.css";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import WelcomeNavBar from "../components/WelcomeNavBar";
import NavBar from "../components/NavBar";
import Category from "../components/Category";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  
// Products state
const [topRatedProductList, setTopRatedProducts] = useState([]);
const [recentProductList, setRecentProducts] = useState([]);
const [bestSellingProductList, setBestSellingProducts] = useState([]);
const [arrivalProductList, setArrivalProducts] = useState([]);
const [topBrandProductList, setTopBrandProducts] = useState([]);

const [newlyProductList, setNewlyProducts] = useState([]);
const [trendProductList, setTrendProducts] = useState([]);
const [featuredProductList, setFeaturedProducts] = useState([]);
const [freeDeliveryProductList, setFreeDeliveryProducts] = useState([]);
const [recentlyViewProductList, setRecentlyViewProducts] = useState([]);
const [justYouProductList, setJustYouProducts] = useState([]);

  


  // Fetch top rated products
  useEffect(() => {
    topRatedProducts()
      .then((res) => setTopRatedProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);


  // Fetch recent selling products
  useEffect(() => {
    recentProducts()
      .then((res) => setRecentProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);



  // Fetch best selling products
  useEffect(() => {
    BestSellingProducts()
      .then((res) => setBestSellingProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);


  // Fetch new arrival products
  useEffect(() => {
    arrivalProducts()
      .then((res) => setArrivalProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch top brand products
  useEffect(() => {
    topBrandProducts()
      .then((res) => setTopBrandProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);


  // Fetch newly products
  useEffect(() => {
    newlyProducts()
      .then((res) => setNewlyProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch trend products
  useEffect(() => {
    trendProducts()
      .then((res) => setTrendProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch featured products
  useEffect(() => {
    featuredProducts()
      .then((res) => setFeaturedProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch free delivery products
  useEffect(() => {
    freeDeliveryProducts()
      .then((res) => setFreeDeliveryProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch recently viewed products
  useEffect(() => {
    recentlyViewProducts()
      .then((res) => setRecentlyViewProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Fetch just for you products
  useEffect(() => {
    justYouProducts()
      .then((res) => setJustYouProducts(res.data))
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
    <div className="min-h-screen bg-gray-100">
      
      <WelcomeNavBar />

      <NavBar />

      <Category />

      <Banner></Banner>


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
            {topRatedProductList.map(product => (
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
        <h2 className="section-title">Recently Sold Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "recent-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="recent-products-carousel">
            {recentProductList.map(product => (
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
            {bestSellingProductList.map(product => (
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

          <div className="cards-container" id="new-arrivals-products-carousel">
            {arrivalProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "new-arrivals-products-carousel")}
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

          <div className="cards-container" id="top-brand-products-carousel">
            {topBrandProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "top-brand-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Newly Released Products */}
      <section className="scroll-section">
        <h2 className="section-title">Newly Released Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "newly-released-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="newly-released-products-carousel">
            {newlyProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "newly-released-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Trending Products */}
      <section className="scroll-section">
        <h2 className="section-title">Trending Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "trending-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="trending-products-carousel">
            {trendProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "trending-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Featured Categories */}
      <section className="scroll-section">
        <h2 className="section-title">Featured Categories</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "featured-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="featured-products-carousel">
            {featuredProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "featured-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>


      {/* Freee Delivery Products */}
      <section className="scroll-section">
        <h2 className="section-title">Freee Delivery Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "free-delivery-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="free-delivery-products-carousel">
            {freeDeliveryProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "free-delivery-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>



      {/* Recently Viewed Products */}
      <section className="scroll-section">
        <h2 className="section-title">Recently Viewed Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "recently-view-product-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="recently-view-product-carousel">
            {recentlyViewProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "recently-view-product-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>



      {/* Just for you Products */}
      <section className="scroll-section">
        <h2 className="section-title">Just for you Products</h2>

        <div className="scroll-carousel">
          <button 
            className="arrow left" 
            onClick={() => scrollCarousel("left", "just-for-you-products-carousel")}
          >
            &lt;
          </button>

          <div className="cards-container" id="just-for-you-products-carousel">
            {justYouProductList.map(product => (
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
            onClick={() => scrollCarousel("right", "just-for-you-products-carousel")}
          >
            &gt;
          </button>
        </div>
      </section>







    <Footer/>
    </div>
  );
}
