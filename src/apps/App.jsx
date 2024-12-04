import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "@/pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/Register";
import LoginPage from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import Cart from "../pages/Cart";
import UserProfile from "@/components/UserProfile";
import CourseSearch from "@/pages/CourseSearch";
import CourseDetail from "@/pages/CourseDetail";
import PopularTours from "../pages/PopularTours";
import CreateTour from "@/pages/CreateTour";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import Newtour from "@/pages/New_tour";
import AddVideo from "@/components/create_tour/Video";

const App = () => {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/profile/" element={<UserProfile/>} />  
        <Route path="/" element={<Layout />}>
          <Route path="/cart/" element={<Cart/>} />
        </Route>
        <Route path="/auth/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />S
          <Route path="register" element={<Register />} />
          <Route path="forget-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="popular_tours" element={<PopularTours />} />
          <Route path="popular_tours/search" element={<CourseSearch />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
        </Route>
        <Route path="/create/" element={<AdminDashboardLayout />}>
          <Route path="tour" element={<CreateTour />} />
          <Route path="new_tour" element={<Newtour />} />
          <Route path="video" element={<AddVideo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
