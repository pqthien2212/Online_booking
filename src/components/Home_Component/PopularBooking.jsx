import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SwiperButton from "./SwiperButton";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => (
  <div className="rounded overflow-hidden shadow-lg mx-2 sm:mx-0">
    <img className="w-full" src={course.courseThumbnail} alt="Course" />
    <div className="px-6 py-4">
      <a
        href={`/course/${course.courseId}`}
        className="font-bold text-black text-xl mb-2"
      >
        {course.title}
      </a>
      <p
        href={`/course/${course.courseId}`}
        className="text-gray-700 text-base"
      >
        {course.categoryName}
      </p>
    </div>
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {course.totalReviews} Reviews
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        3 ***
      </span>
      <span className="line-through mr-2">{course.prePrice}đ</span>
      <span className="font-bold text-xl">{course.aftPrice}đ</span>
    </div>
  </div>
);
const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .get("https://curcus-3-0.onrender.com/api/courses?page=1&size=10")
      .then((res) => {
        setCourses(res.data.payload);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container mx-auto ">
      <h2 className="text-3xl font-bold mb-6 border-l-8 border-orange-500 pl-2 ml-2 sm:ml-0">
        Popular Bookings
      </h2>
      <p className="text-gray-600 mb-10 lg:w-2/5 ml-2 sm:ml-0">
      Going somewhere to celebrate this season? Whether you're going home or somewhere to roam, we've got the travel tools to get you to your destination.
      </p>
      <div className="relative w-full h-full">
        <Swiper
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          spaceBetween={50}
          //slidesPerView={3}
          modules={[Navigation]}
          className="w-full h-full "
        >
          <SwiperButton />
          {courses
            .sort((a, b) => (a.prePrice > b.prePrice ? 1 : -1))
            .map((course, index) => (
              <SwiperSlide key={index}>
                <CourseCard course={course} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularCourses;
