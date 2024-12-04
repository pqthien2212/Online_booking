import React from "react";
import SliderComponent from "@/components/Home_Component/swiper";
import Sections from "@/components/Home_Component/Section";
import PopularBooking from "@/components/Home_Component/PopularBooking";
import OnlineBooking from "@/components/Home_Component/OnlineBooking";

const Home = () => {
  return (
    <div>
      <div className="h-screen">
        <SliderComponent />
      </div>
      <Sections />
      <PopularBooking />
      <OnlineBooking />
    </div>
  );
};

export default Home;
