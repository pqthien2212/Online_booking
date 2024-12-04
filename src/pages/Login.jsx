import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from 'react';
import { useSignIn } from "react-auth-kit";
import * as Yup from "yup";
import axios, { AxiosError } from 'axios';
import FloatingLabel from "@/components/label"; // Import the custom FloatingLabel component
import { Breadcrumbs, } from "@material-tailwind/react";
import { HomeIcon, ChevronRightIcon, ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const base_url = "http://localhost:3000/"

export default function LoginPage() {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const signIn = useSignIn();

  const handleSubmit = async (data, { setErrors }) => {
    const postData = {
      email: data.email,
      password: data.password,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `${base_url}api/auth/login`,
        postData
      );

      // Lưu thông tin vào localStorage sau khi đăng nhập thành công
      localStorage.setItem('userId', response.data.userId); 
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);

      // Điều hướng người dùng đến trang chủ
      navigate("/");

    } catch (error) {
      if (error && error instanceof AxiosError) {
        setErrors({ email: error.response?.data.message || 'Login failed' });  // <-- Set error for the form
      } else if (error && error instanceof Error) {
        setErrors({ email: error.message || 'Unknown error' });  // <-- Set error for the form
      }
      console.log("Error: ", error);
    }
  };
  

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <>
      <div className="page-wraper">
        <div className="account-form">
          <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3 justify-center items-center">
            <div className="relative w-full h-full col-span-1 bg-[url('/auth/bg2.jpg')] bg-cover bg-center">
              <div className="absolute top-4 left-4 ">
                <div className="flex border-b-0 items-center mx-auto">
                  <div className="w-full flex flex-row">
                    <Breadcrumbs
                      separator={
                        <ChevronRightIcon className="h-4 w-4 text-gray-700" strokeWidth={2.5} />
                      }
                      className="bg-transparent"
                    >
                      <a
                        href="/"
                        className="flex flex-row text-lg font-bold text-black hover:text-red-900"
                      >
                      <HomeIcon className="mr-2 h-6 w-6" strokeWidth={2.5} />
                        Home
                      </a>
                    </Breadcrumbs>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-[450px] mx-auto py-8 col-span-1 md:col-span-2">
              <div className="mb-10">
                <h2 className="mb-2 leading-8 pl-2 border-l-4 border-yellow-800 text-[26px] font-bold">
                  Login to your <span className="font-light">Account</span>
                </h2>
                <p className="pt-[12px] max-w-[500px] leading-7 text-base">
                  {"Don't have an account?"}
                  <> </>
                  <Link className="text-purple-900" to="/auth/register">
                    Create one here
                  </Link>
                </p>
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={SignupSchema}
              >
                {({ errors, touched, handleChange, setErrors }) => (
                  <Form className="box-border relative mt-5">
                    <div className="-mx-[15px] flex flex-wrap box-border gap-3">
                      <div className="max-w-full relative w-full min-h-[1px] px-[15px]">
                        <div className="mb-[25px] relative  border-b-[1px] border-gray-400">
                          <div className="relative w-full block">
                            <FloatingLabel
                              htmlFor="email"
                              isFocused={emailFocused}
                              inputValue={emailValue}
                            >
                              Your Email
                            </FloatingLabel>
                            <Field
                              name="email"
                              id="email"
                              type="email"
                              required
                              className={`form-control ${
                                errors.email && touched.email
                                  ? "is-invalid"
                                  : ""
                              } w-full focus:border-none focus:outline-none`}
                              onFocus={() => setEmailFocused(true)}
                              onBlur={() => setEmailFocused(false)}
                              onChange={(e) => {
                                handleChange(e);
                                setEmailValue(e.target.value);
                              }}
                            />
                            <ErrorMessage
                              className="text-red-500"
                              name="email"
                              component="p"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="max-w-full relative w-full min-h-[1px] px-[15px]">
                        <div className="mb-[25px] relative border-b-[1px] border-gray-400">
                          <div className="relative w-full block">
                            <FloatingLabel
                              htmlFor="password"
                              isFocused={passwordFocused}
                              inputValue={passwordValue}
                            >
                              Your Password
                            </FloatingLabel>
                            <Field
                              name="password"
                              id="password"
                              type="password"
                              required
                              className={`form-control ${
                                errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                              } w-full focus:border-none focus:outline-none`}
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => setPasswordFocused(false)}
                              onChange={(e) => {
                                handleChange(e);
                                setPasswordValue(e.target.value);
                              }}
                            />

                            <ErrorMessage
                              className="text-red-500"
                              name="password"
                              component="p"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="max-w-full relative w-full min-h-[1px] px-[15px]">
                        <div className="flex mb-[25px] box-border">
                          <div className="relative flex justify-start items-center box-border gap-2">
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px] border-2 border-[#4c1864]"
                            />
                            <label htmlFor="customControlAutosizing">
                              Remember me
                            </label>
                          </div>
                          <a
                            href="forget-password"
                            className="ml-auto text-[#4c1864] hover:text-black text-base"
                          >
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                      <div className="max-w-full relative w-full min-h-[1px] px-[15px] mb-[30px]">
                        <button
                          type="submit"
                          className="btn bg-[#f7b205] button-md text-base text-black text-center rounded-sm hover:bg-[#4c1864] hover:text-white box-border px-10 py-3 font-medium"
                        >
                          Login
                        </button>
                      </div>
                      <div className="w-full flex flex-col justify-start items-start gap-3 px-[15px]">
                        <h6 className="font-medium">Login with Social media</h6>
                        <div className="w-full flex justify-center items-center gap-3">
                          <a
                            className="w-full text-white btn flex justify-center items-center gap-2 px-4 py-2 rounded-sm facebook bg-[#3B5998]"
                            href="#"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              className="w-[20px] h-[20px]"
                            >
                              <path
                                fill="#fff"
                                d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                              />
                            </svg>
                            <p className="text-[14px]">Facebook</p>
                          </a>
                          <a
                            className="w-full text-white btn flex justify-center items-center gap-2 px-4 py-2 rounded-sm facebook bg-[#e5513f]"
                            href="#"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 512"
                              className="w-[20px] h-[20px]"
                            >
                              <path
                                fill="#fff"
                                d="M386.1 228.5c1.8 9.7 3.1 19.4 3.1 32C389.2 370.2 315.6 448 204.8 448c-106.1 0-192-85.9-192-192s85.9-192 192-192c51.9 0 95.1 18.9 128.6 50.3l-52.1 50c-14.1-13.6-39-29.6-76.5-29.6-65.5 0-118.9 54.2-118.9 121.3 0 67.1 53.4 121.3 118.9 121.3 76 0 104.5-54.7 109-82.8H204.8v-66h181.3zm185.4 6.4V179.2h-56v55.7h-55.7v56h55.7v55.7h56v-55.7H627.2v-56h-55.7z"
                              />
                            </svg>
                            <p className="text-[14px]">Google Plus</p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
