import React from "react";
import { Button, TextField } from "@mui/material";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="relative w-full text-white container mx-auto sm:px-6">
        <div className="flex  justify-between px-4">
         
        <div className="flex mt-1 ml-auto">
          <div className="ml-auto">
            <div className="hidden sm:flex text-center my-6 mr-6">
                <a href="#" className="mx-2">
                  Fb
                </a>
                <a href="#" className="mx-2">
                  Gg
                </a>
                <a href="#" className="mx-2">
                  Ln
                </a>
                <a href="#" className="mx-2">
                  Search
                </a>
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                className="!bg-orange-500 !text-black !mt-4 !hover:bg-purple-800"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
        <div className="sm:hidden mx-4">
          <h3 className="font-bold mb-4 text-base">Sign Up For A Newsletter</h3>
          <p className="text-gray-500">
            Weekly Breaking News Analysis And Cutting Edge Advices On Job
            Searching.
          </p>
          <div className=" flex mt-6 justify-between">
            <TextField
              id="filled-basic1"
              label="Your email here"
              variant="filled"
              className="!bg-gray-400 !rounded-sm !mr-2 !w-full"
              size="small"
            />
            <Button
              variant="contained"
              className="!float-right !bg-orange-500 !hover:bg-purple-800"
            >
              <ArrowLongRightIcon className="text-black" />
            </Button>
          </div>
        </div>
        <div className="flex flex-row mt-8 space-x-4">
          <div className="basis-4/12 hidden sm:block">
            <h3 className="font-bold mb-4 text-base">
              Sign Up For A New Member
            </h3>
            <div className=" flex mt-6 justify-between">
              <TextField
                id="filled-basic"
                label="Your email here"
                variant="filled"
                className="!bg-gray-400 !rounded-sm !mr-2 !w-full"
                size="small"
              />
              <Button
                variant="contained"
                className="!float-right !bg-orange-500 !hover:bg-purple-800"
              >
                <ArrowLongRightIcon className="text-black" />
              </Button>
            </div>
          </div>
          <div className="basis-2/12">
            <h3 className="font-bold mb-4 text-base">Our Destinations</h3>
            <ul className="text-gray-500 space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400">
                  Ha Noi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Ho Chi Minh
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Da Nang
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Da Lat
                </a>
              </li>
            </ul>
          </div>
          <div className="basis-2/12">
            <h3 className="font-bold mb-4 text-base">Products</h3>
            <ul className="text-gray-500 space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400">
                  Hotels
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Airline Tickets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Coach Tickets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                  Airport Transfers
                </a>
              </li>
            </ul>
          </div>
          <div className="basis-2/12">
            <h3 className="font-bold mb-4 text-base">Others</h3>
            <ul className="text-gray-500 space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400">
                Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                Operating Regulations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400">
                Recruitment
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center font-bold mt-24 text-white-500">Enjoy your Tour</div>
      </div>
    </footer>
  );
};

export default Footer;
