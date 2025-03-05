import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, saveUser } from "../../redux/features/userSlice";
import { clearOwner, saveOwner } from "../../redux/features/OwnerSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ role = "user" }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roleType = role === "restaurantowner" ? "restaurantowner" : "user";

  const user = {
    role: roleType,
    loginAPI:
      roleType === "restaurantowner" ? "/restaurantowner/login" : "/user/login",
    profileRoute:
      roleType === "restaurantowner"
        ? "/restaurantowner/profile"
        : "/user/profile",
    signupRoute:
      roleType === "restaurantowner" ? "/restaurantowner/signup" : "/signup",
  };
  const onSubmit = async (data) => {
    try {
      console.log("Login Request:", { endpoint: user.loginAPI, data });

      const response = await axiosInstance.put(user.loginAPI, data);
      console.log("Login Successful:", response.data);

      const token = response?.data?.token;
      const userData = response?.data?.data;

      if (!token) {
        throw new Error("No token received, login failed!");
      }

      if (user.role === "restaurantowner") {
        localStorage.setItem("ownerToken", token);
        dispatch(saveOwner(userData));
      } else {
        localStorage.setItem("userToken", token);
        dispatch(saveUser(userData));
      }

      toast.success("Login Successful! Redirecting...", {
        position: "top-center",
      });

      navigate(user.profileRoute, { replace: true });
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);

      if (user.role === "restaurantowner") {
        dispatch(clearOwner());
      } else {
        dispatch(clearUser());
      }

      toast.error(
        error.response?.data?.message ||
          "Login Failed! Please check your credentials.",
        { position: "top-center" }
      );
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200 flex justify-center items-center">
      <ToastContainer />

      <div className="w-full max-w-md bg-base-100 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Login Now!</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="flex justify-between text-sm">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
            <Link
              to={user.signupRoute}
              className="label-text-alt link link-hover"
            >
              New User? Signup
            </Link>
          </div>

          <div className="form-control mt-4">
            <button className="btn btn-primary w-full">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
