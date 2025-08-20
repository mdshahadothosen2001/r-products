import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "./style.css";
import { bannerList } from "../api/api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const sliderRef = useRef(null);
  const [banners, setBanners] = useState([]);

  const next = () => sliderRef.current.slickNext();
  const previous = () => sliderRef.current.slickPrev();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerList(); // call your API
        setBanners(response.data); // assuming axios response format
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // If no banners, render nothing
  if (!banners || banners.length === 0) return null;

  return (
    <div className="banner-section mx-auto mt-12 relative">
      <Slider {...settings} ref={sliderRef}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              className="h-[300px] w-full object-cover rounded-md"
              src={
                banner.image.startsWith("http")
                  ? banner.image
                  : `http://127.0.0.1:8000${banner.image}`
              }
              alt={banner.title || `banner-${banner.id}`}
            />
          </div>
        ))}
      </Slider>

      {/* Arrows */}
      <FaArrowLeft
        onClick={previous}
        className="text-4xl text-orange-500 absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
      />
      <FaArrowRight
        onClick={next}
        className="text-4xl text-orange-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
      />
    </div>
  );
};

export default Banner;
