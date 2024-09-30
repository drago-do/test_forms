import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Pagination,
  Navigation,
  Mousewheel,
  Keyboard,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

export default function Carrousel({ renderElements, vertical = false }) {
  const swiperRef = useRef(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && !isUserInteracting) {
        swiperRef.current.swiper.slideNext();
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isUserInteracting]);

  const handleUserInteraction = () => {
    setIsUserInteracting(true);
  };

  return (
    <Swiper
      ref={swiperRef}
      pagination={{ clickable: true }}
      centeredSlides={true}
      loop={true}
      slidesPerView={1.2}
      modules={[Navigation, Pagination, EffectCoverflow, Mousewheel, Keyboard]}
      mousewheel={true}
      keyboard={true}
      className="mySwiper"
      style={{
        "--swiper-pagination-color": "rgb(73, 180, 232)",
        "--swiper-pagination-bullet-inactive-color": "rgb(63, 170, 222)",
      }}
      onTouchStart={handleUserInteraction} // Disable auto slide on user interaction
      onMouseEnter={handleUserInteraction} // Disable auto slide on mouse enter
    >
      {renderElements.map((component, index) => {
        return (
          <SwiperSlide key={index}>
            <div className="mt-4 p-3 pb-6">{component}</div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
