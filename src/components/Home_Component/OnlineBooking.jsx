import React from "react";
import { TextField, Button } from "@mui/material";
import {
  UserIcon,
  BookOpenIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
const OnlineCourse = () => {
  return (
    <div className="bg-blue-gray-600 mt-2">
      <div className="container mx-auto py-10 w-full h-1/2  mb-6">
        <div className="text-center text-white leading-16">
          <h1 className="text-4xl font-bold">Online Booking</h1>
          <p>Get inspired! Receive travel discounts, tips and behind the scenes stories.</p>
          <div className="p-2 bg-blue-gray-200 sm:w-1/2 sm:mx-auto mt-6 flex rounded-md mx-2">
            <TextField
              hiddenLabel
              id="filled-hidden-label-small"
              placeholder="Enter Your Email"
              variant="filled"
              className="!w-full !bg-white !rounded-sm"
              size="small"
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              className="!ml-3 !bg-orange-500 !text-black"
            >
              Search
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OnlineCourse;
