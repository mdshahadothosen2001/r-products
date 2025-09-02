import "./style.css";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import WelcomeNavBar from "../components/WelcomeNavBar";
import NavBar from "../components/NavBar";
import Category from "../components/Category";
import TopRatedProducts from "../components/RatedProduct";
import RecentProducts from "../components/RecentProduct";
import BestSoldProducts from "../components/BestSoldProduct";
import ArrivalProducts from "../components/ArrivalProduct";
import BrandProducts from "../components/BrandProduct";
import NewProducts from "../components/NewProduct";
import TrendProducts from "../components/TrendProduct";
import FeaturedProducts from "../components/FeaturedProduct";
import DeliveryProducts from "../components/DeliveryProduct";
import ViewProducts from "../components/ViewProduct";
import ForYouProducts from "../components/ForYouProduct";
import DiscountedProducts from "../components/DiscountedProduct";
import FAQ from "../components/FAQ";
import AdDisplay from "../components/AdDisplay";


export default function HomePage() {

  return (
    <div className="min-h-screen bg-gray-100">
      
      <WelcomeNavBar />

      <NavBar />

      <Category />

      <Banner></Banner>

      {/* Example ad placement after banner */}
      <div className="max-w-6xl mx-auto px-4 mt-20 my-6 border border-gray-300 rounded-lg">
        <AdDisplay
          imageUrl="https://www.socialfix.com/wp-content/uploads/2021/04/ban-2.jpg"
          link="#"
          alt="Top Homepage Ad"
          imageHeight={80}
          caption={"Limited Time Offer: Up to 50% OFF"}
          ctaText={"Shop Now"}
        />
      </div>


      <section className="scroll-section">
        <TopRatedProducts />
      </section>
      
      <section className="scroll-section">
        <RecentProducts />
      </section>

      <section className="scroll-section">
        <BestSoldProducts />
      </section>

      <section className="scroll-section">
        <ArrivalProducts />
      </section>

      <section className="scroll-section">
        <BrandProducts />
      </section>

      <section className="scroll-section">
        <NewProducts />
      </section>

      <section className="scroll-section">
        <TrendProducts />
      </section>

      <section className="scroll-section">
        <FeaturedProducts />
      </section>

      <section className="scroll-section">
        <DeliveryProducts />
      </section>

      <section className="scroll-section">
        <ViewProducts />
      </section>

      <section className="scroll-section">
        <DiscountedProducts />
      </section>

      <section className="scroll-section">
        <ForYouProducts />
      </section>


      <FAQ />


    <Footer/>
    </div>
  );
}
