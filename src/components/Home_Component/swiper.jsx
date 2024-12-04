import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import slide1 from "../../assets/courses/slide1.jpg";
import slide2 from "../../assets/courses/slide2.jpg";
import { Button } from "@material-tailwind/react";

const SliderComponent = () => {
  return (
    <div className="relative w-full h-full">
      <Swiper
        navigation={true}
        loop={true}
        slidesPerView={1}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 10000 }}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide1})` }}
          >
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50 relative">
              <div className="text-center text-white">
                <p className="mb-4">Make your tour amazing with us</p>
                <h1 className="text-5xl font-bold">Plan Your Holiday
                </h1>
                <p className="mt-4">
                  Special offers to suit your plan
                </p>
                <div className="mt-8">
                  <Button
                    className="bg-yellow-200 text-black mr-4 hover:bg-orange-500 hover:text-white transition ease-in-out duration-300"
                  >
                    Contact Us
                  </Button>
                  <Button
                    className="bg-yellow-200 text-black mr-4 hover:bg-orange-500 hover:text-white transition ease-in-out duration-300"
                  >
                    Read more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide2})` }}
          >
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50 relative">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold">Helping others LIVE & TRAVEL</h1>
                <p className="mt-4 ">
                  Travel to the any corner of the world
                </p>
                <div className="mt-8">
                  <Button
                  
                    className="bg-yellow-200 text-black mr-4 hover:bg-orange-500 hover:text-white transition ease-in-out duration-300"
                  >
                    Contact Us
                  </Button>
                  <Button
                  
                    className="bg-yellow-200 text-black mr-4 hover:bg-orange-500 hover:text-white transition ease-in-out duration-300"
                  >
                    Read more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SliderComponent;
