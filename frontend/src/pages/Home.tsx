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


export default function HomePage() {

  return (
    <div className="min-h-screen bg-gray-100">
      
      <WelcomeNavBar />

      <NavBar />

      <Category />

      <Banner></Banner>


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
        <ForYouProducts />
      </section>


    <Footer/>
    </div>
  );
}
