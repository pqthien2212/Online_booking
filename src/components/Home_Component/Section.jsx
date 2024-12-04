import React from "react";
import pic1 from "../../assets/home/pic1.jpg";
import pic2 from "../../assets/home/pic2.jpg";
import pic3 from "../../assets/home/pic3.jpg";
import { MdFlight } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { BiLandscape } from "react-icons/bi";


import { Button } from "@mui/material";

const Sections = () => {
  return (
    <div>
      <div className="md:flex md:justify-center  relative -top-40 z-20">
        <div className="flex-row md:w-1/4 h-80 shadow-2xl mx-4 mb-4 md:mb-0">
          <div className="w-full h-1/2 ">
            <img src={pic1} alt="pic1" className="w-full h-full object-cover" />
          </div>
          <div className="mx-auto w-fit relative -top-8">
            <div className="bg-white w-16 h-16 rounded-full leading-16 shadow-2xl">
              <MdFlight className="text-black w-1/2 h-1/2 mx-4 inline-block mt-2"></MdFlight>
            </div>
          </div>
          <p className=" relative text-center text-xl font-bold -top-6">
            Airline tickets
          </p>
          <div className="flex justify-center">
            <Button
              variant="contained"
              className="bg-orange-300 text-black rounded-2xl"
            >
              View more
            </Button>
          </div>
        </div>
        <div className="flex-row md:w-1/4 h-80 shadow-2xl mx-4 mb-4 md:mb-0">
          <div className="w-full h-1/2 ">
            <img src={pic2} alt="pic1" className="w-full h-full object-cover" />
          </div>
          <div className="mx-auto w-fit relative -top-8">
            <div className="bg-white w-16 h-16 rounded-full leading-16 shadow-2xl">
              <FaHotel className="text-black w-1/2 h-1/2 mx-4 inline-block mt-2"></FaHotel>
            </div>
          </div>
          <p className=" relative text-center text-xl font-bold -top-6">
            Hotel
          </p>
          <div className="flex justify-center">
            <Button
              variant="contained"
              className="bg-orange-300 text-black rounded-2xl"
            >
              View more
            </Button>
          </div>
        </div>
        <div className="flex-row md:w-1/4 h-80 shadow-2xl mx-4 mb-4 md:mb-0">
          <div className="w-full h-1/2 ">
            <img src={pic3} alt="pic1" className="w-full h-full object-cover" />
          </div>
          <div className="mx-auto w-fit relative -top-8">
            <div className="bg-white w-16 h-16 rounded-full leading-16 shadow-2xl">
              <BiLandscape  className="text-black w-1/2 h-1/2 mx-4 inline-block mt-2"></BiLandscape >
            </div>
          </div>
          <p className=" relative text-center text-xl font-bold -top-6">
          Sightseeing
          </p>
          <div className="flex justify-center">
            <Button
              variant="contained"
              className="bg-orange-300 text-black rounded-2xl"
            >
              View more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
